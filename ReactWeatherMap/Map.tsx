import React, { useState } from 'react';
import Map from './node_modules/react-map-gl/dist/es5/exports-maplibre';
import { FetchWeatherData } from './Weather';
import { WriteWeatherData } from './WeatherWidget';

export function CreateMap() {
    // const [isWeatherDataFetched, setIsWeatherDataFetched] = useState(false)
    return (
        <Map
            id="map"
            initialViewState={{ longitude: 0, latitude: 0, zoom: 1 }}
            // style={{
            //     position: 'absolute',
            //     right: '0',
            //     top: '0',
            //     left: '0',
            //     bottom: '0'
            // }}
            style={{
                width: '70%',
                height: '100%'
            }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=NyRS6pvTven96lCtfhqi"
            dragRotate={false}
            touchZoomRotate={false}
            onClick={(e) => {
                let weatherData;
                let lng = e.lngLat.lng;
                if (Math.abs(lng) > 180) {
                    lng -= 360 * Math.sign(lng);
                }
                FetchWeatherData(lng, e.lngLat.lat).then((weatherData) => {
                    WriteWeatherData(weatherData);
                });
            }}
        />
    );
}
