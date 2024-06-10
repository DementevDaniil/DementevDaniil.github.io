import { Vec3, Matr } from '../mth';

/* Camera representation class */
export class Camera {
    position: Vec3;
    direction: Vec3;
    up: Vec3;

    /* Constructor.
     * ARGUMENTS:
     *   - position vector:
     *       pos: Vec3;
     *   - direction vector:
     *       dir: Vec3;
     * RETURNS: None.
     */
    constructor(pos: Vec3, dir: Vec3) {
        this.position = pos;
        this.direction = dir;
        this.up = new Vec3(0, 1, 0);
    } /* End of 'constructor' function */

    /* Transform camera.
     * ARGUMENTS:
     *   - translation:
     *       trans: Vec3;
     *   - rotation:
     *       angle: number;
     * RETURNS: None;
     */
    transform(trans: Vec3, angle: number) {} /* End of 'transform' function */
} /* End of 'Camera' class */
