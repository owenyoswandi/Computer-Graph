window.onload = function () {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Check if WebGL is available
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }


    let colordef = [0.53, 0.81, 0.92, 1.0];
    let currentColor = colordef

    let shaderProgram = initShaderProgram(gl, currentColor);
    drawOval(gl, shaderProgram);

    document.getElementById('redButton').onclick = function () {
        currentColor = [1.0, 0.0, 0.0, 1.0];
        shaderProgram = initShaderProgram(gl, currentColor);
        drawOval(gl, shaderProgram);
    };

    document.getElementById('greenButton').onclick = function () {
        currentColor = [0.0, 1.0, 0.0, 1.0];
        shaderProgram = initShaderProgram(gl, currentColor);
        drawOval(gl, shaderProgram);
    };

    document.getElementById('blueButton').onclick = function () {
        currentColor = [0.0, 0.0, 1.0, 1.0];
        shaderProgram = initShaderProgram(gl, currentColor);
        drawOval(gl, shaderProgram);
    };

    document.getElementById('resetButton').onclick = function () {
        currentColor = colordef
        shaderProgram = initShaderProgram(gl, currentColor);
        drawOval(gl, shaderProgram);
    };
};

// Draw the oval
function drawOval(gl, shaderProgram) {
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    
    // Create a buffer for the oval's positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Oval parameters
    const radiusX = 0.5;  // Horizontal radius
    const radiusY = 0.6;  // Vertical radius
    const positions = [];

    const numSegments = 100;
    for (let i = 0; i <= numSegments; i++) {
        const angle = (i / numSegments) * 2.0 * Math.PI;
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);
        positions.push(x, y);
    }

    // Pass the list of positions into WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Clear the canvas and draw the oval
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 1);
}

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, color) {
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        void main() {
            gl_FragColor = vec4(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});
        }
    `;

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}