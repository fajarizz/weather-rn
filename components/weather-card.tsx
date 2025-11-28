import { getAirQuality, getCurrentHourlyValue, getCurrentWeather, getWeatherCode, getWeatherLabel, getWindDirection } from "@/lib/weather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import InfoCard from "./info-card";

export default function WeatherCard({ lat, lon, city }: { lat: number, lon: number, city: string }) {
    const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useQuery({
        queryKey: ['weather', lat, lon],
        queryFn: () => getCurrentWeather(lat, lon),
        refetchOnWindowFocus: true,
    })

    const { data: aqiData, isLoading: aqiLoading, error: aqiError } = useQuery({
        queryKey: ['aqi', lat, lon],
        queryFn: () => getAirQuality(lat, lon),
        refetchOnWindowFocus: true,
    })

    if (weatherLoading || aqiLoading) return <Text>Loading...</Text>
    if (weatherError) return <Text>Error: {weatherError.message}</Text>
    if (aqiError) return <Text>Error: {aqiError.message}</Text>

    const humidity = getCurrentHourlyValue(weatherData?.hourly, weatherData?.current_weather?.time, 'relative_humidity_2m') || 0;
    const feelsLike = getCurrentHourlyValue(weatherData?.hourly, weatherData?.current_weather?.time, 'apparent_temperature') || 0;
    const uvIndex = getCurrentHourlyValue(weatherData?.hourly, weatherData?.current_weather?.time, 'uv_index') || 0;
    const windDir = getWindDirection(weatherData?.current_weather.winddirection);

    return (
        <View className="w-full items-start justify-center gap-5">
            <View className="justify-between items-center w-full gap-5 bg-gray-800 rounded-xl px-3 py-10">
                <Text className="text-white text-3xl font-bold">{city}</Text>

                <MaterialCommunityIcons name={getWeatherCode(weatherData?.current_weather.weathercode) as any} size={124} color="white" />
                <Text className="text-white text-3xl font-bold">{getWeatherLabel(weatherData?.current_weather.weathercode)}</Text>
            </View>
            <View className="flex-row w-full justify-start items-center gap-3">
                <InfoCard icon="temperature-celsius" title="Temperature" value={`${weatherData?.current_weather.temperature}°`} />
                <InfoCard icon="thermometer" title="Feels Like" value={`${feelsLike}°`} />
            </View>
            <View className="flex-row w-full justify-start items-center gap-3">
                <InfoCard icon="weather-windy" title="Wind" value={`${weatherData?.current_weather.windspeed} km/h ${windDir}`} />
                <InfoCard icon="water-percent" title="Humidity" value={`${humidity}%`} />
            </View>
            <View className="flex-row w-full justify-start items-center gap-3">
                <InfoCard icon="white-balance-sunny" title="UV Index" value={`${uvIndex}`} />
                <InfoCard icon="air-filter" title="Quality Air" value={`${aqiData?.current?.us_aqi || 'N/A'}`} />
            </View>
        </View>
    )
}