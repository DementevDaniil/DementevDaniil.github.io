import React, { useState } from 'react';

import { Vec4 } from './mth';
import { CreateSDF } from './Generator';
import { DownloadSDF } from './DownloadSDF';

export function CreateUI() {
    return (
        <>
            <canvas
                id="resultPreviewCanvas"
                className="resultPreviewCanvas"
            ></canvas>
            <input
                type="text"
                id="resultFileName"
                placeholder="Enter filename before saving"
            />
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
