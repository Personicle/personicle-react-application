import BackgroundGeolocation from "react-native-background-geolocation";
import axios from 'axios'

async function deleteLocs(){
  await BackgroundGeolocation.destroyLocations();
}
async function  sendLocation(location, auth,user_id){
  let allLocations = await BackgroundGeolocation.getLocations();
  // if (allLocations.length() == 0) return;
  let values = []
  allLocations.forEach(loc => {
    values.push({
      'latitude': loc['coords']['latitude'],
      'longitude': loc['coords']['longitude'],
      'timestamp': loc['timestamp']
    })
  })
 
  data = {
    "individual_id": user_id,
    "streamName": "com.personicle.individual.datastreams.location",
    "source": "PERSONICLE_IOS_APP",
    "dataPoints":[{
      "timestamp": location['timestamp'],
      "value": values
    }]
  }
  axios.post('https://api.personicle.org/data/write/datastream/upload', JSON.stringify(data), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+auth
    }
  }).then(res => {
    if (res.status == 200){
      deleteLocs()
    }
  });
 
}

export async function trackLocations(auth,user_id){
  const onLocation = BackgroundGeolocation.onLocation((location) => {
    // console.error('[onLocation]', location);
    sendLocation(location,auth,user_id);
  })
}

export function startLocationTracking(){
  const state =  BackgroundGeolocation.ready({
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    // Activity Recognition
    stopTimeout: 5,
    // Application config
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
    startOnBoot: true, 
    stationaryRadius: 15,    // <-- Auto start tracking when device is powered-up.
    // HTTP / SQLite config
    
    // url: 'http://localhost:3000/locations',
    // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
     autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
    // headers: {              // <-- Optional HTTP headers
    // "authorization":  "Bearer "+auth
    // },
    // params: {
    //   "individual_id": "user_id_here",
    //   "streamName": "com.personicle.individual.datastreams.location",
    //   "source": "PERSONICLE_IOS_APP"
    // },
    
  })
    BackgroundGeolocation.start();
}

export function stopLocationTracking(){
  BackgroundGeolocation.stop();
}