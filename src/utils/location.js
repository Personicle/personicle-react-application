import BackgroundGeolocation, {
    Location,
    Subscription
  } from "react-native-background-geolocation";
import { getAccessToken, isAuthenticated, refreshTokens} from "@okta/okta-react-native";
import axios from 'axios'

async function deleteLocs(){
  // console.error(location.uuid)
  await BackgroundGeolocation.destroyLocations();
}
async function  sendLocation(location, auth,user_id){
  let allLocations = await BackgroundGeolocation.getLocations();
  // if (allLocations.length() == 0) return;
  let values = []
  allLocations.forEach(loc => {
    console.error(loc)
    values.push({
      'latitude': loc['coords']['latitude'],
      'longitude': loc['coords']['longitude'],
      'timestamp': loc['timestamp']
    })
  })
  console.error(typeof allLocations)
  console.error(typeof location)
  // val = {
  //   'latitude': location['coords']['latitude'],
  //   'longitude': location['coords']['longitude']
  // }
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
  // axios.post('https://api.personicle.org/data/write/datastream/upload', JSON.stringify(data), {
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Authorization': "Bearer "+auth
  //   }
  // }).then(res=> console.error(res.statusText));
}
export async function syncLocations(){
  BackgroundGeolocation.sync((records) => {
    console.error("[sync] success: ", records);
  }).catch((error) => {
    console.error("[sync] FAILURE: ", error);
  });
}
export async function trackLocations(auth,user_id){
  // let de = await BackgroundGeolocation.destroyLocations();

  let allLocations = await BackgroundGeolocation.getLocations();
  let count = await BackgroundGeolocation.getCount();
  console.error(count)
  
  
  
  //   try {r
  //      const res = await refreshTokens();
  //     console.error(res);
  //     console.error("hello");
  
  //     // business logic goes here
  // } catch (error) {
  //     console.error(error) // from creation or business logic
  // }
  const onLocation = BackgroundGeolocation.onLocation((location) => {
    console.error('[onLocation]', location);
    console.error("hola")
    sendLocation(location,auth,user_id);
  })
  // console.error(locations)
  // console.error(count)
  // const r = await syncLocations();
  // console.error(r)
  
  
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