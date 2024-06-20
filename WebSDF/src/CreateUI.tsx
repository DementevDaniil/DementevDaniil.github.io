import React, { useState } from 'react';

import { Vec4 } from './mth';
import { CreateSDF } from './Generator';
import { DownloadSDF } from './DownloadSDF';

export function CreateUI() {
    return (
        <>
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
                    console.log(resImg);
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
            <canvas
                id="resultPreviewCanvas"
                className="resultPreviewCanvas"
            ></canvas>
            <button
                className="downloadSDFButton"
                onClick={() => {
                    DownloadSDF();
                }}
            >
                Download
            </button>
        </>
    );
}
