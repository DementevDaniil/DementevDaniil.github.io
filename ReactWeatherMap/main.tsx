import React from 'react';
import { createRoot } from 'react-dom/client';
import { CreateMap } from './Map';
import { CreateWidget } from './WeatherWidget';

async function onLoad() {
    const rootElement = document.getElementById('root');

    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(
            <>
                <CreateMap></CreateMap>
                <CreateWidget></CreateWidget>
            </>
        );
    }
}

window.onload = onLoad;
