import React from 'react';
import { createRoot } from 'react-dom/client';
import { CreateUI } from './src/CreateUI';
import { DragDrop } from './src/DragDrop';
import { SettingsTable } from './src/SettingsTable';

import './styles/global.css';
import './styles/dragDrop.css';
import './styles/settingsTable.css';

// https://libgdx.com/wiki/tools/hiero

async function onLoad() {
    const rootElement = document.getElementById('root');

    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(
            <div id="globalDiv" className="globalDiv">
                <DragDrop></DragDrop>
                <SettingsTable></SettingsTable>
                <CreateUI></CreateUI>
            </div>
        );
    }
}

window.onload = onLoad;
