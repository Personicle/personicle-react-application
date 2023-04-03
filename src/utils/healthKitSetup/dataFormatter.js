import * as SecureStore from "expo-secure-store";
import { personicleDataMapping } from "./dataMapping";
import event_mapping from './event_mapping.json';
export const sleepEventFormatter = (events) => {
  let response = [];
  SecureStore.getItemAsync("user_id").then((userId) => {
    events.forEach((element) => {
      response.push({
        individual_id: userId,
        start_time: element.startDate,
        end_time: element.endDate ? element.endDate : element.startDate,
        duration: element.endDate - element.startDate,
        event_name: `Sleep:${element.value}`,
        source: "PERSONICLE_IOS_APP",
        parameters: JSON.stringify({
          source_device: element.sourceName,
          on_device_source_id: element.sourceId,
        }),
      });
    });
  });

  return response;
};

export const workoutEventFormatter = (events) => {
  let response = [];
  SecureStore.getItemAsync("user_id").then((userId) => {
    events.forEach((element) => {
      response.push({
        individual_id: userId,
        start_time: element.start,
        end_time: element.end ? element.end : element.start,
        duration: element.end - element.start,
        event_name: element.activityName,
        event_type: event_mapping[element.activityId],
        source: "PERSONICLE_IOS_APP",
        parameters: JSON.stringify({
          source_device: element.sourceName,
          on_device_source_id: element.sourceId,
          device: element.device,
          caloriesBurned: element.calories ? element.calories : null,
          totalDistance: element.distance ? element.distance : null,
        }),
      });
    });
  });

  return response;
};

export const mindfulnessEventFormatter = (events) => {
  let response = [];
  SecureStore.getItemAsync("user_id").then((userId) => {
    events.forEach((element) => {
      response.push({
        individual_id: userId,
        start_time: element.startDate,
        end_time: element.endDate ? element.endDate : element.startDate,
        duration: element.endDate - element.startDate,
        event_name: "Mindfulness",
        source: "PERSONICLE_IOS_APP",
        parameters: JSON.stringify({}),
      });
    });
  });

  return response;
};

export const bloodPressureFormatter = async (streamName, data) => {
  const userId = await SecureStore.getItemAsync("user_id");
  let response = {
    individual_id: userId,
    streamName: personicleDataMapping[streamName],
    source: "PERSONICLE_IOS_APP",
    dataPoints: [],
  };

  const promises = data.map(async (element) => {
    return {
      timestamp: element.endDate,
      value:
        streamName === "BloodPressureDiastolic"
          ? element.bloodPressureDiastolicValue
          : element.bloodPressureSystolicValue,
    };
  });
  response.dataPoints = await Promise.all(promises);
  return await response;
};

export const defaultDatastreamFormatter = async (streamName, data) => {
  const userId = await SecureStore.getItemAsync("user_id");
  let response = {
    individual_id: userId,
    streamName: personicleDataMapping[streamName],
    source: "PERSONICLE_IOS_APP",
    dataPoints: [],
  };

  const promises = data.map(async (element) => {
    return {
      timestamp: element.endDate,
      value: element.value,
    };
  });
  response.dataPoints = await Promise.all(promises);
  return await response;
};

export const intervalDataStreamFormatter = async (streamName, data) => {
  const userId = await SecureStore.getItemAsync("user_id");
  let response = {
    individual_id: userId,
    streamName: personicleDataMapping[streamName],
    source: "PERSONICLE_IOS_APP",
    dataPoints: [],
  };

  const promises = data.map(async (element) => {
    return {
      start_time: element.startDate,
      end_time: element.endDate,
      value: element.value,
    };
  });
  response.dataPoints = await Promise.all(promises);
  return await response;
};

// Not used anywhere
export const dataStreamFormatter = (streamName) => {
  SecureStore.getItemAsync("user_id").then((userId) => {
    let response = {
      individual_id: userId,
      streamName: personicleDataMapping[streamName],
      source: "PERSONICLE_IOS_APP",
      dataPoints: [],
    };

    events.forEach((element) => {
      response.dataPoints.push({
        start_time: element.startDate,
        end_time: element.endDate,
        value: element.value,
      });
    });
  });

  return response;
};
