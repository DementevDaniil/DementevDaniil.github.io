/* Time handle class */
export class Timer {
    isPause = false;
    #startTime: number;
    #oldTime: number;
    #pauseTime: number;
    #timePerSec: number;
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
        } else {
            this.deltaTime = this.globalDeltaTime;
            this.time =
                (Date.now() - this.#pauseTime - this.#startTime) /
                this.#timePerSec;
        }
        this.#oldTime = Date.now();
    } /* End of 'update' function */
}
