import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function InfoCard({ icon, title, value }: { icon: string, title: string, value?: string }) {
    return (
        <View className="justify-between items-start bg-gray-800 min-h-44 flex-1 rounded-xl px-3 py-5">
            <View className="flex-row w-full justify-start items-center gap-2">
                <MaterialCommunityIcons name={icon} size={24} color="white" />
                <Text className="text-white text-xl font-bold">{title}</Text>
            </View>
            <Text className="text-white text-xl font-bold">{value}</Text>
        </View>
    )
}