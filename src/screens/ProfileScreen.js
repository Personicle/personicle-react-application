import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Context } from "../context/AuthorizationContext";
import { getAccessToken, isAuthenticated } from "@okta/okta-react-native";

const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(Context);
  console.log(state);
  //   const { authenticated } = await isAuthenticated();
  //   const { access_token } = await getAccessToken();
  return (
    <SafeAreaView>
      <View>
        <Text>ProfileScreen</Text>
        <Text>{JSON.stringify(state)}</Text>
        <Button
          title="Sign Out"
          onPress={() => {
            logout();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

// ProfileScreen.navigationOptions = () => {
//   return { header: false };
// };

export default ProfileScreen;

const styles = StyleSheet.create({});
