function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      let buf = gl.getShaderInfoLog(shader);
      console.log(buf);
    }
    return shader;
  }
  
async function loadShaderAsync(shaderName) {
  try {
    const response = await fetch(shaderName);
    const text = await response.text();
    return text;
  } catch(err) {
    console.log(err);
  }
}

function wheelResponse(e) {
}

function moveResponse(e) {
  
}

function initGL() {
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl2");
  
    gl.clearColor(1, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    const start = Date.now();
    const vs = loadShaderAsync("vert.glsl");
    const fs = loadShaderAsync("frag.glsl");

    Promise.all([vs, fs]).then((res) => {
      const vstext = res[0];
      const fstext = res[1];

      const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
      const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);
  
      const program = gl.createProgram();
      gl.attachShader(program, vertexSh);
      gl.attachShader(program, fragmentSh);
      gl.linkProgram(program);
  
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let buf = gl.getProgramInfoLog(program);
        alert(buf);
      }
  
      const posLoc = gl.getAttribLocation(program, "in_pos");
  
      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      const pos = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
      gl.useProgram(program);
      const timeFromStart = Date.now() - start;
      const loc = gl.getUniformLocation(program, "time");
      gl.uniform1f(loc, timeFromStart / 1000.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
      const render = () => {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
        gl.useProgram(program);
        const timeFromStart = Date.now() - start;
        const loc = gl.getUniformLocation(program, "time");
        gl.uniform1f(loc, timeFromStart / 1000.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
        window.requestAnimationFrame(render);
      };
      render();
    })
}
