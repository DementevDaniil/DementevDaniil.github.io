/* Mathematic functions */

export const pi = () => {
    return Math.PI;
};

export const d2r = (a: number) => {
    return a * (pi() / 180.0);
};
export const r2d = (a: number) => {
    return a * (180.0 / pi());
};

export const sin = (x: number) => {
    return Math.sin(x);
};
export const cos = (x: number) => {
    return Math.cos(x);
};

export const sqrt = (x: number) => {
    return Math.sqrt(x);
};

export const min = (a: number, b: number) => {
    return Math.min(a, b);
};
export const max = (a: number, b: number) => {
    return Math.max(a, b);
};

export const clamp = (x: number, a: number, b: number) => {
    return min(max(a, x), b);
};

export class Vec3 {
    x: number;
    y: number;
    z: number;

    /* Constructor.
     * ARGUMENTS:
     *   - coords:
     *       newX, newY, newZ: number;
     */
    constructor(...args: number[]) {
        if (args.length == 1) this.x = this.y = this.z = args[0];
        else (this.x = args[0]), (this.y = args[1]), (this.z = args[2]);
    } /* End of 'constructor' function */

    /* Convert vector to array
     * ARGUMETS: None.
     * RETURNS:
     *   (number[]) result vector.
     */
    toArray() {
        return [this.x, this.y, this.z];
    } /* End of 'toArray' function */

    /* Add vectors.
     * ARGUMENTS:
     *   - v vector:
     *       v: Vec3;
     * RETURNS:
     *   (Vec3) result.
     */
    add(v: Vec3) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    } /* End of 'add' function

    /* Multiply vector and number.
     * ARGUMENTS:
     *   - multiplicator:
     *       n: number;
     * RETURNS:
     *   (Vec3) new vector.
     */
    mul(n: number) {
        return new Vec3(this.x * n, this.y * n, this.z * n);
    } /* End of 'mul' function */
}

export class Vec4 {
    x: number;
    y: number;
    z: number;
    w: number;

    /* Constructor.
     * ARGUMENTS:
     *   - coords:
     *       newX, newY, newZ, newW: number;
     */
    constructor(...args: number[]) {
        if (args.length == 1) this.x = this.y = this.z = this.w = args[0];
        else
            (this.x = args[0]),
                (this.y = args[1]),
                (this.z = args[2]),
                (this.w = args[3]);
    } /* End of 'constructor' function */

    /* Convert vector to array
     * ARGUMETS: None.
     * RETURNS:
     *   (number[]) result vector.
     */
    toArray() {
        return [this.x, this.y, this.z, this.w];
    } /* End of 'toArray' function */
}

/* Matrix representation class */
export class Matr {
    A = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    /* Constructor.
     * ARGUMENTS: None.
     * RETURNS: None.
     */
    constructor(...args: number[]) {
        if (args.length == 16)
            for (let i = 0; i < 16; i++)
                this.A[Math.floor(i / 4)][i % 4] = args[i];
    } /* End of 'constructor' function */

    /* Matrix rotation around OX.
     * ARGUMENTS:
     *   - angle in degree:
     *       angle: number;
     * RETURNS:
     *   (matr) result matrix.
     */
    static rotateX(angle: number) {
        const nangle = d2r(angle);
        const co = cos(nangle);
        const si = sin(nangle);
        return new Matr(1, 0, 0, 0, 0, co, si, 0, 0, -si, co, 0, 0, 0, 0, 1);
    } /* End of 'RotateX' function */

    /* Matrix rotation around OY.
     * ARGUMENTS:
     *   - angle in degree:
     *       angle: number;
     * RETURNS:
     *   (matr) result matrix.
     */
    static rotateY(angle: number) {
        const nangle = d2r(angle);
        const co = cos(nangle);
        const si = sin(nangle);

        return new Matr(co, 0, -si, 0, 0, 1, 0, 0, si, 0, co, 0, 0, 0, 0, 1);
    } /* End of 'RotateY' function */

    /* Matrix rotation around OZ.
     * ARGUMENTS:
     *   - angle in degree:
     *       angle: number;
     * RETURNS:
     *   (matr) result matrix.
     */
    static rotateZ(angle: number) {
        const nangle = d2r(angle);
        const co = cos(nangle);
        const si = sin(nangle);

        return new Matr(co, si, 0, 0, -si, co, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    } /* End of 'RotateZ' function */

    /* Transform vector.
     * ARGUMENTS:
     *   - vector:
     *       v: Vec3;
     * RETURNS:
     *   (Vec3) result vector.
     */
    transform(v: Vec3) {
        return new Vec3(
            v.x * this.A[0][0] +
                v.y * this.A[1][0] +
                v.z * this.A[2][0] +
                this.A[3][0],
            v.x * this.A[0][1] +
                v.y * this.A[1][1] +
                v.z * this.A[2][1] +
                this.A[3][1],
            v.x * this.A[0][2] +
                v.y * this.A[1][2] +
                v.z * this.A[2][2] +
                this.A[3][2]
        );
    } /* End of 'transform' function */
} /* End of 'Matr' class */
