import { NavigationContainer } from "@react-navigation/native";

import { LoginStack, AppStack, SplashStack } from "./navigationStacks";
import { Context } from "./context/AuthorizationContext";
import { navigationRef } from "./RootNavigation";
import * as SecureStore from "expo-secure-store";
import { useContext, useEffect } from "react";
import {
  startLocationTracking,
  trackLocations,
  stopLocationTracking,
} from "../src/utils/location";
import { importHealthKit } from "./utils/healthKitSetup/healthKit";
import PhysiciansContextProvider from "./context/physicians-context";

export const startTracking = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const user_id = await SecureStore.getItemAsync("user_id");
    await startLocationTracking();
    // await trackLocations(token,user_id)
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default () => {

  const { state, autoLogin } = useContext(Context);
  async function refetchTokens() {
    console.error("refetch tokens called")
    if (state.logged_in == false) {
      // console.error("if is logged in:", state.logged_in)

      const res = await autoLogin();
      // console.error("auto login response: ", res)
      if (res) {
        startTracking();
        importHealthKit();
      } else {
        stopLocationTracking();
      }
    } else {
      startTracking();
      console.warn("Start tracking after signing in");
      importHealthKit();
    }
  }
  useEffect(() => {
    (async () => {
      const firstFetch = await refetchTokens();
     
        try {
          const ress =  setInterval( async () =>  await refetchTokens(), 3480000  ) // refresh tokens every 58 minutes
            // console.error(ress)
          } catch (error) {
            console.error(error)
          }
      
    })();
    
    // (async () => {

    //   if (state.logged_in == false) {
    //     // console.error("if is logged in:", state.logged_in)
       
        

    //     const res = await autoLogin();
    //     // console.error("auto login response: ", res)
    //     if (res) {
    //       startTracking();
    //       importHealthKit();
    //     } else {
    //       stopLocationTracking();
    //     }
    //   } else {
    //     startTracking();
    //     console.warn("Start tracking after signing in");
    //     importHealthKit();
    //   }
    //   // console.error("is logged in:", state.logged_in)
    // })();

  }, []);
  return (
    <PhysiciansContextProvider>

    <NavigationContainer ref={navigationRef}>
          {state.isLoading ? (
            <SplashStack />
          ) : state.token == null ? (
            <LoginStack />
          ) : (
            <AppStack />
          )}
          {/* { ( state.token) ? <AppStack /> : <LoginStack />} */}
        </NavigationContainer>
    </PhysiciansContextProvider>
  
  );
};
