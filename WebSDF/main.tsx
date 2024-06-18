import React from 'react';
import { createRoot } from 'react-dom/client';
import { CreateUI } from './src/DownloadImage';
import { DragDrop } from './src/DragDrop';

async function onLoad() {
    const rootElement = document.getElementById('root');

    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(
            <>
                <DragDrop></DragDrop>
                <CreateUI></CreateUI>
            </>
        );
    }
}

window.onload = onLoad;
