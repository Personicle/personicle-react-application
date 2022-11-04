import { StyleSheet, Text, View, SafeAreaView, Dimensions } from "react-native";
import React from "react";
// import ReactDOM from "react-dom";

const FoodLogScreen = () => {
  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

  return (
    <SafeAreaView>
      <View>
        <Text>FoodLogScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default FoodLogScreen;

const styles = StyleSheet.create({});
