import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import moment from 'moment'

const getToken = async()=>{
    const token = await SecureStore.getItemAsync("token");
    return token;
}
const getUserId = async() => {
    const uid = await SecureStore.getItemAsync("user_id");
    return uid;
}
const eventRead  = axios.create({
    baseURL: 'https://api.personicle.org/data/read/events',
})
function toString(number, padLength) {
    return number.toString().padStart(padLength, '0');
}
eventRead.interceptors.request.use(async (request)=>{
    
        let date = new Date();
        let dateTimeNow =
                            toString( date.getFullYear(),     4 )
                + '-'  + toString( date.getMonth() +1,    2 )
                + '-'  + toString( date.getDate(),         2 )
                + ' ' + toString( date.getHours(),        2 )
                + ':'  + toString( date.getMinutes(),      2 )
                + ':'  + toString( date.getSeconds(),      2 )
                + '.'  + toString( date.getMilliseconds(), 6 );

        let threeMonthsAgo =
                    toString( date.getFullYear(),     4 )
        + '-'  + toString( date.getMonth() -2,    2 )
        + '-'  + toString( date.getDate(),         2 )
        + ' ' + toString( date.getHours(),        2 )
        + ':'  + toString( date.getMinutes(),      2 )
        + ':'  + toString( date.getSeconds(),      2 )
        + '.'  + toString( date.getMilliseconds(), 6 );
        
        dateTimeNow = new moment(dateTimeNow, "YYYY-MM-DD HH:mm:ss.SSSSSS").utc().format("YYYY-MM-DD HH:mm:ss.SSSSSS");
        threeMonthsAgo = new moment(threeMonthsAgo, "YYYY-MM-DD HH:mm:ss.SSSSSS").utc().format("YYYY-MM-DD HH:mm:ss.SSSSSS");
        request.params = {
            ...request.params,
            startTime: threeMonthsAgo,
            endTime: dateTimeNow,
            user_id: await getUserId()
        }
        
        request.headers['Authorization'] = `Bearer ${await getToken()}`
        return request
    },(error)=>{
        return Promise.reject(error)
    })

eventRead.interceptors.response.use((response)=> {
    return response;
},(error)=>{
    console.error(error);
    return Promise.reject(error);
})
export default eventRead;