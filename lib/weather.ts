import { weatherIcons } from "@/constants/weather-icon";
import { getApi } from "./client";

export async function getCurrentWeather(lat: number, lon: number) {
    return getApi(`/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature,uv_index`)
}

export async function getAirQuality(lat: number, lon: number) {
    return getApi(`air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`, "https://air-quality-api.open-meteo.com/v1")
}

export function getWeatherCode(code: number) {
    return weatherIcons[code] || "unknown"
}

export function getWeatherLabel(code: number) {
    const icon = weatherIcons[code] || "unknown";
    return icon.replace("weather-", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function getCurrentHourlyValue(hourly: any, currentTime: any, key: string) {
    const index = hourly.time.findIndex((t: string) => t.slice(0, 13) === currentTime.slice(0, 13));
    if (index === -1) return null;
    return hourly[key][index];
}

export function getWindDirection(degrees: number) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

export async function getCityCoordinates(city: string, count: number = 1) {
    return getApi(`search?name=${city}&count=${count}&language=en&format=json`, "https://geocoding-api.open-meteo.com/v1")
}
