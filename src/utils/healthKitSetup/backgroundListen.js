import { NativeAppEventEmitter } from "react-native";

const callback = () => {
  /* Execute any data query */
  console.error("healthkit setup");
};

/* Register native listener that will be triggered when successfuly enabled */
NativeAppEventEmitter.addListener(
  "healthKit:HeartRate:setup:success",
  callback
);

/* Register native listener that will be triggered on each update */
NativeAppEventEmitter.addListener("healthKit:HeartRate:new", callback);
