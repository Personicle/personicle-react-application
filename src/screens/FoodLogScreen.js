import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
// import ReactDOM from "react-dom";
import { VictoryBar, VictoryChart } from "victory-native";

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
        <VictoryChart>
          <VictoryBar
            data={data}
            // data accessor for x values
            x="quarter"
            // data accessor for y values
            y="earnings"
          />
        </VictoryChart>
      </View>
    </SafeAreaView>
  );
};

export default FoodLogScreen;

const styles = StyleSheet.create({});
