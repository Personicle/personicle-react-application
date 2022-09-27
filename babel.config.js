module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // this must be the last entry in plugins array
    ],
  };
};
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv'],
//   plugins: [
//     ["module:react-native-dotenv", {
//       "envName": "APP_ENV",
//       "moduleName": "@env",
//       "path": ".env",
//       "safe": false,
//       "allowUndefined": true,
//       "verbose": false
//     }]
//   ]
// };
