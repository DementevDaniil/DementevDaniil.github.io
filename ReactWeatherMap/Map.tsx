import React, { useState } from 'react';
import Map from './node_modules/react-map-gl/dist/es5/exports-maplibre';
import { Marker } from './node_modules/react-map-gl/dist/es5/exports-maplibre';
import { FetchWeatherData } from './Weather';
import { WriteWeatherData } from './WeatherWidget';

type WeatherData = {
    hourly: {
        time: Date[];
        temperature2m: Float32Array;
        relativeHumidity2m: Float32Array;
        precipitation: Float32Array;
        surfacePressure: Float32Array;
        cloudCover: Float32Array;
        windSpeed10m: Float32Array;
        windDirection10m: Float32Array;
    };
};

export function CreateMap() {
    const wd: WeatherData = {
        hourly: {
            time: [],
            temperature2m: new Float32Array([]),
            relativeHumidity2m: new Float32Array([]),
            precipitation: new Float32Array([]),
            surfacePressure: new Float32Array([]),
            cloudCover: new Float32Array([]),
            windSpeed10m: new Float32Array([]),
            windDirection10m: new Float32Array([])
        }
    };
    const [weatherData, setWeatherData] = useState(wd);
    const [isWeatherDataFetched, setWIseatherDataFetched] = useState(false);
    let [longitude, setLongitude] = useState(-0);
    let [latitude, setLatitude] = useState(-0);
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
                setLatitude(e.lngLat.lat);
                setLongitude(e.lngLat.lng);
                if (Math.abs(longitude) > 180) {
                    setLongitude(longitude - 360 * Math.sign(longitude));
                }
                FetchWeatherData(longitude, latitude).then((result) => {
                    setWeatherData(result);
                    WriteWeatherData(weatherData);
                });
            }}
        >
            <Marker
                color="violet"
                longitude={longitude}
                latitude={latitude}
            ></Marker>
        </Map>
    );
}
