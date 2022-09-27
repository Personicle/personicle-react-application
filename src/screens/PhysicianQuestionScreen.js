import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PhysiciansOutput from "../components/PhysiciansOutput";

const PhysicianQuestionScreen = () => {
  return (
    // <SafeAreaView>
    //   <View>
    //     <Text>PhysicianQuestionScreen</Text>
    //   </View>
    // </SafeAreaView>
    <PhysiciansOutput physician_id="1" />
  );
};

export default PhysicianQuestionScreen;

const styles = StyleSheet.create({});
