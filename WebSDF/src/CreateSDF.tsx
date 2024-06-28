import React, { useState } from 'react';

import { Vec4 } from './mth';
import { CreateSDF } from './Generator';
import Generator from '../output/generator.js';

export function CreateSDFButton() {
  let wrappedCreateSDF: any;
  let generatorModule: any;
  Generator().then((module: any) => {
    generatorModule = module;
    wrappedCreateSDF = module.cwrap('CreateSDF', 'number', [
      'number',
      'number',
      'number'
    ]);
    // let fr = document.createDocumentFragment();
    // let tmp = document.createElement('div');
    // let text = `<input type="radio" id="JavaScript" name="genType" value="JavaScript" />
    //     <label htmlFor="JavaScript">JavaScript</label>
    //     <input type="radio" id="WASM" name="genType" value="WASM" />
    //     <label htmlFor="WASM">WASM</label>`;
    // tmp.innerHTML = text;
    // while (tmp.firstChild) {
    //   fr.appendChild(tmp.firstChild);
    // }
    // let insBefore = document.querySelector('#createSDFButton');
    // if (!insBefore) return;
    // let parent = insBefore.parentNode;
    // if (!parent) return;
    // parent.insertBefore(fr, insBefore);
    // const after = document.querySelector('#createSDFButton');
    // const par = after?.parentNode;
    // const sel = (
    //   <div>
    // <input type="radio" id="JavaScript" name="genType" value="JavaScript" />
    // <label htmlFor="JavaScript">JavaScript</label>
    // <input type="radio" id="WASM" name="genType" value="WASM" />
    // <label htmlFor="WASM">WASM</label>
    //   </div>
    // );
  });
  return (
    <>
      <input
        type="radio"
        id="JavaScript"
        name="genType"
        value="JavaScript"
        defaultChecked
      />
      <label htmlFor="JavaScript">JavaScript</label>
      <input type="radio" id="WASM" name="genType" value="WASM" />
      <label htmlFor="WASM">WASM</label>
      <input type="hidden" value="0" id="inputType"></input>
      <input type="hidden" value="" id="fontImageSize"></input>
      <button
        className="createSDFButton"
        onClick={() => {
          const inputType = document.querySelector(
            '#inputType'
          ) as HTMLInputElement;
          if (inputType.value == '1') {
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
            let resCan = document.querySelector(
              '#resultPreviewCanvas'
            ) as HTMLCanvasElement;
            let resCtx = resCan.getContext('2d');
            resCan.width = prevCan.width;
            resCan.height = prevCan.height;
            let resData = resCtx?.createImageData(resCan.width, resCan.height);

            const isJS = document.querySelector(
              '#JavaScript'
            ) as HTMLInputElement;
            const isWASM = document.querySelector('#WASM') as HTMLInputElement;

            if (isJS.checked) {
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
                    (imgData.data[resCan.width * i * 4 + j + 3] = 255);
                }
              }
              resCtx?.putImageData(imgData, 0, 0);
            } else if (isWASM.checked) {
              const inputArray = new Int32Array(imgData.data);
              const length = inputArray.length;
              const bytesPerElement = inputArray.BYTES_PER_ELEMENT;

              const inputPtr = generatorModule._malloc(
                length * bytesPerElement
              );
              const outputPtr = generatorModule._malloc(
                length * bytesPerElement
              );
              generatorModule.HEAP32.set(
                inputArray,
                inputPtr / bytesPerElement
              );
              wrappedCreateSDF(
                resCan.width,
                resCan.height,
                inputPtr,
                outputPtr
              );
              let outputArray = new Int32Array(
                generatorModule.HEAP32.buffer,
                outputPtr,
                length
              );
              for (let i = 0; i < length; i++) {
                imgData.data[i] = outputArray[i];
              }
              resCtx?.putImageData(imgData, 0, 0);
            }
          } else if (inputType.value == '2') {
            let prevCan = document.querySelector(
              '#personalFontPreviewCanvas'
            ) as HTMLCanvasElement;
            if (!prevCan) return;
            let prevCtx = prevCan.getContext('2d');
            // const [w, h] = fontImageSize.value.split(' ', 2);
            // let width = parseFloat(w);
            // let height = parseFloat(h);
            // const k = prevCan.width / prevCan.height;
            // if (width < k * height) width = height * k;
            // else height = width / k;
            // let imgData = prevCtx?.getImageData(0, 0, width, height);
            let imgData = prevCtx?.getImageData(
              0,
              0,
              prevCan.width,
              prevCan.height
            );
            if (!imgData) return;
            let resCan = document.querySelector(
              '#resultPreviewCanvas'
            ) as HTMLCanvasElement;
            let resCtx = resCan.getContext('2d');

            resCan.width = prevCan.width;
            resCan.height = prevCan.height;

            const isJS = document.querySelector(
              '#JavaScript'
            ) as HTMLInputElement;
            const isWASM = document.querySelector('#WASM') as HTMLInputElement;

            if (isJS.checked) {
              let srcImg: Vec4[][];
              srcImg = new Array(prevCan.height);
              for (let i = 0; i < prevCan.height; i++) {
                srcImg[i] = new Array(prevCan.width);
                for (let j = 0; j < prevCan.width * 4; j += 4) {
                  srcImg[i][j / 4] = new Vec4(
                    imgData.data[prevCan.width * i * 4 + j + 0] <= 128
                      ? 0
                      : 255,
                    imgData.data[prevCan.width * i * 4 + j + 1] <= 128
                      ? 0
                      : 255,
                    imgData.data[prevCan.width * i * 4 + j + 2] <= 128
                      ? 0
                      : 255,
                    255
                  );
                }
              }
              let resImg = CreateSDF(prevCan.width, prevCan.height, srcImg);
              if (!resImg) return;

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
                    (imgData.data[resCan.width * i * 4 + j + 1] =
                      resImg[i][j / 4]),
                    (imgData.data[resCan.width * i * 4 + j + 2] =
                      resImg[i][j / 4]),
                    (imgData.data[resCan.width * i * 4 + j + 3] = 255);
                }
              }
            } else if (isWASM.checked) {
              const inputArray = new Int32Array(imgData.data);
              const length = inputArray.length;
              const bytesPerElement = inputArray.BYTES_PER_ELEMENT;

              const inputPtr = generatorModule._malloc(
                length * bytesPerElement
              );
              const outputPtr = generatorModule._malloc(
                length * bytesPerElement
              );
              generatorModule.HEAP32.set(
                inputArray,
                inputPtr / bytesPerElement
              );
              wrappedCreateSDF(
                resCan.width,
                resCan.height,
                inputPtr,
                outputPtr
              );
              let outputArray = new Int32Array(
                generatorModule.HEAP32.buffer,
                outputPtr,
                length
              );
              for (let i = 0; i < length; i++) {
                imgData.data[i] = outputArray[i];
              }
            }

            resCtx?.putImageData(imgData, 0, 0);
          }
        }}
      >
        Create SDF
      </button>
    </>
  );
}
