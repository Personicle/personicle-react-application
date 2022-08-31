import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useContext } from "react";
import signInWithBrowser from "@okta/okta-react-native";
import {GoogleSigninButton,} from 'react-native-google-signin';
import { Context } from "../context/AuthorizationContext";

const LoginScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(userEmail, password);
  const { state, login, googleSignIn, signUp} = useContext(Context);

  console.log(state);

  return (
    <View style={styles.container}>
      <View style={styles.loginIcon}>
        <Text style={{ fontSize: 40 }}>Personicle</Text>
      </View>
      <View
        style={{
          flex: 2,
          alignItems: "stretch",
        }}
      >
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          value={userEmail}
          onChangeText={setUserEmail}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="Sign In"
          onPress={() => {
            console.log("button pressed");
            console.log(userEmail, password);
            login(userEmail, password);
          }}
        />
         <GoogleSigninButton
          style={{marginLeft: 85}}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => {
            console.log("google sign in button pressed");
            googleSignIn();
          }}
        />

        <Button
        title="Create a new account"
          style={{marginLeft: 85}}
          onPress={() => {
            console.log("sign up button pressed");
            signUp();
          }}
        />
        {state.errorMessage ? <Text>{state.errorMessage}</Text> : null}
        {state.logged_in ? <Text>Logged in</Text> : <Text>not in </Text>}
        <Text>{JSON.stringify(state)}</Text>
      </View>
    </View>
  );
};

// LoginScreen.navigationOptions = () => {
//   return { header: false };
// };

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  loginIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    marginHorizontal: 50,
    marginBottom: 10,
    height: 40,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
  },
});
