import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const readEvent = axios.create({
  baseURL: "",
  headers: {
    Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
  },
});

export const readDataStream = axios.create({
  baseURL: "",
  headers: {
    Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
  },
});
