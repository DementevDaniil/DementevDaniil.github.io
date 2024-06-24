import React, { useRef, useState } from 'react';

import { floor, Vec4 } from './mth';
import { CreateSDF } from './Generator';

export function SettingsTable() {
    const fontSize = useRef<HTMLInputElement>(null);
    const fontBaseFont = useRef<HTMLSelectElement>(null);
    const fontIsBold = useRef<HTMLInputElement>(null);
    const fontIsItalic = useRef<HTMLInputElement>(null);
    const personalFontPreviewCanvas = useRef<HTMLCanvasElement>(null);
    const allFontSymbols = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="fontSettingsDiv">
            <p>Or create personalized one</p>
            <div className="fontParamsDiv">
                <div style={{ width: '100%', height: '30%' }}>
                    <input
                        type="number"
                        ref={fontSize}
                        min="1"
                        max="64"
                        defaultValue="20"
                    />
                    <label htmlFor="fontBaseFont">Base font</label>
                    <select ref={fontBaseFont} id="fontBaseFont">
                        <option value="Arial">Arial</option>
                        <option value="Comic Sans">Comic Sans</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Papyrus">Papyrus</option>
                        <option value="Times New Roman">Times New Roman</option>
                    </select>
                    <input type="checkbox" ref={fontIsBold} id="fontIsBold" />
                    <label htmlFor="fontIsBold">Bold</label>
                    <input
                        type="checkbox"
                        ref={fontIsItalic}
                        id="fontIsItalic"
                    />
                    <label htmlFor="fontIsItalic">Italic</label>
                    <textarea
                        ref={allFontSymbols}
                        className="allFontSymbols"
                        placeholder="Provide a list of desired symbols"
                    ></textarea>
                    <button
                        className="confirmPersonalSettings"
                        onClick={() => {
                            if (!personalFontPreviewCanvas.current) return;
                            const ctx =
                                personalFontPreviewCanvas.current.getContext(
                                    '2d'
                                );
                            let parent =
                                personalFontPreviewCanvas.current.parentElement;
                            if (!parent) return;
                            personalFontPreviewCanvas.current.width =
                                parent.clientWidth * 0.98;
                            personalFontPreviewCanvas.current.height =
                                parent.clientHeight * 0.5;
                            if (!ctx) return;
                            ctx.fillStyle = 'white';
                            ctx.fillRect(
                                0,
                                0,
                                personalFontPreviewCanvas.current.width,
                                personalFontPreviewCanvas.current.height
                            );
                            let fontDescr = '';
                            if (fontIsBold.current?.checked)
                                fontDescr += 'bold ';
                            if (fontIsItalic.current?.checked)
                                fontDescr += 'italic ';
                            fontDescr += fontSize.current?.value + 'px ';
                            fontDescr += fontBaseFont.current?.value;
                            ctx.fillStyle = 'black';
                            ctx.font = fontDescr;
                            ctx.imageSmoothingEnabled = false;
                            let text = '';
                            if (allFontSymbols.current)
                                text = allFontSymbols.current.value;
                            let lineHeight = Number(fontSize.current?.value);
                            let lines = [];
                            let step = floor(
                                (text.length * lineHeight) /
                                    personalFontPreviewCanvas.current.width
                            );
                            console.log(step);
                            for (let i = 0; i < step; i++)
                                lines.push(
                                    text.slice(
                                        (i *
                                            personalFontPreviewCanvas.current
                                                .width) /
                                            lineHeight,
                                        ((i + 1) *
                                            personalFontPreviewCanvas.current
                                                .width) /
                                            lineHeight
                                    )
                                );
                            console.log(lines);
                            lines.forEach((line, index) =>
                                ctx.fillText(line, 0, (2 + index) * lineHeight)
                            );
                        }}
                    >
                        Confirm settings
                    </button>
                </div>
                <canvas
                    ref={personalFontPreviewCanvas}
                    className="personalFontPreview"
                ></canvas>
                <br />
                <button
                    className="createSDFButton"
                    onClick={() => {
                        let prevCan = personalFontPreviewCanvas.current;
                        if (!prevCan) return;
                        let prevCtx = prevCan.getContext('2d');
                        let imgData = prevCtx?.getImageData(
                            0,
                            0,
                            prevCan.width,
                            prevCan.height
                        );
                        if (!imgData) return;
                        let srcImg: Vec4[][];
                        srcImg = new Array(prevCan.height);
                        for (let i = 0; i < prevCan.height; i++) {
                            srcImg[i] = new Array(prevCan.width);
                            for (let j = 0; j < prevCan.width * 4; j += 4) {
                                srcImg[i][j / 4] = new Vec4(
                                    imgData.data[
                                        prevCan.width * i * 4 + j + 0
                                    ] <= 128
                                        ? 0
                                        : 255,
                                    imgData.data[
                                        prevCan.width * i * 4 + j + 1
                                    ] <= 128
                                        ? 0
                                        : 255,
                                    imgData.data[
                                        prevCan.width * i * 4 + j + 2
                                    ] <= 128
                                        ? 0
                                        : 255,
                                    255
                                );
                            }
                        }
                        let resImg = CreateSDF(
                            prevCan.width,
                            prevCan.height,
                            srcImg
                        );
                        // console.log(resImg);
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
                            for (let j = 0; j < resCan.width * 4; j += 4) {
                                (imgData.data[resCan.width * i * 4 + j + 0] =
                                    resImg[i][j / 4]),
                                    (imgData.data[
                                        resCan.width * i * 4 + j + 1
                                    ] = resImg[i][j / 4]),
                                    (imgData.data[
                                        resCan.width * i * 4 + j + 2
                                    ] = resImg[i][j / 4]),
                                    (imgData.data[
                                        resCan.width * i * 4 + j + 3
                                    ] = 255);
                                // (imgData.data[resCan.width * i * 4 + j + 0] =
                                //     srcImg[i][j / 4].x),
                                //     (imgData.data[
                                //         resCan.width * i * 4 + j + 1
                                //     ] = srcImg[i][j / 4].y),
                                //     (imgData.data[
                                //         resCan.width * i * 4 + j + 2
                                //     ] = srcImg[i][j / 4].z),
                                //     (imgData.data[
                                //         resCan.width * i * 4 + j + 3
                                //     ] = 255);
                            }
                        }

                        resCtx?.putImageData(imgData, 0, 0);
                    }}
                >
                    Create SDF
                </button>
            </div>
        </div>
    );
}