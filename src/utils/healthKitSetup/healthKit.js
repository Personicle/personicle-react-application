import {
  sleepEventFormatter,
  workoutEventFormatter,
  defaultDatastreamFormatter,
  bloodPressureFormatter,
  intervalDataStreamFormatter,
} from "./dataFormatter";
import { writeEvents, writeDataStream } from "../../api/personicleWrite";
import { personicleDataMapping } from "./dataMapping";

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from "react-native-health";

const datastreamFormatterMapping = {
  // blood pressure formatters
  BloodPressureDiastolic: bloodPressureFormatter,
  BloodPressureSystolic: bloodPressureFormatter,
  // Interval formatters
  StepCount: intervalDataStreamFormatter,
  ActiveEnergyBurned: intervalDataStreamFormatter,
  BasalEnergyBurned: intervalDataStreamFormatter,
  EnvironmentalAudioExposure: intervalDataStreamFormatter,
  HeadphoneAudioExposure: intervalDataStreamFormatter,
  DistanceCycling: intervalDataStreamFormatter,
  DistanceSwimming: intervalDataStreamFormatter,
  DistanceWalkingRunning: intervalDataStreamFormatter,
  FlightsClimbed: intervalDataStreamFormatter,
  StepCount: intervalDataStreamFormatter,
};

/* Permission options */
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
      AppleHealthKit.Constants.Permissions.BloodGlucose,
      AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
      AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
      AppleHealthKit.Constants.Permissions.BodyFatPercentage,
      AppleHealthKit.Constants.Permissions.BodyMass,
      AppleHealthKit.Constants.Permissions.BodyMassIndex,
      AppleHealthKit.Constants.Permissions.BodyTemperature,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.DistanceSwimming,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.EnvironmentalAudioExposure,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.HeadphoneAudioExposure,
      AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.Height,
      AppleHealthKit.Constants.Permissions.RespiratoryRate,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.Vo2Max,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.Steps,
      // Event read permissions
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.MindfulSession,
    ],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
};


const dataGetterMapping = {
  ActiveEnergyBurned: AppleHealthKit.getActiveEnergyBurned,
  // AppleExerciseTime
  // AppleStandTime
  BasalEnergyBurned: AppleHealthKit.getBasalEnergyBurned,

  // BloodAlcoholContent
  BloodGlucose: AppleHealthKit.getBloodGlucoseSamples,
  BloodPressureDiastolic: AppleHealthKit.getBloodPressureSamples,
  BloodPressureSystolic: AppleHealthKit.getBloodPressureSamples,
  BodyFatPercentage: AppleHealthKit.getBodyFatPercentageSamples,
  // BodyMass: AppleHealthKit.getLeanBodyMassSamples,
  BodyMassIndex: AppleHealthKit.getBmiSamples,
  BodyTemperature: AppleHealthKit.getBodyTemperatureSamples,
  // Electrocardiogram
  EnvironmentalAudioExposure: AppleHealthKit.getEnvironmentalAudioExposure,
  HeadphoneAudioExposure: AppleHealthKit.getHeadphoneAudioExposure,
  DistanceCycling: AppleHealthKit.getDailyDistanceCyclingSamples,
  DistanceSwimming: AppleHealthKit.getDailyDistanceSwimmingSamples,
  DistanceWalkingRunning: AppleHealthKit.getDailyDistanceWalkingRunningSamples,
  FlightsClimbed: AppleHealthKit.getFlightsClimbed,
  // HeartbeatSeries
  HeartRate: AppleHealthKit.getHeartRateSamples,
  RestingHeartRate: AppleHealthKit.getRestingHeartRateSamples,
  HeartRateVariability: AppleHealthKit.getHeartRateVariabilitySamples,
  Height: AppleHealthKit.getHeightSamples,
  LeanBodyMass: AppleHealthKit.getLeanBodyMassSamples,
  // MindfulSession
  // NikeFuel
  RespiratoryRate: AppleHealthKit.getRespiratoryRateSamples,
  // SleepAnalysis
  StepCount: AppleHealthKit.getDailyStepCountSamples,
  // Steps
  // VitalSignRecord
  Vo2Max: AppleHealthKit.getVo2MaxSamples,
  // WalkingHeartRateAverage
  Weight: AppleHealthKit.getWeightSamples,
};

export const connectHealthKit = () => {
  AppleHealthKit.initHealthKit(permissions, (error) => {
    /* Called after we receive a response from the system */

    if (error) {
      // console.log("[ERROR] Cannot grant permissions!");
      // console.error("Cannot grant permission");
    }

    /* Can now read or write to HealthKit */
    // console.warn("Permission granted");
    importHealthKit();
  });
};

export const getWorkoutData = () => {
  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
    endDate: new Date().toISOString(),
    type: "Workout",
  };

  return AppleHealthKit.getSamples(options, (callbackError, results) => {
    /* Samples are now collected from HealthKit */
    if (callbackError) {
      // console.warn(JSON.stringify(callbackError));
    } else {
      // console.warn("workouts" + JSON.stringify(results));
      // console.log(JSON.stringify(results));

      const formatted_events = workoutEventFormatter(results);
      writeEvents(formatted_events);
    }
  });
};

export const getSleepData = () => {
  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
    endDate: new Date().toISOString(),
    // limit: 2,
  };

  return AppleHealthKit.getSleepSamples(options, (callbackError, results) => {
    /* Samples are now collected from HealthKit */
    if (callbackError) {
      // console.warn(JSON.stringify(callbackError));
    } else {
      // console.warn("Sleep" + JSON.stringify(results));
      // console.log(JSON.stringify(results));

      const formatted_events = sleepEventFormatter(results);
      writeEvents(formatted_events);
    }
  });
};

export const getMindfulnessData = () => {
  let options = {
    startDate: new Date(2021, 0, 0).toISOString(),
    endDate: new Date().toISOString(),
  };

  AppleHealthKit.getMindfulSession(options, (err, results) => {
    if (err) {
      // console.error("error getting mindful session: ", err);
      return;
    }
    // returns array of mindful session data
    // console.warn(results);
    const formatted_events = sleepEventFormatter(results);
    writeEvents(formatted_events);
  });
};

export const getDatastreams = () => {
  Object.keys(personicleDataMapping).forEach((streamName) => {
    // console.warn("Getting stream " + streamName);
    const getterMethod = dataGetterMapping[streamName];

    const options = {
      startDate: new Date(2021, 0, 0).toISOString(),
      endDate: new Date().toISOString(),
    };
    getterMethod(options, (err, results) => {
      if (err) {
        // console.error("error getting session: " + streamName, err);
        return;
      }
      // returns array of mindful session data
      // console.warn(results);
      try {
        // console.warn(`${streamName} ${JSON.stringify(results)}`);
        const formatter =
          streamName in datastreamFormatterMapping
            ? datastreamFormatterMapping[streamName]
            : defaultDatastreamFormatter;
        // const formatted_data = formatter(streamName, results);
        formatter(streamName, results)
          .then((formatted_data) => {
            // console.warn(
            //   `formatted data for ${streamName} ${JSON.stringify(
            //     formatted_data
            //   )}`
            // );
            writeDataStream(formatted_data);
          })
          .catch((err) => {
            // console.error(err)
          });
      } catch (err) {
        // console.error(`error in ${streamName} ${err}`);
      }
    });
  });
};

export const importHealthKit = async () => {
  getWorkoutData();
  getMindfulnessData();
  getSleepData();

  getDatastreams();
};
