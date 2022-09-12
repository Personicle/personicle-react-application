import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const writeEvents = async (events) => {
  // Create the api end point for writing events
  try {
    const token = await SecureStore.getItemAsync("token");
    console.warn(events);
    const apiEndpoint = axios.create({
      baseURL: "https://api.personicle.org/data/write/event/upload",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // add events to the request and make the api call
    apiEndpoint
      .post("", JSON.stringify(events))
      .then((res) => {
        console.warn(res);
      })
      .catch((err) => {
        console.error(err);
      });

    // return response;
  } catch (err) {
    console.error(err);
  }
};

export const writeDataStream = async (dataPoints) => {
  // Create the api end point for writing events
  try {
    const token = await SecureStore.getItemAsync("token");
    const apiEndpoint = axios.create({
      baseURL: "https://api.personicle.org/data/write/datastream/upload", //"http://127.0.0.1:5001/datastream/upload",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // add events to the request and make the api call
    if (dataPoints.dataPoints.length > 0) {
      apiEndpoint
        .post("", JSON.stringify(dataPoints))
        .then((res) => {
          console.warn(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
  }

  // add data points to the request and make the api call
};
