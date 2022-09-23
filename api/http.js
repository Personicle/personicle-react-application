
import eventRead from "./interceptors"

export async function getUserEvents(){
    try {
        const res = await eventRead();
        return res
    } catch (error) {
        console.error(error)
    }
}