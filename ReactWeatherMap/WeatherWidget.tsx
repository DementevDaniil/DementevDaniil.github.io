import React, { useState } from 'react';

function GetDayShift(day1: Date, day2: Date) {
    return Math.floor(((day2.valueOf() - day1.valueOf()) / 3600) * 24 * 1000);
}

export function WriteWeatherData(weatherData: any) {
    let dayPara = document.querySelector('#date') as HTMLInputElement;
    let todayPara = document.querySelector('#todayInfo') as HTMLInputElement;
    let n = GetDayShift(new Date(todayPara.value), new Date(dayPara.value));
    let tempPara = document.querySelector(
        '#weatherOutput'
    ) as HTMLParagraphElement;
    let result = '';
    for (let i = n * 24; i < (n + 1) * 24; i++) {
        const cells = [
            document.querySelector(`#row${i}Info0`) as HTMLTableCellElement,
            document.querySelector(`#row${i}Info1`) as HTMLTableCellElement,
            document.querySelector(`#row${i}Info2`) as HTMLTableCellElement,
            document.querySelector(`#row${i}Info3`) as HTMLTableCellElement,
            document.querySelector(`#row${i}Info4`) as HTMLTableCellElement,
            document.querySelector(`#row${i}Info5`) as HTMLTableCellElement,
            document.querySelector(`#row${i}Info6`) as HTMLTableCellElement
        ];
        cells[0].innerText = `${i % 24}:00`;
        cells[1].innerText = `${Math.round(weatherData.hourly.temperature2m[i])}°C`;
        cells[2].innerText = `${weatherData.hourly.relativeHumidity2m[i]}%`;
        cells[3].innerText = `${weatherData.hourly.precipitation[i].toFixed(2)}mm`;
        cells[4].innerText = `${(weatherData.hourly.surfacePressure[i] / 10).toFixed(3)}kPa`;
        cells[5].innerText = `${weatherData.hourly.cloudCover[i]}%`;
        cells[6].innerText = `${weatherData.hourly.windSpeed10m[i].toFixed(1)}m/s`;
    }
}

