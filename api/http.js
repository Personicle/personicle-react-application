
import eventRead from "./interceptors"
import { getUser } from "@okta/okta-react-native";

export async function getUserEvents(){
    try {
        const res = await eventRead();
        return res
    } catch (error) {
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
 