import { NavigationContainer } from "@react-navigation/native";

import { LoginStack, AppStack, SplashStack} from "./navigationStacks";
import { Context } from "./context/AuthorizationContext";
import { navigationRef } from "./RootNavigation";
import * as SecureStore from "expo-secure-store";
import { useContext, useEffect, useState } from "react";
import { introspectAccessToken, refreshTokens}  from "@okta/okta-react-native";
import {authReducer, isAuthed, test} from "./context/AuthorizationContext"
import { startLocationTracking, trackLocations, stopLocationTracking } from "../src/utils/location"

export const startTracking = async () => {
  
  try {
        const token = await SecureStore.getItemAsync("token");
        const user_id = await SecureStore.getItemAsync("user_id");
        await startLocationTracking();
        await trackLocations(token,user_id)
        return true;
    
  } catch (error) {
    console.error(error)
    return false;
  }

}


export default () => {
  const { state, autoLogin } = useContext(Context);
  useEffect(() => {
    (async () => {
        if(state.logged_in == false){
        // console.error("if is logged in:", state.logged_in)

          const res = await autoLogin();
          // console.error("auto login response: ", res)
          if(res){
            startTracking();
          } else {
            stopLocationTracking();
          }
        } 
        // console.error("is logged in:", state.logged_in)
       
    })();
  },[])
  return (
    <NavigationContainer ref={navigationRef}>
      {/* <LoginStack /> */}
      {/* {console.error("inside navigation container")} */}

      {/* {console.error(state.token)} */}
      {/* {console.error(authed)} */}
      {
        state.isLoading ? (<SplashStack/>): state.token == null ? (<LoginStack/>): (<AppStack/>)
      }
      {/* { ( state.token) ? <AppStack /> : <LoginStack />} */}
    </NavigationContainer>
  );
};
