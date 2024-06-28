import React, { useRef, useState } from 'react';

import { floor, Vec4 } from './mth';
import { CreateSDF } from './Generator';

export function SettingsTable() {
  const fontSize = useRef<HTMLInputElement>(null);
  const fontBaseFont = useRef<HTMLSelectElement>(null);
  const fontIsBold = useRef<HTMLInputElement>(null);
  const fontIsItalic = useRef<HTMLInputElement>(null);
  const personalFontPreviewCanvas = useRef<HTMLCanvasElement>(null);
  const allFontSymbols = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="fontSettingsDiv">
      <p>Or create personalized one</p>
      <div className="fontParamsDiv">
        <div style={{ width: '100%', height: '30%' }}>
          <input
            type="number"
            ref={fontSize}
            min="1"
            max="64"
            defaultValue="20"
          />
          <label htmlFor="fontBaseFont">Base font</label>
          <select ref={fontBaseFont} id="fontBaseFont">
            <option value="Arial">Arial</option>
            <option value="Comic Sans">Comic Sans</option>
            <option value="Georgia">Georgia</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Papyrus">Papyrus</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
          <input type="checkbox" ref={fontIsBold} id="fontIsBold" />
          <label htmlFor="fontIsBold">Bold</label>
          <input type="checkbox" ref={fontIsItalic} id="fontIsItalic" />
          <label htmlFor="fontIsItalic">Italic</label>
          <textarea
            ref={allFontSymbols}
            className="allFontSymbols"
            placeholder="Provide a list of desired symbols"
          ></textarea>
          <button
            className="confirmPersonalSettings"
            onClick={() => {
              const type = document.querySelector(
                '#inputType'
              ) as HTMLInputElement;
              type.value = '2';

              if (!personalFontPreviewCanvas.current) return;
              const ctx = personalFontPreviewCanvas.current.getContext('2d');
              let parent = personalFontPreviewCanvas.current.parentElement;
              if (!parent) return;
              personalFontPreviewCanvas.current.width =
                parent.clientWidth * 0.98;
              personalFontPreviewCanvas.current.height =
                parent.clientHeight * 0.5;
              if (!ctx) return;
              ctx.fillStyle = 'white';
              ctx.fillRect(
                0,
                0,
                personalFontPreviewCanvas.current.width,
                personalFontPreviewCanvas.current.height
              );
              let fontDescr = '';
              if (fontIsBold.current?.checked) fontDescr += 'bold ';
              if (fontIsItalic.current?.checked) fontDescr += 'italic ';
              fontDescr += fontSize.current?.value + 'px ';
              fontDescr += fontBaseFont.current?.value;
              ctx.fillStyle = 'black';
              ctx.font = fontDescr;
              ctx.imageSmoothingEnabled = false;
              let text = '';
              if (allFontSymbols.current) text = allFontSymbols.current.value;
              let lineHeight = Number(fontSize.current?.value);
              let lines = [];
              let step = floor(
                (text.length * lineHeight) /
                  personalFontPreviewCanvas.current.width
              );
              for (let i = 0; i < step + 1; i++)
                lines.push(
                  text.slice(
                    (i * personalFontPreviewCanvas.current.width) / lineHeight,
                    ((i + 1) * personalFontPreviewCanvas.current.width) /
                      lineHeight
                  )
                );
              lines.forEach((line, index) =>
                ctx.fillText(line, 0, (2 + index) * lineHeight)
              );
              const fontImageSize = document.querySelector(
                '#fontImageSize'
              ) as HTMLInputElement;
              fontImageSize.value =
                (text.length * lineHeight).toString() +
                ' ' +
                ((step + 4) * lineHeight).toString();
            }}
          >
            Confirm settings
          </button>
        </div>
        <canvas
          ref={personalFontPreviewCanvas}
          id="personalFontPreviewCanvas"
          className="personalFontPreview"
        ></canvas>
        <br />
      </div>
    </div>
  );
}
