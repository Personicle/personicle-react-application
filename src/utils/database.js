import * as SQLite from 'expo-sqlite';


const database = SQLite.openDatabase('locations.db');

export function init(){
    const promise = new Promise((resolve,reject)=>{ 
        database.transaction((tx)=>{
            tx.executeSql(`CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY NOT NULL,
                lat REAL,
                lng REAL 
                
            )`, [], ()=>{resolve()}, (_,error)=>{})
        })
    })
    return promise;
}


export function selectFromDb(locations){
    const promise = new Promise((resolve,reject) => {
        database.transaction((tx)=>{
            tx.executeSql(`select * INTO locations`, [],
            (_,result)=>{ 
                // console.error(result);
                resolve();
            },
            (_,error) => {
                reject(error);
            }
            )
        })
    });

    return promise
}
export function insertLocation(locations){
    const promise = new Promise((resolve,reject) => {
        database.transaction((tx)=>{
            tx.executeSql(`INSERT INTO locations (lat,lng) VALUES (?,?)`, [ locations[0]['coords']['latitude'], locations[0]['coords']['longitude'] ], 
            (_,result)=>{ 
                // console.error(result);
                resolve();
            },
            (_,error) => {
                reject(error);
            }
            )
        })
    });

    return promise
}