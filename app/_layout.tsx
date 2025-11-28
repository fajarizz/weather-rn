import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import '../global.css';
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return <QueryClientProvider client={new QueryClient()}>
    <Stack screenOptions={{ headerShown: false }} />
    <StatusBar style="dark" />
  </QueryClientProvider>
}
