import React, { useState } from 'react';

import { CreateSDF } from './Generator';

export function CreateUI() {
    return (
        <>
            <button
                className="createSDFButton"
                onClick={() => {
                    const srcImage = document.querySelector(
                        '#srcPreview'
                    ) as HTMLImageElement;
                    // let b = CreateSDF(srcImage.width, srcImage.height, srcImage.);
                    // console.log(b);
                }}
            >
                Create SDF
            </button>
            <img src=""></img>
        </>
    );
}
