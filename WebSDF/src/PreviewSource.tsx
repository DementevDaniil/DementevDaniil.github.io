import React, { useState } from 'react';

// export function PreviewSource(file: Blob) {
//     const preview = document.querySelector('#srcPreview') as HTMLImageElement;
//     const reader = new FileReader();

//     reader.addEventListener(
//         'load',
//         () => {
//             // convert image file to base64 string
//             if (reader.result != null && preview)
//                 preview.src = reader.result.toString();
//         },
//         false
//     );

//     if (file) {
//         reader.readAsDataURL(file);
//     }
// }

export function PreviewSource(file: Blob) {
    let can = document.querySelector('#srcPreviewCanvas') as HTMLCanvasElement;
    let ctx = can.getContext('2d');

    const reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }

    let img = document.createElement('img');
    img.onload = function () {
        can.width = img.naturalWidth;
        can.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0);
        ctx?.drawImage(img, 0, 0, img.width, img.height);
    };

    reader.addEventListener(
        'load',
        () => {
            if (img && reader.result) img.src = reader.result.toString();
        },
        false
    );
}
