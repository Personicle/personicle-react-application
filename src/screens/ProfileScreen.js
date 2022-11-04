import { Button, StyleSheet, ActivityIndicator,View, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState, useLayoutEffect} from "react";
import { Context } from "../context/AuthorizationContext";
import { Avatar,Title,Caption,Text,TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserInfo, getImageUrl } from "../../api/http";
import { useIsFocused } from "@react-navigation/core";


const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [st, setState] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');



  const isFocused = useIsFocused();
  useEffect(()=>{
    async function getProfileImageUrl(imageKey){
      const res = await getImageUrl(imageKey);
      setProfileImage(res['data']['image_url'])
      setIsLoading(false);

    }
      async function getUser(){
      const res = await getUserInfo();
      if(res != undefined){
        setIsLoading(true);
        setEmail(res['data']['email']);
        setCity(res['data']['info']['city'])
        setState(res['data']['info']['state'])
        setCountry(res['data']['info']['country'])
        setName(res['data']['name'])

        if(res['data']['info']['image_key'] != undefined){
          getProfileImageUrl(res['data']['info']['image_key'])
        } else {
         setIsLoading(false);
        }
        
      } else {
        setIsLoading(false);
      }
    }
    isFocused && getUser();
  },[isFocused])

  return (
    <>
     {isLoading ? <View style={styles.loading}>
            <ActivityIndicator size='large' color="#0000ff" />
            </View>: <SafeAreaView style= {styles.container}>
        
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Avatar.Image
            source={{
              uri: profileImage
            }}
              // source={ require("../../src/components/UI/stock.jpg")}
              size = {80}
            />
            <View  style={{marginLeft: 20}}>
              <Title style={[styles.title, {
                marginTop:15,
                marginBottom: 5,
               }]}>
                  {name}
              </Title>
              {/* <Caption style={styles.caption}>@j_doe</Caption> */}
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{city}, {country}</Text>
          </View>
            {/* <View style={styles.row}>
              <Icon name="phone" color="#777777" size={20}/>
              <Text style={{color:"#777777", marginLeft: 20}}>123456789</Text>
           </View> */}
          <View style={styles.row}>
            <Icon name="email" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{email}</Text>
          </View>

        </View>
      </SafeAreaView> }
    </>
      
 
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  loading: {
    position: 'absolute',
    backgroundColor: '#F5FCFF88',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
