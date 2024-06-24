import React, { useState } from 'react';
import { Vec4 } from './mth';
import { CreateSDF } from './Generator';

import { PreviewSDF } from './PreviewDrawer';
import { PreviewSource } from './PreviewSource';

export function DragDrop() {
    function dropHandler(event: any) {
        event.stopPropagation();
        event.preventDefault();

        const dt = event.dataTransfer;
        const files = dt.files;

        // let text = `<img id="srcPreviewImage" className="srcPreviewImage">`;
        // let div = document.querySelector('#dropZone') as HTMLDivElement;
        // div.innerHTML += text;
        PreviewSource(files[0]);
    }
    function dragOverHandler(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }
    function dragEnterHandler(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <div
            id="dropZone"
            className="dropZone"
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragEnter={dragEnterHandler}
        >
            <p>Drop source file here</p>
            <div className="srcPreviewCanvasDiv">
                <canvas
                    id="srcPreviewCanvas"
                    className="srcPreviewCanvas"
                ></canvas>
            </div>
            <button
                className="createSDFButton"
                onClick={() => {
                    let prevCan = document.querySelector(
                        '#srcPreviewCanvas'
                    ) as HTMLCanvasElement;
                    let prevCtx = prevCan.getContext('2d');
                    let imgData = prevCtx?.getImageData(
                        0,
                        0,
                        prevCan.width,
                        prevCan.height
                    );
                    if (!imgData) return;
                    let img: Vec4[][];
                    img = new Array(prevCan.height);
                    for (let i = 0; i < prevCan.height; i++) {
                        img[i] = new Array(prevCan.width);
                        for (let j = 0; j < prevCan.width * 4; j += 4) {
                            img[i][j / 4] = new Vec4(
                                imgData.data[prevCan.width * i * 4 + j],
                                imgData.data[prevCan.width * i * 4 + j + 1],
                                imgData.data[prevCan.width * i * 4 + j + 2],
                                imgData.data[prevCan.width * i * 4 + j + 3]
                            );
                        }
                    }
                    let resImg = CreateSDF(prevCan.width, prevCan.height, img);
                    if (!resImg) return;

                    let resCan = document.querySelector(
                        '#resultPreviewCanvas'
                    ) as HTMLCanvasElement;
                    let resCtx = resCan.getContext('2d');

                    resCan.width = prevCan.width;
                    resCan.height = prevCan.height;

                    let resData = resCtx?.createImageData(
                        resCan.width,
                        resCan.height
                    );
                    let data = resData?.data;

                    if (!data) return;
                    for (let i = 0; i < resCan.height; i++) {
                        img[i] = new Array(resCan.width);
                        for (let j = 0; j < resCan.width * 4; j += 4) {
                            (imgData.data[resCan.width * i * 4 + j + 0] =
                                resImg[i][j / 4]),
                                (imgData.data[resCan.width * i * 4 + j + 1] =
                                    resImg[i][j / 4]),
                                (imgData.data[resCan.width * i * 4 + j + 2] =
                                    resImg[i][j / 4]),
                                (imgData.data[resCan.width * i * 4 + j + 3] =
                                    255);
                        }
                    }

                    resCtx?.putImageData(imgData, 0, 0);
                }}
            >
                Create SDF
            </button>
        </div>
    );
}
