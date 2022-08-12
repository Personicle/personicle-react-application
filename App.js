import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
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

export default () => {
  // const { state } = useContext(Context);
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
