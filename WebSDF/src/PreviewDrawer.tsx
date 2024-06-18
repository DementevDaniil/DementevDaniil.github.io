import React, { useState } from 'react';

export function PreviewSDF(file: Blob) {
    const preview = document.querySelector('img');
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
