import { fetchWeatherApi } from './node_modules/openmeteo/lib/index';

export async function FetchWeatherData(lng: number, lat: number) {
    const params = {
        latitude: lat,
        longitude: lng,
        hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'precipitation',
            'surface_pressure',
            'cloud_cover',
            'wind_speed_10m',
            'wind_direction_10m'
        ],
        wind_speed_unit: 'ms',
        forecast_days: 7
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    const range = (start: number, stop: number, step: number) =>
        Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
        );

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const result = {
        hourly: {
            time: range(
                Number(hourly.time()),
                Number(hourly.timeEnd()),
                hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
            precipitation: hourly.variables(2)!.valuesArray()!,
            surfacePressure: hourly.variables(3)!.valuesArray()!,
            cloudCover: hourly.variables(4)!.valuesArray()!,
            windSpeed10m: hourly.variables(5)!.valuesArray()!,
            windDirection10m: hourly.variables(6)!.valuesArray()!
        }
    };
    return result;
}
