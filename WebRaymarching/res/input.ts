import { clamp, Vec3, Vec4, Matr } from '../mth';
import { Timer } from './timer';
import { Camera } from './camera';
import { IMaterial, Sphere, Plane, ShapesManager } from './shape';

/* Input class */
class Input {
    buttonW: number;
    buttonA: number;
    buttonS: number;
    buttonD: number;

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
            if (e.key == 'w') this.buttonW = 1;
            if (e.key == 'a') this.buttonA = 1;
            if (e.key == 's') this.buttonS = 1;
            if (e.key == 'd') this.buttonD = 1;
        });
        window.addEventListener('keyup', (e) => {
            if (e.key == 'w') this.buttonW = 0;
            if (e.key == 'a') this.buttonA = 0;
            if (e.key == 's') this.buttonS = 0;
            if (e.key == 'd') this.buttonD = 0;
        });
    } /* End of 'constructor' function */
} /* End of 'Input' class */

/* Control class */
export class Control extends Input {
    shapesManager: ShapesManager | null;
    #isSettings = false;
    #isDeleting = false;

    rotate: Vec3;

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
    start(shpManager: ShapesManager) {
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
        const posX = document.getElementById('PosX') as HTMLInputElement;
        const posY = document.getElementById('PosY') as HTMLInputElement;
        const posZ = document.getElementById('PosZ') as HTMLInputElement;
        const rad = document.getElementById('Radius') as HTMLInputElement;
        const check = document.getElementById('Checker') as HTMLInputElement;
        const amb = document.getElementById('Ambient') as HTMLInputElement;
        const ref = document.getElementById('Refr') as HTMLInputElement;
        const diff = document.getElementById('Diffuse') as HTMLInputElement;
        const trans = document.getElementById('Trans') as HTMLInputElement;
        const spec = document.getElementById('Specular') as HTMLInputElement;
        const ph = document.getElementById('Ph') as HTMLInputElement;

        const mtl: IMaterial = {
            typeMod: new Vec4(1, Number(check.checked), 0, 0),
            ambRef: new Vec4(
                parseInt(amb.value.substring(1, 3), 16) / 255,
                parseInt(amb.value.substring(3, 5), 16) / 255,
                parseInt(amb.value.substring(5), 16) / 255,
                parseInt(ref.value)
            ),
            diffTrans: new Vec4(
                parseInt(diff.value.substring(1, 3), 16) / 255,
                parseInt(diff.value.substring(3, 5), 16) / 255,
                parseInt(diff.value.substring(5), 16) / 255,
                parseInt(trans.value)
            ),
            specPh: new Vec4(
                parseInt(spec.value.substring(1, 3), 16) / 255,
                parseInt(spec.value.substring(3, 5), 16) / 255,
                parseInt(spec.value.substring(5), 16) / 255,
                parseInt(ph.value)
            )
        };

        let s = new Sphere(
            Number(posX.value),
            Number(posY.value),
            Number(posZ.value),
            Number(rad.value),
            mtl
        );
        const name = document.getElementById('ShapeName') as HTMLInputElement;
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
        const posX = document.getElementById('PosX') as HTMLInputElement;
        const posY = document.getElementById('PosY') as HTMLInputElement;
        const posZ = document.getElementById('PosZ') as HTMLInputElement;
        const normX = document.getElementById('NormX') as HTMLInputElement;
        const normY = document.getElementById('NormY') as HTMLInputElement;
        const normZ = document.getElementById('NormZ') as HTMLInputElement;
        const check = document.getElementById('Checker') as HTMLInputElement;
        const amb = document.getElementById('Ambient') as HTMLInputElement;
        const ref = document.getElementById('Refr') as HTMLInputElement;
        const diff = document.getElementById('Diffuse') as HTMLInputElement;
        const trans = document.getElementById('Trans') as HTMLInputElement;
        const spec = document.getElementById('Specular') as HTMLInputElement;
        const ph = document.getElementById('Ph') as HTMLInputElement;

        const mtl: IMaterial = {
            typeMod: new Vec4(2, Number(check.checked), 0, 0),
            ambRef: new Vec4(
                parseInt(amb.value.substring(1, 3), 16) / 255,
                parseInt(amb.value.substring(3, 5), 16) / 255,
                parseInt(amb.value.substring(5), 16) / 255,
                parseInt(ref.value)
            ),
            diffTrans: new Vec4(
                parseInt(diff.value.substring(1, 3), 16) / 255,
                parseInt(diff.value.substring(3, 5), 16) / 255,
                parseInt(diff.value.substring(5), 16) / 255,
                parseInt(trans.value)
            ),
            specPh: new Vec4(
                parseInt(spec.value.substring(1, 3), 16) / 255,
                parseInt(spec.value.substring(3, 5), 16) / 255,
                parseInt(spec.value.substring(5), 16) / 255,
                parseInt(ph.value)
            )
        };

        let s = new Plane(
            Number(posX.value),
            Number(posY.value),
            Number(posZ.value),
            Number(normX.value),
            Number(normY.value),
            Number(normZ.value),
            mtl
        );
        const name = document.getElementById('ShapeName') as HTMLInputElement;
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
        let delSelect = document.getElementById(
            'DeleteSelector'
        ) as HTMLSelectElement;
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
        if (this.#isSettings) return;
        this.#isSettings = true;
        const select = document.querySelector('select');
        if (!select) return;
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
            if (!insBefore) return;
            let parent = insBefore.parentNode;
            if (!parent) return;
            parent.insertBefore(fr, insBefore);

            // Get messages from settings elements
            let confButton = document.getElementById('AffirmSettings');
            if (confButton)
                confButton.onclick = () => {
                    this.#addSphere();
                };
        } else if (selectedValue == 'Plane') {
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
            if (!insBefore) return;
            let parent = insBefore.parentNode;
            if (!parent) return;
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
        if (this.#isDeleting) return;
        this.#isDeleting = true;
        let fr = document.createDocumentFragment();
        let tmp = document.createElement('div');
        let text = '<select id="DeleteSelector">';
        if (!this.shapesManager) return;
        for (let name of this.shapesManager.shapesSet.keys())
            text += `<option value=${name}>${name}</option>`;
        text +=
            '</select><input type="button" id="AffirmDeleting" value="Confirm"/>';
        tmp.innerHTML = text;
        while (tmp.firstChild) {
            fr.appendChild(tmp.firstChild);
        }
        let insBefore = document.getElementById('AfterDeleteSelector');
        if (!insBefore) return;
        let parent = insBefore.parentNode;
        if (!parent) return;
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
    response(camera: Camera, timer: Timer) {
        this.rotate.y += (this.buttonD - this.buttonA) * timer.deltaTime * 8;
        camera.direction = Matr.rotateY(this.rotate.y).transform(
            new Vec3(0, 0, 1)
        );
        camera.position = camera.position.add(
            camera.direction.mul(
                (this.buttonW - this.buttonS) * timer.deltaTime * 2
            )
        );
    } /* End of 'response' function */
} /* End of 'Control' class */
