/* Base interface for all buffer classes */
class Buffer {
    gl: WebGL2RenderingContext;
    buffer: WebGLBuffer | null;
    size = 0;

    /* Constructor.
     * Arguments:
     *   - gl context:
     *       glContext: WebGL2RenderingContext;
     *   - size:
     *       size: number;
     */
    constructor(glContext: WebGL2RenderingContext, bufSize: number) {
        this.gl = glContext;
        this.buffer = this.gl.createBuffer();
        if (!this.buffer) return;
        this.size = bufSize;
    }
}

/* Uniform buffer object class */
export class UBO extends Buffer {
    data: number[];
    bindPoint: number;
    index: number;

    /* Constructor.
     * Arguments:
     *   - gl context:
     *       glContext: WebGL2RenderingContext;
     *   - size:
     *       size: number;
     *   - binding:
     *       binding: number;
     */
    constructor(
        glContext: WebGL2RenderingContext,
        size: number,
        binding: number
    ) {
        super(glContext, size);
        this.data = [];
        this.bindPoint = binding;
        this.index = -1;
    } /* End of 'constructor' function */

    /* Create UBO.
     * ARGUMENTS:
     *   - shader program:
     *       shdProgram: WebGLProgram;
     *   - data:
     *       data: number[];
     *   - name:
     *       name: string;
     * RETURNS: None.
     */
    create(shdProgram: WebGLProgram, data: number[], name: string) {
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
        this.gl.bufferData(
            this.gl.UNIFORM_BUFFER,
            this.size,
            this.gl.STATIC_DRAW
        );
        if (data.length != 0)
            this.gl.bufferSubData(
                this.gl.UNIFORM_BUFFER,
                0,
                new Float32Array(data)
            );
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
        this.index = this.gl.getUniformBlockIndex(shdProgram, name);
        this.gl.uniformBlockBinding(shdProgram, this.index, this.bindPoint);
    } /* End of 'create' function */

    /* Update buffer.
     * ARGUMENTS:
     *   - data:
     *       data: number[];
     * RETURNS: None.
     */
    update(data: number[]) {
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
        this.gl.bufferSubData(
            this.gl.UNIFORM_BUFFER,
            0,
            new Float32Array(data)
        );
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
    } /* End of 'update' function */

    /* Apply buffer.
     * ARGUMENTS: None.
     * RETURNS: None.
     */
    apply() {
        this.gl.bindBufferBase(
            this.gl.UNIFORM_BUFFER,
            this.bindPoint,
            this.buffer
        );
    } /* End of 'apply' function */
}

export class VertexBuffer {} /* End of 'VertexBuffer' class */

export class IndexBuffer {} /* End of 'IndexBuffer' class */