export function CreateWidget() {
    function a() {
        return new Date(Date.now());
    }
    const [date, setDate] = useState(a());
    const today = a().toDateString();
    return (
        <div className="weatherOutputDiv">
            <input
                type="text"
                className="todayInfo"
                id="todayInfo"
                value={today}
                readOnly
            />
            <br />
            <button
                className="daySelectorButton"
                onClick={(e) => {
                    setDate(
                        new Date(Date.parse(date.toString()) - 3600 * 24 * 1000)
                    );
                    const text = document.querySelector(
                        '#date'
                    ) as HTMLInputElement;
                    text.value = date.toDateString();
                }}
            >
                Previous day
            </button>
            <input
                type="text"
                className="date"
                id="date"
                value={date.toDateString()}
                readOnly
            />
            <button
                className="daySelectorButton"
                onClick={(e) => {
                    setDate(
                        new Date(Date.parse(date.toString()) + 3600 * 24 * 1000)
                    );
                    const text = document.querySelector(
                        '#date'
                    ) as HTMLInputElement;
                    text.value = date.toDateString();
                }}
            >
                Next day
            </button>
            <table className="infoTable">
                <thead>
                    <tr>
                        <th className="header">Time</th>
                        <th className="header">Temp</th>
                        <th className="header">Humidity</th>
                        <th className="header">Precepitation</th>
                        <th className="header">Pressure</th>
                        <th className="header">Clouds</th>
                        <th className="header">Wind</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="row0Info0"></td>
                        <td id="row0Info1"></td>
                        <td id="row0Info2"></td>
                        <td id="row0Info3"></td>
                        <td id="row0Info4"></td>
                        <td id="row0Info5"></td>
                        <td id="row0Info6"></td>
                    </tr>
                    <tr>
                        <td id="row1Info0"></td>
                        <td id="row1Info1"></td>
                        <td id="row1Info2"></td>
                        <td id="row1Info3"></td>
                        <td id="row1Info4"></td>
                        <td id="row1Info5"></td>
                        <td id="row1Info6"></td>
                    </tr>
                    <tr>
                        <td id="row2Info0"></td>
                        <td id="row2Info1"></td>
                        <td id="row2Info2"></td>
                        <td id="row2Info3"></td>
                        <td id="row2Info4"></td>
                        <td id="row2Info5"></td>
                        <td id="row2Info6"></td>
                    </tr>
                    <tr>
                        <td id="row3Info0"></td>
                        <td id="row3Info1"></td>
                        <td id="row3Info2"></td>
                        <td id="row3Info3"></td>
                        <td id="row3Info4"></td>
                        <td id="row3Info5"></td>
                        <td id="row3Info6"></td>
                    </tr>
                    <tr>
                        <td id="row4Info0"></td>
                        <td id="row4Info1"></td>
                        <td id="row4Info2"></td>
                        <td id="row4Info3"></td>
                        <td id="row4Info4"></td>
                        <td id="row4Info5"></td>
                        <td id="row4Info6"></td>
                    </tr>
                    <tr>
                        <td id="row5Info0"></td>
                        <td id="row5Info1"></td>
                        <td id="row5Info2"></td>
                        <td id="row5Info3"></td>
                        <td id="row5Info4"></td>
                        <td id="row5Info5"></td>
                        <td id="row5Info6"></td>
                    </tr>
                    <tr>
                        <td id="row6Info0"></td>
                        <td id="row6Info1"></td>
                        <td id="row6Info2"></td>
                        <td id="row6Info3"></td>
                        <td id="row6Info4"></td>
                        <td id="row6Info5"></td>
                        <td id="row6Info6"></td>
                    </tr>
                    <tr>
                        <td id="row7Info0"></td>
                        <td id="row7Info1"></td>
                        <td id="row7Info2"></td>
                        <td id="row7Info3"></td>
                        <td id="row7Info4"></td>
                        <td id="row7Info5"></td>
                        <td id="row7Info6"></td>
                    </tr>
                    <tr>
                        <td id="row8Info0"></td>
                        <td id="row8Info1"></td>
                        <td id="row8Info2"></td>
                        <td id="row8Info3"></td>
                        <td id="row8Info4"></td>
                        <td id="row8Info5"></td>
                        <td id="row8Info6"></td>
                    </tr>
                    <tr>
                        <td id="row9Info0"></td>
                        <td id="row9Info1"></td>
                        <td id="row9Info2"></td>
                        <td id="row9Info3"></td>
                        <td id="row9Info4"></td>
                        <td id="row9Info5"></td>
                        <td id="row9Info6"></td>
                    </tr>
                    <tr>
                        <td id="row10Info0"></td>
                        <td id="row10Info1"></td>
                        <td id="row10Info2"></td>
                        <td id="row10Info3"></td>
                        <td id="row10Info4"></td>
                        <td id="row10Info5"></td>
                        <td id="row10Info6"></td>
                    </tr>
                    <tr>
                        <td id="row11Info0"></td>
                        <td id="row11Info1"></td>
                        <td id="row11Info2"></td>
                        <td id="row11Info3"></td>
                        <td id="row11Info4"></td>
                        <td id="row11Info5"></td>
                        <td id="row11Info6"></td>
                    </tr>
                    <tr>
                        <td id="row12Info0"></td>
                        <td id="row12Info1"></td>
                        <td id="row12Info2"></td>
                        <td id="row12Info3"></td>
                        <td id="row12Info4"></td>
                        <td id="row12Info5"></td>
                        <td id="row12Info6"></td>
                    </tr>
                    <tr>
                        <td id="row13Info0"></td>
                        <td id="row13Info1"></td>
                        <td id="row13Info2"></td>
                        <td id="row13Info3"></td>
                        <td id="row13Info4"></td>
                        <td id="row13Info5"></td>
                        <td id="row13Info6"></td>
                    </tr>
                    <tr>
                        <td id="row14Info0"></td>
                        <td id="row14Info1"></td>
                        <td id="row14Info2"></td>
                        <td id="row14Info3"></td>
                        <td id="row14Info4"></td>
                        <td id="row14Info5"></td>
                        <td id="row14Info6"></td>
                    </tr>
                    <tr>
                        <td id="row15Info0"></td>
                        <td id="row15Info1"></td>
                        <td id="row15Info2"></td>
                        <td id="row15Info3"></td>
                        <td id="row15Info4"></td>
                        <td id="row15Info5"></td>
                        <td id="row15Info6"></td>
                    </tr>
                    <tr>
                        <td id="row16Info0"></td>
                        <td id="row16Info1"></td>
                        <td id="row16Info2"></td>
                        <td id="row16Info3"></td>
                        <td id="row16Info4"></td>
                        <td id="row16Info5"></td>
                        <td id="row16Info6"></td>
                    </tr>
                    <tr>
                        <td id="row17Info0"></td>
                        <td id="row17Info1"></td>
                        <td id="row17Info2"></td>
                        <td id="row17Info3"></td>
                        <td id="row17Info4"></td>
                        <td id="row17Info5"></td>
                        <td id="row17Info6"></td>
                    </tr>
                    <tr>
                        <td id="row18Info0"></td>
                        <td id="row18Info1"></td>
                        <td id="row18Info2"></td>
                        <td id="row18Info3"></td>
                        <td id="row18Info4"></td>
                        <td id="row18Info5"></td>
                        <td id="row18Info6"></td>
                    </tr>
                    <tr>
                        <td id="row19Info0"></td>
                        <td id="row19Info1"></td>
                        <td id="row19Info2"></td>
                        <td id="row19Info3"></td>
                        <td id="row19Info4"></td>
                        <td id="row19Info5"></td>
                        <td id="row19Info6"></td>
                    </tr>
                    <tr>
                        <td id="row20Info0"></td>
                        <td id="row20Info1"></td>
                        <td id="row20Info2"></td>
                        <td id="row20Info3"></td>
                        <td id="row20Info4"></td>
                        <td id="row20Info5"></td>
                        <td id="row20Info6"></td>
                    </tr>
                    <tr>
                        <td id="row21Info0"></td>
                        <td id="row21Info1"></td>
                        <td id="row21Info2"></td>
                        <td id="row21Info3"></td>
                        <td id="row21Info4"></td>
                        <td id="row21Info5"></td>
                        <td id="row21Info6"></td>
                    </tr>
                    <tr>
                        <td id="row22Info0"></td>
                        <td id="row22Info1"></td>
                        <td id="row22Info2"></td>
                        <td id="row22Info3"></td>
                        <td id="row22Info4"></td>
                        <td id="row22Info5"></td>
                        <td id="row22Info6"></td>
                    </tr>
                    <tr>
                        <td id="row23Info0"></td>
                        <td id="row23Info1"></td>
                        <td id="row23Info2"></td>
                        <td id="row23Info3"></td>
                        <td id="row23Info4"></td>
                        <td id="row23Info5"></td>
                        <td id="row23Info6"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
