import { Button, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useContext, useEffect } from "react";
import { Context } from "../context/AuthorizationContext";

const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(Context);

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

export default ProfileScreen;

const styles = StyleSheet.create({});
