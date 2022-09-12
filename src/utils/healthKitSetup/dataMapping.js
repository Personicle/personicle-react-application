// Map healthkit data types to personicle data types
export const personicleDataMapping = {
  //   ActiveEnergyBurned: "com.personicle.individual.datastreams.active_calories", Need to define personicle interval type
  // AppleExerciseTime
  // AppleStandTime
  //   BasalEnergyBurned: "com.personicle.individual.datastreams.resting_calories", Need to define personicle interval type

  // BloodAlcoholContent
  BloodGlucose: "com.personicle.individual.datastreams.blood_glucose",
  BloodPressureDiastolic:
    "com.personicle.individual.datastreams.blood_pressure.diastolic",
  BloodPressureSystolic:
    "com.personicle.individual.datastreams.blood_pressure.systolic",
  BodyFatPercentage: "com.personicle.individual.datastreams.body_fat",
  //   BodyMass: "",
  //   BodyMassIndex: "", Need personicle type
  BodyTemperature: "com.personicle.individual.datastreams.body_temperature",
  // Electrocardiogram
  //   EnvironmentalAudioExposure: "", Need personicle type
  //   HeadphoneAudioExposure: "", Need personicle type
  DistanceCycling: "com.personicle.individual.datastreams.interval.distance",
  DistanceSwimming: "com.personicle.individual.datastreams.interval.distance",
  DistanceWalkingRunning:
    "com.personicle.individual.datastreams.interval.distance",
  //   FlightsClimbed: "", Need personicle type
  // HeartbeatSeries
  HeartRate: "com.personicle.individual.datastreams.heartrate",
  //   RestingHeartRate: "", Need personicle type
  //   HeartRateVariability: "", Need personicle type
  Height: "com.personicle.individual.datastreams.height",
  //   LeanBodyMass: "", Need personicle type
  // MindfulSession
  // NikeFuel
  //   RespiratoryRate: "", Need personicle type
  // SleepAnalysis
  StepCount: "com.personicle.individual.datastreams.interval.step.count",
  //   Steps: "",
  // VitalSignRecord
  //   Vo2Max: "", Need personicle type
  // WalkingHeartRateAverage
  Weight: "com.personicle.individual.datastreams.weight",
};
