import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import eventRead from "./interceptors"

const EVENTS_READ_URL = 'https://api/personicle.org/data/read/events'

export async function getUserEvents(){
    // const user_id = SecureStore.getItemAsync("user_id");
    // const token = SecureStore.getItemAsync("token");
  
    // const url = EVENTS_READ_URL+`?startTime=${st}?endTime=${currentDate}?user_id=${user_id}`
    
    try {
        const res = await eventRead();
        return res
    } catch (error) {
        console.error(error)
    }
}