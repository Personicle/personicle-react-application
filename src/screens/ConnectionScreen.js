import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { connectHealthKit } from "../utils/healthKitSetup/healthKit";

const ConnectionScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.ConnectionView}>
        {/* <Text>ConnectionScreen</Text> */}
        {/* Apple health kit button */}
        <TouchableOpacity
          onPress={connectHealthKit}
          style={styles.connectionStyle}
        >
          <FontAwesome
            name="apple"
            size={24}
            color="black"
            style={{ paddingRight: 10 }}
          />
          <Text>Connect Apple Health Kit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConnectionScreen;

const styles = StyleSheet.create({
  connectionStyle: {
    borderWidth: 2,
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  ConnectionView: {
    alignItems: "center",
  },
});
