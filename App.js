import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import React from "react";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { Provider } from "./src/context/AuthorizationContext";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import oktaConfig from "./okta.config";
import { QueryClientProvider, QueryClient} from 'react-query';
import {createConfig}  from "@okta/okta-react-native";
import Router from "./src/Router";
import { PersistQueryClientProvider, persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export default () => {
  const queryClient = new QueryClient(
    {
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  }
  )
  
  
 
  const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
  });
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours

  })
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
    <PersistQueryClientProvider 
    client={queryClient}
    persistOptions={{ persister: persister }}
    >
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Router />
      </Provider>
    </QueryClientProvider>
    </PersistQueryClientProvider>
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
