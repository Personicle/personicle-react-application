import { Button, StyleSheet, Text, View, Alert } from "react-native";
import React, { useContext, useEffect } from "react";
import { Context } from "../context/AuthorizationContext";


const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(Context);
 
    
  return (
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
  );
};


export default ProfileScreen;

const styles = StyleSheet.create({});
