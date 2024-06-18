import React, { useState } from 'react';

import { PreviewSDF } from './PreviewDrawer';
import { PreviewSource } from './PreviewSource';

export function DragDrop() {
    function dropHandler(event: any) {
        event.stopPropagation();
        event.preventDefault();

        const dt = event.dataTransfer;
        const files = dt.files;

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
            <p>Drop file here</p>
            <img id="srcPreview" className="srcPreviewImage"></img>
        </div>
    );
}
