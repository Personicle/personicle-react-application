import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createConfig } from "@okta/okta-react-native";
import "react-native-gesture-handler";
import LoginScreen from "./src/screens/LoginScreen";
import { Provider, Context } from "./src/context/AuthorizationContext";
import oktaConfig from "./okta.config";
import ProfileScreen from "./src/screens/ProfileScreen";
import { setNavigator } from "./src/navigationRef";
import SignUpScreen from "./src/screens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { init } from "./src/utils/database";
import AppLoading from "expo-app-loading";
import { startLocationTracking, trackLocations, stopLocationTracking } from "./src/utils/location";
import * as SecureStore from "expo-secure-store";
import {isAuthenticated, introspectAccessToken, revokeAccessToken,introspectIdToken, refreshTokens}  from "@okta/okta-react-native";
import { navigate } from "./src/navigationRef";

const loginNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Profile: ProfileScreen,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      title: "Personicle",
    },
  }
);

const LoginStack = createNativeStackNavigator();

// const AppNavigator = <NavigationContainer></NavigationContainer>

const App = createAppContainer(loginNavigator);

const refreshAllTokens = async () => {
  console.error("refresh tokens func")
  const refresh_tokens = await refreshTokens();
  if(refresh_tokens == null)
    return false;
  await SecureStore.setItemAsync("token", refresh_tokens.access_token);
  await SecureStore.setItemAsync("refresh_token", refresh_tokens.refresh_token); 
  return true;
}

export const isAuthed = async() =>{
  try {
    const token = await SecureStore.getItemAsync("token");
    const tokenIsActive = await introspectAccessToken(token); //  throws error
    if(tokenIsActive["active"]){
      return true;
    } else {
      const res = await refreshAllTokens();
      if(res)
        return true;
      return false
    }
    
  } catch (error) {
    console.error(error);
    const res = await refreshAllTokens();
    if(res)
      return true;
    return false;
    
  }
}
// const refreshTokensAndTrack = async () =>{
//   console.error("refreshing tokens")
//   const refresh_tokens = await refreshTokens();
//   console.error(refreshTokens)
//   await SecureStore.setItemAsync("token", refresh_tokens.access_token);
//   await SecureStore.setItemAsync("refresh_token", refresh_tokens.refresh_token);
//   const token = await SecureStore.getItemAsync("token");
//   const user_id = await SecureStore.getItemAsync("user_id");
//   await trackLocations(token,user_id);
// }

export const startTracking = async () => {
  
    try {
        if(isAuthed()){ // if access token is valid, or successfully refresh tokens
          const token = await SecureStore.getItemAsync("token");
          const user_id = await SecureStore.getItemAsync("user_id");
          await startLocationTracking();
          console.error("called track locations")
          await trackLocations(token,user_id)
          return true;
        } else {
          stopLocationTracking();
          return false;
        }
      // const token = await SecureStore.getItemAsync("token");
      // console.error(token)
      // const tokenIsActive = await introspectAccessToken(token); //  throws error

      // console.error(tokenIsActive["active"]);
      
      //   if ( tokenIsActive["active"]){
      //       console.error("here")
      //       const token = await SecureStore.getItemAsync("token");
      //       const user_id = await SecureStore.getItemAsync("user_id");
      //       await trackLocations(token,user_id)
      //       return true
      //   } else {
      //     if(await refreshAllTokens()){
      //       const token = await SecureStore.getItemAsync("token");
      //       const user_id = await SecureStore.getItemAsync("user_id");
      //       await trackLocations(token,user_id);
      //       return true;
      //     }
      //   }
    } catch (error) {
      //  if (await refreshAllTokens()){
      //   const token = await SecureStore.getItemAsync("token");
      //   const user_id = await SecureStore.getItemAsync("user_id");
      //     await trackLocations(token,user_id);
      //    return true;
      //  }
      // stopLocationTracking()
      console.error(error)
      return false;
    }
  
}
export default () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  // const { state, logout } = useContext(Context);
  
  useEffect(() => {
    console.log("setting up okta config");
    init().then(() => {
      setDbInitialized(true);
    }).catch((err) => {
      console.log(err);
    });
    (async () => {
      const res = await isAuthed();
      console.error(res);
      if (res == true){

        // startLocationTracking();
        const r = await startTracking();
        // console.error(r)
        navigate("Profile");
      } else {
        navigate("Login");
        stopLocationTracking();
      }
    })();
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


  if (!dbInitialized){
    return <AppLoading/>
  }
  console.log("starting app in app js");
  // console.log(state);

  const loginPage = (
    <View>
      <LoginScreen />
      <StatusBar style="auto" />
    </View>
  );

  const loginView = (
    <LoginStack.Navigator initialRouteName="Login">
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen name="Profile" component={ProfileScreen} />
    </LoginStack.Navigator>
  );

  const profilePage = (
    <View>
      <ProfileScreen />
      <StatusBar style="auto" />
    </View>
  );
  return (
    <Provider>
      {
        <App
          ref={(navigator) => {
            setNavigator(navigator);
          }}
        />
        // loginPage
      }
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
