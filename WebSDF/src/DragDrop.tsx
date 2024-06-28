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
    const type = document.querySelector('#inputType') as HTMLInputElement;
    type.value = '1';
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
        <canvas id="srcPreviewCanvas" className="srcPreviewCanvas"></canvas>
      </div>
    </div>
  );
}
