import { Vec3, Vec4, sqrt } from '../mth';
import { UBO } from './buffer';

// Color last number index values:
//   1 - sphere
//   2 - plane

export interface IMaterial {
    typeMod: Vec4;
    ambRef: Vec4;
    diffTrans: Vec4;
    specPh: Vec4;
}

/* Shape base class */
class Shape {
    mtl: IMaterial;
    addData: Vec4[];

    /* Constructor.
     * ARGUMENTS:
     *   - type:
     *       number;
     *   - material:
     *       mtl: Material;
     */
    constructor(mtl: IMaterial) {
        this.mtl = mtl;
        this.addData = [new Vec4(0), new Vec4(0), new Vec4(0)];
    } /* End of 'constructor' function */
} /* End of 'Shape' class */

/* Sphere class */
export class Sphere extends Shape {
    /* Constructor.
     * ARGUMENTS:
     *   - center coordinates and radius:
     *       cX, cY, cZ, rad: number;
     *   - material:
     *       mtl: IMaterial;
     */
    constructor(
        cX: number,
        cY: number,
        cZ: number,
        rad: number,
        mtl: IMaterial
    ) {
        super(mtl);
        this.addData[0] = new Vec4(cX, cY, cZ, rad);
    } /* End of 'constructor' function */
} /* Ens of 'Sphere' class */

/* Plane class */
export class Plane extends Shape {
    /* Constructor.
     * ARGUMENTS:
     *   - center coordinates:
     *       cX, cY, cZ;
     *   - normal coordinates:
     *       nX, nY, nZ;
     *   - material:
     *       mtl: IMaterial;
     */
    constructor(
        cX: number,
        cY: number,
        cZ: number,
        nX: number,
        nY: number,
        nZ: number,
        mtl: IMaterial
    ) {
        super(mtl);
        let l = sqrt(nX * nX + nY * nY + nZ * nZ);
        this.addData[0] = new Vec4(cX, cY, cZ, 0);
        this.addData[1] = new Vec4(nX / l, nY / l, nZ / l, 0);
    } /* End of 'constructor' function */
} /* End of 'Plane' class */

/* Shapes collection representation class */
type AnyShape = Sphere | Plane;

export class ShapesManager {
    maximumShapesNumber = 64;
    shapesNumber = 0;
    allShapesUBO: UBO;
    shapesSet = new Map();

    /* Constructor.
     * ARGUMENTS:
     *   - WebGL rendering context:
     *       gl: WebGL2RenderingContext;
     *   - shader program:
     *       shdProgram: WebGLProgram;
     */
    constructor(gl: WebGL2RenderingContext, shdProgram: WebGLProgram) {
        let size = 4 + this.maximumShapesNumber * (3 * 4 + 4 * 4);
        this.allShapesUBO = new UBO(gl, size * 4, 1);
        let data = new Array<number>(size);
        for (let i = 0; i < data.length; i++) {
            data[i] = 0;
        }
        this.allShapesUBO.create(shdProgram, data, 'ShapesBuffer');
    } /* End of 'constructor' function */

    /* Add shape to manager.
     * ARGUMENTS:
     *   - shape:
     *       shape: AnyShape;
     *   - shape name:
     *       name: String;
     * RETURNS: None.
     */
    addShape(shape: AnyShape, name: String) {
        this.shapesSet.set(name, shape);
        this.shapesNumber++;
        let data = [this.shapesNumber, 0, 0, 0];
        for (let sh of this.shapesSet.values())
            data = data
                .concat(sh.mtl.typeMod.toArray())
                .concat(sh.mtl.ambRef.toArray())
                .concat(sh.mtl.diffTrans.toArray())
                .concat(sh.mtl.specPh.toArray())
                .concat(sh.addData[0].toArray())
                .concat(sh.addData[1].toArray())
                .concat(sh.addData[2].toArray());
        this.allShapesUBO.update(data);
    } /* End of 'addShape' function */

    /* Delete shape from manager.
     * ARGUMENTS:
     *   - shape name:
     *       name: String;
     * RETURNS: None.
     */
    deleteShape(name: String) {
        this.shapesSet.delete(name);
        this.shapesNumber--;
        let data = [this.shapesNumber, 0, 0, 0];
        for (let sh of this.shapesSet.values())
            data = data
                .concat(sh.mtl.typeMod.toArray())
                .concat(sh.mtl.ambRef.toArray())
                .concat(sh.mtl.diffTrans.toArray())
                .concat(sh.mtl.specPh.toArray())
                .concat(sh.addData[0].toArray())
                .concat(sh.addData[1].toArray())
                .concat(sh.addData[2].toArray());
        this.allShapesUBO.update(data);
    } /* End of 'addShape' function */
}
