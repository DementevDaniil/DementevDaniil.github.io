import React, { useState } from 'react';

export function PreviewSource(file: Blob) {
    const preview = document.querySelector('#srcPreview') as HTMLImageElement;
    const reader = new FileReader();

    reader.addEventListener(
        'load',
        () => {
            // convert image file to base64 string
            if (reader.result != null && preview)
                preview.src = reader.result.toString();
        },
        false
    );

    if (file) {
        reader.readAsDataURL(file);
    }
}
