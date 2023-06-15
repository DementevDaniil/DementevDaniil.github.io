import {vec3, mat4, camera} from "../mth.js"

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

export class prim {
    blockFormat = "pppnnn"
    blockSize = this.blockFormat.length * 4

    constructor(gl, type, vArray, iArray, shdName) {
        const vs = loadShaderAsync("./res/shaders/" + shdName + "/vert.vert");
        const fs = loadShaderAsync("./res/shaders/" + shdName + "/frag.frag");

        this.gl = gl
        Promise.all([vs, fs]).then((res) => {
            const vstext = res[0];
            const fstext = res[1];
        
            const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vstext);
            const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fstext);
        
            const program = gl.createProgram();
            this.program = program
            gl.attachShader(this.program, vertexSh);
            gl.attachShader(this.program, fragmentSh);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                let buf = gl.getProgramInfoLog(this.program);
                alert(buf);
            }
            
            const vertexArray = gl.createVertexArray();
            gl.bindVertexArray(vertexArray);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            this.vertexData = vArray
            this.indexData = iArray
            this.vertexArray = vertexArray
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
            
            const posLoc = gl.getAttribLocation(this.program, 'in_pos');
            const normLoc = gl.getAttribLocation(this.program, 'in_normal');
            
            gl.enableVertexAttribArray(posLoc)
            gl.enableVertexAttribArray(normLoc)

            gl.vertexAttribPointer(
                posLoc,  // location
                3,            // size (components per iteration)
                gl.FLOAT,     // type of to get from buffer
                false,        // normalize
                this.blockSize,            // stride (bytes to advance each iteration)
                0,            // offset (bytes from start of buffer)
            );

            gl.vertexAttribPointer(
                normLoc,  // location
                3,            // size (components per iteration)
                gl.FLOAT,     // type of to get from buffer
                true,        // normalize
                this.blockSize,            // stride (bytes to advance each iteration)
                12,            // offset (bytes from start of buffer)
            );

            this.type = type
            this.trans = new mat4()

            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
            gl.bindVertexArray(null);

            return this
        })
    }

    draw(cam, world) {
        this.gl.bindVertexArray(this.vertexArray);
        
        this.gl.useProgram(this.program);

        let wvp = new mat4()
        let w = new mat4()

        w.mul(this.trans.mul(world))
        let winv = new mat4(w)
        winv.inverse().transpose()
        wvp.mul(world).mul(cam.matrVP)

        const wvpLoc = this.gl.getUniformLocation(this.program, 'wvp');
        const wLoc = this.gl.getUniformLocation(this.program, 'w');
        const winvLoc = this.gl.getUniformLocation(this.program, 'winv');

        this.gl.uniformMatrix4fv(wvpLoc, false, new Float32Array(wvp.toArray()));
        this.gl.uniformMatrix4fv(wLoc, false, new Float32Array(w.toArray()));
        this.gl.uniformMatrix4fv(winvLoc, false, new Float32Array(winv.toArray()));

        this.gl.drawElements(
            this.gl.TRIANGLES,
            this.indexData.length,                // num vertices to process
            this.gl.UNSIGNED_SHORT, // type of indices
            0,                 // offset on bytes to indices
          );
    }
}