import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Image
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { connectHealthKit } from "../utils/healthKitSetup/healthKit";
import { getUserId } from "../../api/interceptors";
// import {GOOGLE_FIT_CONNECTION, FITBIT_CONNECTION, OURA_CONNECTION} from '@env'
// import {GOOGLE_FIT_CONNECTION, FITBIT_CONNECTION, OURA_CONNECTION} from 'react-native-dotenv'

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
            size={45}
            color="black"
            style={{ paddingRight: 10 }}
          />
          <Text> Connect Apple Health</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => { 
            const uid = await getUserId();
            Linking.openURL(`https://personicle-ingestion-staging.azurewebsites.net/google-fit/connection?user_id=${uid}`)
           }}
          style={styles.connectionStyle}
        >
          <Image  style={styles.image} source={require("../../assets/googlefit.png")}/>
          <Text>  Connect Google fit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => { 
            const uid = await getUserId();
            Linking.openURL(`https://personicle-ingestion-staging.azurewebsites.net/fitbit/connection?user_id=${uid}`)
           }}
          style={styles.connectionStyle}
        >
          <Image  style={styles.image} source={require("../../assets/fitbit.png")}/>
          <Text style>  Connect Fitbit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => { 
            const uid = await getUserId();
            Linking.openURL(`https://personicle-ingestion-staging.azurewebsites.net/oura/connection?user_id=${uid}`)
           }}
          style={styles.connectionStyle}
        >
          <Image  style={styles.image} source={require("../../assets/oura.png")}/>
          <Text style> Connect Oura</Text>
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
    justifyContent: "center",
    padding: 14,
    borderRadius: 5,
    backgroundColor: "white",
  },
  ConnectionView: {
    // flex: 1,
    justifyContent: "center",
    // paddingHorizontal: 4,
    // alignItems: "center",
  },
  image: {
    width: 45,
    paddingRight: 20,
    height: 45,
  }
});
