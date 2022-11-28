import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import React from "react";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { Provider } from "./src/context/AuthorizationContext";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import oktaConfig from "./okta.config";

import {createConfig}  from "@okta/okta-react-native";
import Router from "./src/Router";

export default () => {
 
  useEffect(() => {
    console.log("setting up okta config");

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
