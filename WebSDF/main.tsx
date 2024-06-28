import React from 'react';
import { createRoot } from 'react-dom/client';
import { CreateUI } from './src/CreateUI';
import { DragDrop } from './src/DragDrop';
import { SettingsTable } from './src/SettingsTable';
import { CreateSDFButton } from './src/CreateSDF';

import './styles/global.css';
import './styles/dragDrop.css';
import './styles/settingsTable.css';
// https://libgdx.com/wiki/tools/hiero
// https://timdaub.github.io/2020/02/19/wasm-synth/

async function onLoad() {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <div id="globalDiv" className="globalDiv">
        <div id="firstPartOfTable" className="firstPartOfTable">
          <DragDrop></DragDrop>
          <SettingsTable></SettingsTable>
        </div>
        <br />
        <CreateSDFButton></CreateSDFButton>
        <CreateUI></CreateUI>
      </div>
    );
  }
}

window.onload = onLoad;
