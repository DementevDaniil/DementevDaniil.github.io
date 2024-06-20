import React, { useState } from 'react';

export function SettingsTable() {
    return (
        <div id="fontSettingsDiv" className="fontSettingsDiv">
            <h1>Or personalize it</h1>
            <div id="fontSettingsDiv" className="fontSettingsDiv">
                <input type="number" id="fontSize" min="1" max="64" />
                <input type="checkbox" id="fontIsBold" />
                <label htmlFor="fontIsBold">Bold</label>
                <input type="checkbox" id="fontIsItalic" />
                <label htmlFor="fontIsItalic">Italic</label>
            </div>
            <textarea
                id="allFontSymbols"
                placeholder="Provide a list of desired symbols"
            ></textarea>
        </div>
    );
}
