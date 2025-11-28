import WeatherCard from "@/components/weather-card";
import { getCityCoordinates } from "@/lib/weather";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const [city, setCity] = useState("Mountain View");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [coords, setCoords] = useState({ lat: 37.422, lon: -122.084 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoords({ lat: location.coords.latitude, lon: location.coords.longitude });

      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (address && address.length > 0) {
        setCity(address[0].city || address[0].name || "Current Location");
      }
    })();
  }, []);

  const handleSearchTextChange = async (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      try {
        const data = await getCityCoordinates(text, 5);
        if (data.results) {
          const uniqueResults = data.results.filter((item: any, index: number, self: any[]) =>
            index === self.findIndex((t) => (
              t.id === item.id || (t.name === item.name && t.country === item.country && t.admin1 === item.admin1)
            ))
          );
          setSuggestions(uniqueResults);
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectCity = (result: any) => {
    setCity(result.name);
    setCoords({ lat: result.latitude, lon: result.longitude });
    setSearch("");
    setSuggestions([]);
    setErrorMsg(null);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const data = await getCityCoordinates(search);
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setCity(result.name);
        setCoords({ lat: result.latitude, lon: result.longitude });
        setSearch("");
        setSuggestions([]);
        setErrorMsg(null);
      }
    } catch (error) {
      console.error("Error searching city:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start px-5 gap-5">
      <View className="z-50 w-full">
        <View className="flex-row w-full justify-start items-center gap-3 px-5 bg-gray-800 h-16 mt-5 rounded-xl">
          <MaterialCommunityIcons name="map-search-outline" size={24} color="white" />
          <TextInput
            placeholder="Search your city"
            className="text-white flex-1"
            placeholderTextColor={'white'}
            value={search}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        {suggestions.length > 0 && (
          <View className="absolute top-24 w-full bg-gray-900 rounded-xl p-2 shadow-lg z-50">
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="p-3 border-b border-gray-700"
                onPress={() => selectCity(item)}
              >
                <Text className="text-white text-lg">
                  {item.name}
                  {item.admin1 ? `, ${item.admin1}` : ''}
                  {item.country ? `, ${item.country}` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {errorMsg ? <View className="flex-row justify-start items-start "><MaterialCommunityIcons name="alert-circle" size={24} color="red" /><Text className="text-red-500 text-left w-full">{errorMsg}</Text></View> : null}
      <ScrollView className="w-full">
        <WeatherCard lat={coords.lat} lon={coords.lon} city={city} />
      </ScrollView>
    </SafeAreaView>
  );
}
