import React, { useState } from 'react';

function getExt(url: string) {
    const match = url.match(/\.[0-9a-z]+$/i);
    return match ? match[0].slice(1) : '';
}

export function DownloadSDF() {
    let res = document.querySelector(
        '#resultPreviewCanvas'
    ) as HTMLCanvasElement;
    let url = res.toDataURL();
    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network problem');
            }
            return res.blob();
        })
        .then((file) => {
            // const ex = getExt(url);
            let tUrl = URL.createObjectURL(file);
            const tmp = document.createElement('a');
            tmp.href = tUrl;
            const nf = document.querySelector(
                '#resultFileName'
            ) as HTMLInputElement;
            let name = nf.value;
            if (name == '') tmp.download = `sdf.png`;
            else tmp.download = `${name}.png`;
            nf.value = '';
            document.body.appendChild(tmp);
            tmp.click();
            URL.revokeObjectURL(tUrl);
            tmp.remove();
        });
}
