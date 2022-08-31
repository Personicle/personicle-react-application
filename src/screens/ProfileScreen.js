import { Button, StyleSheet, Text, View, Alert } from "react-native";
import React, { useContext, useEffect } from "react";
import { Context } from "../context/AuthorizationContext";


const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(Context);
  // const [foregroundLocationPersmissionInfo, requestForegroundPermission] = useBackgroundPermissions();
  
  const [location, setLocation] = React.useState('');
  // useEffect(()=> {
  //   const onLocation = BackgroundGeolocation.onLocation((location) => {
  //     console.log('[onLocation]', location);
  //     setLocation(JSON.stringify(location, null, 2));
  //   })
  //   // trackLocations(state["token"]);
    
  // },[]);

  useEffect(()=>{
    // (async () => {
    //   const res = await isAuthed();
    //   if (res){
    //     startTracking();
    //     //  navigate("Profile");
    //   } else {
    //     stopLocationTracking();
    //     navigate("Login");
    //   }
    // })();
  },[]);
    
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

// ProfileScreen.navigationOptions = () => {
//   return { header: false };
// };

export default ProfileScreen;

const styles = StyleSheet.create({});
