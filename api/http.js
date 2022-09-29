
import eventRead, { getToken } from "./interceptors"
import getPhysiciansQuestions from "./interceptors"
import { getUser } from "@okta/okta-react-native";
import axios from 'axios';

export async function getUserEvents(){
    try {
        const res = await eventRead();
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function getPhyQuestions(){
    try {
        const res = await axios.get('https://app.personicle.org/physician/questions', {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        // console.error(res)
        
        return res
    } catch (error) {ß
        console.error(error)
    }
}
// const { Pool, Client } = require('pg')

// const client = new Client({
//     user: '',
//     host: '',
//     database: '',
//     password: ''
//   })
//   client.connect()

// export async function getUsers(){
//     client.query('SELECT * from users', (err, res) => {
//         if (err) {
//           console.error(err.stack)
//         } else {
//           console.error(res.rows[0])
//         }
//       })
      
// }
 