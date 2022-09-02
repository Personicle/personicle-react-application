import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { Provider } from "./src/context/AuthorizationContext";
import {Context} from "./src/context/AuthorizationContext";
import oktaConfig from "./okta.config";
// import { init } from "./src/utils/database";
import AppLoading from "expo-app-loading";
import { startLocationTracking, trackLocations, stopLocationTracking } from "./src/utils/location";
import * as SecureStore from "expo-secure-store";
import {createConfig,isAuthenticated, introspectAccessToken, revokeAccessToken,introspectIdToken, refreshTokens}  from "@okta/okta-react-native";
import Router from "./src/Router";
import RootNavigation from "./src/RootNavigation"
import {authReducer, isAuthed, test} from "./src/context/AuthorizationContext"



export default () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  
  useEffect(() => {
    console.log("setting up okta config");
    // init().then(() => {
    //   setDbInitialized(true);
    // }).catch((err) => {
    //   console.log(err);
    // });
    
    // (async () => {
    //   const res = await isAuthed();
    //   // console.error(res);
    //   if (res == true){
    //     // console.error(state);
    //     // startLocationTracking();
    //     const r = await startTracking();
    //     // console.error("here");
    //     // RootNavigation.navigate("Profile");
    //     // navigate("Profile");
    //   } else {
    //     // navigate("Login");
    //     stopLocationTracking();
    //   }
    // })();
    createConfig({
      clientId: oktaConfig.oidc.clientId,
      redirectUri: oktaConfig.oidc.redirectUri,
      endSessionRedirectUri: oktaConfig.oidc.endSessionRedirectUri,
      discoveryUri: oktaConfig.oidc.discoveryUri,
      scopes: oktaConfig.oidc.scopes,
      requireHardwareBackedKeyStore:
        oktaConfig.oidc.requireHardwareBackedKeyStore,
    }).then((resp) => console.log(resp));
  }, []);


  // if (!dbInitialized){
  //   return <AppLoading/>
  // }
  console.log("starting app in app js");

  return (
    <Provider>
      <Router />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
