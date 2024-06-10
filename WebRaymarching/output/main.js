var XXX = (function (exports) {
    'use strict';

    /* Mathematic functions */
    const pi = () => {
        return Math.PI;
    };
    const d2r = (a) => {
        return a * (pi() / 180.0);
    };
    const sin = (x) => {
        return Math.sin(x);
    };
    const cos = (x) => {
        return Math.cos(x);
    };
    const sqrt = (x) => {
        return Math.sqrt(x);
    };
    class Vec3 {
        x;
        y;
        z;
        /* Constructor.
         * ARGUMENTS:
         *   - coords:
         *       newX, newY, newZ: number;
         */
        constructor(...args) {
            if (args.length == 1)
                this.x = this.y = this.z = args[0];
            else
                (this.x = args[0]), (this.y = args[1]), (this.z = args[2]);
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
        add(v) {
            return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
        } /* End of 'add' function

        /* Multiply vector and number.
         * ARGUMENTS:
         *   - multiplicator:
         *       n: number;
         * RETURNS:
         *   (Vec3) new vector.
         */
        mul(n) {
            return new Vec3(this.x * n, this.y * n, this.z * n);
        } /* End of 'mul' function */
    }
    class Vec4 {
        x;
        y;
        z;
        w;
        /* Constructor.
         * ARGUMENTS:
         *   - coords:
         *       newX, newY, newZ, newW: number;
         */
        constructor(...args) {
            if (args.length == 1)
                this.x = this.y = this.z = this.w = args[0];
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
    class Matr {
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
        constructor(...args) {
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
        static rotateX(angle) {
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
        static rotateY(angle) {
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
        static rotateZ(angle) {
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
        transform(v) {
            return new Vec3(v.x * this.A[0][0] +
                v.y * this.A[1][0] +
                v.z * this.A[2][0] +
                this.A[3][0], v.x * this.A[0][1] +
                v.y * this.A[1][1] +
                v.z * this.A[2][1] +
                this.A[3][1], v.x * this.A[0][2] +
                v.y * this.A[1][2] +
                v.z * this.A[2][2] +
                this.A[3][2]);
        } /* End of 'transform' function */
    } /* End of 'Matr' class */

    /* Time handle class */
    class Timer {
        isPause = false;
        #startTime;
        #oldTime;
        #pauseTime;
        #timePerSec;
        globalTime = 0;
        globalDeltaTime = 0;
        time = 0;
        deltaTime = 0;
        /* Constructor.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        constructor() {
            this.#timePerSec = 1000;
            this.#pauseTime = 0;
            this.#startTime = this.#oldTime = Date.now();
        } /* End of 'constructor' function */
        /* Update.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        update() {
            this.globalTime = (Date.now() - this.#startTime) / this.#timePerSec;
            this.globalDeltaTime = (Date.now() - this.#oldTime) / this.#timePerSec;
            if (this.isPause) {
                this.deltaTime = 0;
                this.#pauseTime += Date.now() - this.#oldTime;
            }
            else {
                this.deltaTime = this.globalDeltaTime;
                this.time =
                    (Date.now() - this.#pauseTime - this.#startTime) /
                        this.#timePerSec;
            }
            this.#oldTime = Date.now();
        } /* End of 'update' function */
    }

    /* Camera representation class */
    class Camera {
        position;
        direction;
        up;
        /* Constructor.
         * ARGUMENTS:
         *   - position vector:
         *       pos: Vec3;
         *   - direction vector:
         *       dir: Vec3;
         * RETURNS: None.
         */
        constructor(pos, dir) {
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
        transform(trans, angle) { } /* End of 'transform' function */
    } /* End of 'Camera' class */

    /* Base interface for all buffer classes */
    class Buffer {
        gl;
        buffer;
        size = 0;
        /* Constructor.
         * Arguments:
         *   - gl context:
         *       glContext: WebGL2RenderingContext;
         *   - size:
         *       size: number;
         */
        constructor(glContext, bufSize) {
            this.gl = glContext;
            this.buffer = this.gl.createBuffer();
            if (!this.buffer)
                return;
            this.size = bufSize;
        }
    }
    /* Uniform buffer object class */
    class UBO extends Buffer {
        data;
        bindPoint;
        index;
        /* Constructor.
         * Arguments:
         *   - gl context:
         *       glContext: WebGL2RenderingContext;
         *   - size:
         *       size: number;
         *   - binding:
         *       binding: number;
         */
        constructor(glContext, size, binding) {
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
        create(shdProgram, data, name) {
            this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.UNIFORM_BUFFER, this.size, this.gl.STATIC_DRAW);
            if (data.length != 0)
                this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, new Float32Array(data));
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
        update(data) {
            this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
            this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, new Float32Array(data));
            this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
        } /* End of 'update' function */
        /* Apply buffer.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        apply() {
            this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, this.bindPoint, this.buffer);
        } /* End of 'apply' function */
    }

    /* Shape base class */
    class Shape {
        mtl;
        addData;
        /* Constructor.
         * ARGUMENTS:
         *   - type:
         *       number;
         *   - material:
         *       mtl: Material;
         */
        constructor(mtl) {
            this.mtl = mtl;
            this.addData = [new Vec4(0), new Vec4(0), new Vec4(0)];
        } /* End of 'constructor' function */
    } /* End of 'Shape' class */
    /* Sphere class */
    class Sphere extends Shape {
        /* Constructor.
         * ARGUMENTS:
         *   - center coordinates and radius:
         *       cX, cY, cZ, rad: number;
         *   - material:
         *       mtl: IMaterial;
         */
        constructor(cX, cY, cZ, rad, mtl) {
            super(mtl);
            this.addData[0] = new Vec4(cX, cY, cZ, rad);
        } /* End of 'constructor' function */
    } /* Ens of 'Sphere' class */
    /* Plane class */
    class Plane extends Shape {
        /* Constructor.
         * ARGUMENTS:
         *   - center coordinates:
         *       cX, cY, cZ;
         *   - normal coordinates:
         *       nX, nY, nZ;
         *   - material:
         *       mtl: IMaterial;
         */
        constructor(cX, cY, cZ, nX, nY, nZ, mtl) {
            super(mtl);
            let l = sqrt(nX * nX + nY * nY + nZ * nZ);
            this.addData[0] = new Vec4(cX, cY, cZ, 0);
            this.addData[1] = new Vec4(nX / l, nY / l, nZ / l, 0);
        } /* End of 'constructor' function */
    } /* End of 'Plane' class */
    class ShapesManager {
        maximumShapesNumber = 64;
        shapesNumber = 0;
        allShapesUBO;
        shapesSet = new Map();
        /* Constructor.
         * ARGUMENTS:
         *   - WebGL rendering context:
         *       gl: WebGL2RenderingContext;
         *   - shader program:
         *       shdProgram: WebGLProgram;
         */
        constructor(gl, shdProgram) {
            let size = 4 + this.maximumShapesNumber * (3 * 4 + 4 * 4);
            this.allShapesUBO = new UBO(gl, size * 4, 1);
            let data = new Array(size);
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
        addShape(shape, name) {
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
        deleteShape(name) {
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

    /* Input class */
    class Input {
        buttonW;
        buttonA;
        buttonS;
        buttonD;
        /* Constructor.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        constructor() {
            this.buttonW = 0;
            this.buttonA = 0;
            this.buttonS = 0;
            this.buttonD = 0;
            window.addEventListener('keydown', (e) => {
                if (e.key == 'w')
                    this.buttonW = 1;
                if (e.key == 'a')
                    this.buttonA = 1;
                if (e.key == 's')
                    this.buttonS = 1;
                if (e.key == 'd')
                    this.buttonD = 1;
            });
            window.addEventListener('keyup', (e) => {
                if (e.key == 'w')
                    this.buttonW = 0;
                if (e.key == 'a')
                    this.buttonA = 0;
                if (e.key == 's')
                    this.buttonS = 0;
                if (e.key == 'd')
                    this.buttonD = 0;
            });
        } /* End of 'constructor' function */
    } /* End of 'Input' class */
    /* Control class */
    class Control extends Input {
        shapesManager;
        #isSettings = false;
        #isDeleting = false;
        rotate;
        /* Constructor.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        constructor() {
            super();
            this.shapesManager = null;
            this.rotate = new Vec3(0);
        } /* End of 'constructor' function */
        /* Start watcher.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        start(shpManager) {
            this.shapesManager = shpManager;
            let selButton = document.getElementById('SelectButton');
            if (selButton)
                selButton.onclick = () => {
                    this.selectResponse();
                };
            let delButton = document.getElementById('SelectDeletedButton');
            if (delButton)
                delButton.onclick = () => {
                    this.deleteResponse();
                };
        } /* End of 'setWatcher' function */
        /* Add sphere to scene.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        #addSphere() {
            const posX = document.getElementById('PosX');
            const posY = document.getElementById('PosY');
            const posZ = document.getElementById('PosZ');
            const rad = document.getElementById('Radius');
            const check = document.getElementById('Checker');
            const amb = document.getElementById('Ambient');
            const ref = document.getElementById('Refr');
            const diff = document.getElementById('Diffuse');
            const trans = document.getElementById('Trans');
            const spec = document.getElementById('Specular');
            const ph = document.getElementById('Ph');
            const mtl = {
                typeMod: new Vec4(1, Number(check.checked), 0, 0),
                ambRef: new Vec4(parseInt(amb.value.substring(1, 3), 16) / 255, parseInt(amb.value.substring(3, 5), 16) / 255, parseInt(amb.value.substring(5), 16) / 255, parseInt(ref.value)),
                diffTrans: new Vec4(parseInt(diff.value.substring(1, 3), 16) / 255, parseInt(diff.value.substring(3, 5), 16) / 255, parseInt(diff.value.substring(5), 16) / 255, parseInt(trans.value)),
                specPh: new Vec4(parseInt(spec.value.substring(1, 3), 16) / 255, parseInt(spec.value.substring(3, 5), 16) / 255, parseInt(spec.value.substring(5), 16) / 255, parseInt(ph.value))
            };
            let s = new Sphere(Number(posX.value), Number(posY.value), Number(posZ.value), Number(rad.value), mtl);
            const name = document.getElementById('ShapeName');
            this.shapesManager?.addShape(s, name.value);
            this.#isSettings = false;
            document.getElementById('Settings')?.remove();
            document.getElementById('PosX')?.remove();
            document.getElementById('PosY')?.remove();
            document.getElementById('PosZ')?.remove();
            document.getElementById('Radius')?.remove();
            document.getElementById('Ambient')?.remove();
            document.getElementById('Refr')?.remove();
            document.getElementById('Diffuse')?.remove();
            document.getElementById('Trans')?.remove();
            document.getElementById('Specular')?.remove();
            document.getElementById('Ph')?.remove();
            document.getElementById('ShapeName')?.remove();
            document.getElementById('Checker')?.remove();
            document.getElementById('AmbLabel')?.remove();
            document.getElementById('DiffLabel')?.remove();
            document.getElementById('TransLabel')?.remove();
            document.getElementById('SpecLabel')?.remove();
            document.getElementById('CheckerLabel')?.remove();
            document.getElementById('AffirmSettings')?.remove();
            document.getElementById('Help0')?.remove();
            document.getElementById('Help1')?.remove();
            document.getElementById('Help2')?.remove();
        } /* End of '#addSphere' function */
        /* Add plane to scene.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        #addPlane() {
            const posX = document.getElementById('PosX');
            const posY = document.getElementById('PosY');
            const posZ = document.getElementById('PosZ');
            const normX = document.getElementById('NormX');
            const normY = document.getElementById('NormY');
            const normZ = document.getElementById('NormZ');
            const check = document.getElementById('Checker');
            const amb = document.getElementById('Ambient');
            const ref = document.getElementById('Refr');
            const diff = document.getElementById('Diffuse');
            const trans = document.getElementById('Trans');
            const spec = document.getElementById('Specular');
            const ph = document.getElementById('Ph');
            const mtl = {
                typeMod: new Vec4(2, Number(check.checked), 0, 0),
                ambRef: new Vec4(parseInt(amb.value.substring(1, 3), 16) / 255, parseInt(amb.value.substring(3, 5), 16) / 255, parseInt(amb.value.substring(5), 16) / 255, parseInt(ref.value)),
                diffTrans: new Vec4(parseInt(diff.value.substring(1, 3), 16) / 255, parseInt(diff.value.substring(3, 5), 16) / 255, parseInt(diff.value.substring(5), 16) / 255, parseInt(trans.value)),
                specPh: new Vec4(parseInt(spec.value.substring(1, 3), 16) / 255, parseInt(spec.value.substring(3, 5), 16) / 255, parseInt(spec.value.substring(5), 16) / 255, parseInt(ph.value))
            };
            let s = new Plane(Number(posX.value), Number(posY.value), Number(posZ.value), Number(normX.value), Number(normY.value), Number(normZ.value), mtl);
            const name = document.getElementById('ShapeName');
            this.shapesManager?.addShape(s, name.value);
            this.#isSettings = false;
            document.getElementById('Settings')?.remove();
            document.getElementById('PosX')?.remove();
            document.getElementById('PosY')?.remove();
            document.getElementById('PosZ')?.remove();
            document.getElementById('NormX')?.remove();
            document.getElementById('NormY')?.remove();
            document.getElementById('NormZ')?.remove();
            document.getElementById('Ambient')?.remove();
            document.getElementById('Refr')?.remove();
            document.getElementById('Diffuse')?.remove();
            document.getElementById('Trans')?.remove();
            document.getElementById('Specular')?.remove();
            document.getElementById('Ph')?.remove();
            document.getElementById('ShapeName')?.remove();
            document.getElementById('Checker')?.remove();
            document.getElementById('AmbLabel')?.remove();
            document.getElementById('DiffLabel')?.remove();
            document.getElementById('TransLabel')?.remove();
            document.getElementById('SpecLabel')?.remove();
            document.getElementById('CheckerLabel')?.remove();
            document.getElementById('AffirmSettings')?.remove();
            document.getElementById('Help0')?.remove();
            document.getElementById('Help1')?.remove();
            document.getElementById('Help2')?.remove();
        } /* End of '#addPlane' function */
        /* Add sphere to scene.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        #deleteShape() {
            let delSelect = document.getElementById('DeleteSelector');
            let name = delSelect.value;
            this.shapesManager?.deleteShape(name);
            this.#isDeleting = false;
            document.getElementById('DeleteSelector')?.remove();
            document.getElementById('AffirmDeleting')?.remove();
        } /* End of '#deleteShape' function */
        /* Select response.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        selectResponse() {
            if (this.#isSettings)
                return;
            this.#isSettings = true;
            const select = document.querySelector('select');
            if (!select)
                return;
            const selectedValue = select.value;
            if (selectedValue == 'Sphere') {
                // Add new settings elements on the page
                let fr = document.createDocumentFragment();
                let tmp = document.createElement('div');
                tmp.innerHTML = `<table id="Settings">
                <tr id="Help0">
                    <input type="text" id="PosX" size="3" placeholder="PosX"/>
                    <input type="text" id="PosY" size="3" placeholder="PosY"/>
                    <input type="text" id="PosZ" size="3" placeholder="PosZ"/>
                    <input type="text" id="Radius" size="3" placeholder="Rad"/>
                    <input type="text" id="ShapeName" size="3" placeholder="Name"/>
                    <label for="Checker" id="CheckerLabel">Checker</label><input type="checkbox" id="Checker"/>
                    <input type="button" id="AffirmSettings" value="Confirm"/>
                </tr><br id="Help1">
                <tr id="Help2">
                    <label for="Ambient" id="AmbLabel">Amb</label><input type="color" id="Ambient"/>
                    <input type="text" id="Refr" size="3" placeholder="RefCoef"/>
                    <label for="Diffuse" id="DiffLabel"> Diff</label><input type="color" id="Diffuse"/>
                    <label for="Trans" id="TransLabel"> Trans</label><input type="range" id="Trans" name="Trans" min="0" max="1" value="1" step="0.1" width="40px"/>
                    <label for="Specular" id="SpecLabel"> Spec</label><input type="color" id="Specular"/>
                    <input type="text" id="Ph" size="3" placeholder="Phong"/>
                </tr>
            </table>`;
                while (tmp.firstChild) {
                    fr.appendChild(tmp.firstChild);
                }
                let insBefore = document.getElementById('AfterSettingsTable');
                if (!insBefore)
                    return;
                let parent = insBefore.parentNode;
                if (!parent)
                    return;
                parent.insertBefore(fr, insBefore);
                // Get messages from settings elements
                let confButton = document.getElementById('AffirmSettings');
                if (confButton)
                    confButton.onclick = () => {
                        this.#addSphere();
                    };
            }
            else if (selectedValue == 'Plane') {
                // Add new settings elements on the page
                let fr = document.createDocumentFragment();
                let tmp = document.createElement('div');
                tmp.innerHTML = `<table id="Settings">
                <tr id="Help0">
                    <input type="text" id="PosX" size="3" placeholder="PosX"/>
                    <input type="text" id="PosY" size="3" placeholder="PosY"/>
                    <input type="text" id="PosZ" size="3" placeholder="PosZ"/>
                    <input type="text" id="NormX" size="3" placeholder="NormX"/>
                    <input type="text" id="NormY" size="3" placeholder="NormY"/>
                    <input type="text" id="NormZ" size="3" placeholder="NormZ"/>
                    <input type="text" id="ShapeName" size="3" placeholder="Name"/>
                    <label for="Checker" id="CheckerLabel">Checker</label><input type="checkbox" id="Checker"/>
                    <input type="button" id="AffirmSettings" value="Confirm"/>
                </tr><br id="Help1">
                <tr id="Help2">
                    <label for="Ambient" id="AmbLabel">Amb</label><input type="color" id="Ambient"/>
                    <input type="text" id="Refr" size="3" placeholder="RefCoef"/>
                    <label for="Diffuse" id="DiffLabel"> Diff</label><input type="color" id="Diffuse"/>
                    <label for="Trans" id="TransLabel"> Trans</label><input type="range" id="Trans" name="Trans" min="0" max="1" value="1" step="0.1" width="40px"/>
                    <label for="Specular" id="SpecLabel"> Spec</label><input type="color" id="Specular"/>
                    <input type="text" id="Ph" size="3" placeholder="Phong"/>
                </tr>
            </table>`;
                while (tmp.firstChild) {
                    fr.appendChild(tmp.firstChild);
                }
                let insBefore = document.getElementById('AfterSettingsTable');
                if (!insBefore)
                    return;
                let parent = insBefore.parentNode;
                if (!parent)
                    return;
                parent.insertBefore(fr, insBefore);
                // Get messages from settings elements
                let confButton = document.getElementById('AffirmSettings');
                if (confButton)
                    confButton.onclick = () => {
                        this.#addPlane();
                    };
            }
        } /* End of 'selectResponse' function */
        /* Delete button response.
         * ARGUMENTS: None.
         * RETURNS: None.
         */
        deleteResponse() {
            if (this.#isDeleting)
                return;
            this.#isDeleting = true;
            let fr = document.createDocumentFragment();
            let tmp = document.createElement('div');
            let text = '<select id="DeleteSelector">';
            if (!this.shapesManager)
                return;
            for (let name of this.shapesManager.shapesSet.keys())
                text += `<option value=${name}>${name}</option>`;
            text +=
                '</select><input type="button" id="AffirmDeleting" value="Confirm"/>';
            tmp.innerHTML = text;
            while (tmp.firstChild) {
                fr.appendChild(tmp.firstChild);
            }
            let insBefore = document.getElementById('AfterDeleteSelector');
            if (!insBefore)
                return;
            let parent = insBefore.parentNode;
            if (!parent)
                return;
            parent.insertBefore(fr, insBefore);
            //
            let confButton = document.getElementById('AffirmDeleting');
            if (confButton)
                confButton.onclick = () => {
                    this.#deleteShape();
                };
        } /* End of 'deleteResponse' function */
        /* Response.
         * ARGUMENTS:
         *   - camera:
         *       camera: Camera;
         *   - time information:
         *       timer: Timer;
         * RETURNS: None.
         */
        response(camera, timer) {
            this.rotate.y += (this.buttonD - this.buttonA) * timer.deltaTime * 8;
            camera.direction = Matr.rotateY(this.rotate.y).transform(new Vec3(0, 0, 1));
            camera.position = camera.position.add(camera.direction.mul((this.buttonW - this.buttonS) * timer.deltaTime * 2));
        } /* End of 'response' function */
    } /* End of 'Control' class */

    // https://github.com/Eugeny/tabby
    // https://michaelwalczyk.com/blog-ray-marching.html
    // https://iquilezles.org/articles/distfunctions/
    let gl;
    function loadShader(type, source) {
        const shader = gl.createShader(type);
        if (!shader)
            return null;
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        // Compile the shader program
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    function initShaderProgram(vsSource, fsSource) {
        const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
        if (!vertexShader)
            return;
        const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
        if (!fragmentShader)
            return;
        // Create the shader program
        const shaderProgram = gl.createProgram();
        if (!shaderProgram)
            return;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
        return shaderProgram;
    }
    function initPositionBuffer() {
        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Now create an array of positions for the square.
        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        return positionBuffer;
    }
    function initBuffers() {
        const positionBuffer = initPositionBuffer();
        return {
            position: positionBuffer
        };
    }
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    function setPositionAttribute(buffers, programInfo) {
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    function drawScene(programInfo, buffers) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        programInfo.timer.update();
        programInfo.control.response(programInfo.viewFrameSettings.camera, programInfo.timer);
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        // buffer into the vertexPosition attribute.
        setPositionAttribute(buffers, programInfo);
        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);
        updateProgramData(programInfo);
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
    function updateProgramData(programInfo) {
        // Pass camera data
        let data = programInfo.viewFrameSettings.camera.position.toArray();
        data.push(programInfo.viewFrameSettings.frameW);
        data = data.concat(programInfo.control.rotate.toArray());
        data.push(programInfo.viewFrameSettings.frameH);
        programInfo.viewFrameSettings.ubo.update(data);
        programInfo.viewFrameSettings.ubo.apply();
        // Pass shapes data
        programInfo.shapesManager.allShapesUBO.apply();
    }
    //
    // start here
    //
    async function main() {
        const vsResponse = await fetch('./march.vertex.glsl');
        const vsText = await vsResponse.text();
        console.log(vsText);
        const fsResponse = await fetch('./march.fragment.glsl');
        const fsText = await fsResponse.text();
        console.log(fsText);
        const canvas = document.querySelector('#glCanvas');
        if (!canvas) {
            return;
        }
        // Initialize the GL context
        gl = canvas.getContext('webgl2');
        // Only continue if WebGL is available and working
        if (gl === null) {
            alert('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }
        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);
        const shaderProgram = initShaderProgram(vsText, fsText);
        if (!shaderProgram)
            return;
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'in_pos')
            },
            shapesManager: new ShapesManager(gl, shaderProgram),
            control: new Control(),
            viewFrameSettings: {
                camera: new Camera(new Vec3(0, 0, -10), new Vec3(0, 0, 1)),
                frameW: canvas.width,
                frameH: canvas.height,
                ubo: new UBO(gl, 32, 0)
            },
            timer: new Timer()
        };
        programInfo.control.start(programInfo.shapesManager);
        let data = programInfo.viewFrameSettings.camera.position.toArray();
        data.push(programInfo.viewFrameSettings.frameW);
        data = data.concat(programInfo.viewFrameSettings.camera.direction.toArray());
        data.push(programInfo.viewFrameSettings.frameH);
        programInfo.viewFrameSettings.ubo.create(programInfo.program, data, 'Camera');
        programInfo.viewFrameSettings.ubo.apply();
        // programInfo.shapesManager.allShapesUBO.apply();
        const buffers = initBuffers();
        const render = () => {
            drawScene(programInfo, buffers);
            window.requestAnimationFrame(render);
        };
        render();
    }
    window.addEventListener('load', (event) => {
        main();
    });
    window.addEventListener('resize', (event) => {
    });

    exports.main = main;

    return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbXRoLnRzIiwiLi4vcmVzL3RpbWVyLnRzIiwiLi4vcmVzL2NhbWVyYS50cyIsIi4uL3Jlcy9idWZmZXIudHMiLCIuLi9yZXMvc2hhcGUudHMiLCIuLi9yZXMvaW5wdXQudHMiLCIuLi9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO0lBRU8sTUFBTSxFQUFFLEdBQUcsTUFBSztRQUNuQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDO0lBRUssTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFTLEtBQUk7UUFDN0IsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0lBS0ssTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFTLEtBQUk7SUFDN0IsSUFBQSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0lBQ0ssTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFTLEtBQUk7SUFDN0IsSUFBQSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0lBRUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFTLEtBQUk7SUFDOUIsSUFBQSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDO1VBYVcsSUFBSSxDQUFBO0lBQ2IsSUFBQSxDQUFDLENBQVM7SUFDVixJQUFBLENBQUMsQ0FBUztJQUNWLElBQUEsQ0FBQyxDQUFTO0lBRVY7Ozs7SUFJRztJQUNILElBQUEsV0FBQSxDQUFZLEdBQUcsSUFBYyxFQUFBO0lBQ3pCLFFBQUEsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7SUFBRSxZQUFBLElB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USxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQzdDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUM3QyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUMxQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUN0QjtJQUNELFlBQUEsU0FBUyxFQUFFLElBQUksSUFBSSxDQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFDM0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FDeEI7SUFDRCxZQUFBLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FDWixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFB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
