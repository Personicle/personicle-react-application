import { Button, Alert,StyleSheet, ActivityIndicator,View, SafeAreaView,Image , Animated, TouchableOpacity} from "react-native";
import React, { useContext, useEffect, useState, useLayoutEffect} from "react";
import { Context } from "../context/AuthorizationContext";
import { Avatar,Title,Caption,Text,TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserInfo, getImageUrl, getUsersPhysicians, removePhysiciansFromUser } from "../../api/http";
import { useIsFocused } from "@react-navigation/core";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {navigate} from "../RootNavigation"
import FlashMessage from "react-native-flash-message";
import {SwipeListView} from 'react-native-swipe-list-view';
import { TouchableHighlight } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import {ImageCache} from "../utils/cache";
import { useQuery, useQueryClient} from 'react-query';
import { getToken } from "../../api/interceptors";
import axios from 'axios'
import { userProfileData } from "../utils/user";
const ProfileScreen = ({ navigation }) => {
  const { state, logout } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [st, setState] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [phys, setPhys] = useState([]);
  const isFocused = useIsFocused();
  // const [imageurl, setImageUrl] = useState('');
  const queryClient = useQueryClient()
  
  async function getProfileImageUrl(imageKey){
    const res = await getImageUrl(imageKey);
    const url = res['data']['image_url']
    // console.error(url)
    return url
    // setProfileImage(url)
    // setIsLoading(false);
    // await ImageCache.set("profileImageUrl", url )
  }
  async function getProfileImageUrl2(){
    const r = await getUserInfo();
    const imageKey = r['data']['info']['image_key']
    const res = await getImageUrl(imageKey);
    const url = res['data']['image_url']
    // console.error(url)
    return url
    // setProfileImage(url)
    // setIsLoading(false);
    // await ImageCache.set("profileImageUrl", url )
  }
    const userData = userProfileData();
    // console.error("dfsfsfsdfsdffsf")

    // console.error(userData)
   
    const imageurl = useQuery('profile-image',  () => getProfileImageUrl2(), {keepPreviousData: true} )
    
    // setIsLoading(false);
    
  useLayoutEffect(()=> {
    navigation.setOptions({

        headerLeft: () => (
            <TouchableOpacity onPress={() => logout()} style={{
            }}>
          <Text
            style={{
                fontSize: 20,
                textAlign: "center",
                color: "#000",
            }}
           >Sign out</Text>
        </TouchableOpacity>

        )
    })
  }, [navigation]);


  
 
  useEffect(()=>{
    async function getImageUrlFromCache(){
      console.error("here")
      try {
        const res = await ImageCache.get("profileImageUrl")
        // console.error(res)
        return res;
        console.error(res)
      } catch (error) {
      console.error(error)
      }
    }

    

    async function getPhys(){
      const res = await getUsersPhysicians();
      var i = 0;
      res['data']['physicians'].forEach(phy=>{
        phy['key'] = i;
        i++;
      })
       setPhys(res['data']['physicians']);
    }
      async function getUser(){
       
        const res = await getUserInfo();
        
        if(res != undefined){
          setIsLoading(true);
          setEmail(res['data']['email']);
          // setCity(res['data']['info']['city'])
          setState(res['data']['info']['state'])
          setCountry(res['data']['info']['country'])
          setName(res['data']['name'])
          // const data = queryClient.getQueryData('profile-image')
          // console.error("cache data")
          // console.error(data)
          // const imageurl = await queryClient.fetchQuery('profile-image', () => getProfileImageUrl( res['data']['info']['image_key']) )
          // console.error("here")
          // console.error(imageurl)
          // setImageUrl(imageurl);
          // var profileImageUrl = await getImageUrlFromCache();
          var profileImageUrl = undefined
          // if(profileImageUrl !== undefined){
          //   setProfileImage(profileImageUrl);
          //   setIsLoading(false);
          //   console.error("profile image url from cache")
          // } else {
          //   if(res['data']['info']['image_key'] != undefined){
          //     getProfileImageUrl(res['data']['info']['image_key'])
          //     console.error("profile image url from api call")
          //   }
          // }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
    }
    
    isFocused && getUser() && getPhys() ;
  },[isFocused])

  const VisibleItem = props => {
    const {data} = props;
    return (
      <Animated.View
      style={[styles.rowFront]}>
      <TouchableHighlight
        style={styles.rowFrontVisible}
        onPress={() => console.log('Element touched')}
        underlayColor={'#aaa'}>
        <View>
          <Text style={styles.phyTitle} >
            {data.item.name}
          </Text>
          <Text style={styles.details} numberOfLines={1}>
            {data.item.user_id}
          </Text>
        </View>
      </TouchableHighlight>
     </Animated.View>
    )
  }
  const renderItem = (data, rowMap) => {
    return (
      <VisibleItem data={data}/>
    )
  }

  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, rightActionActivated, 
      rowActionAnimatedValue, rowHeightAnimatedValue, onClose, onDelete} = props;
      
    return (
      <View style={styles.rowBack}>
        <Text>Left</Text>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={onClose}>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={onDelete}>
          <Animated.View style={[styles.trash , {
             transform: [
              {
                scale: swipeAnimatedValue.interpolate({
                  inputRange: [-90, -45],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }]}> 
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }

  const closeRow = (rowMap, rowKey) => {
    if(rowMap[rowKey]){
      rowMap[rowKey].closeRow();
    }
  }
  // note: removing physician from a user also removes the physician questionnaire for this user, because the questionniare is stored in the physician_users relation.
  // So user will not be able to see the questionnaire once physician is added back
  // however the user is able to visualize the previous responses when the physician is added back as the responses are stored as datastream in physician_questionnaire table
  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap,rowKey)
    const newData = [...phys];
    const prevIdx = phys.findIndex(item => item.key === rowKey);
    const phy = phys[prevIdx];
    newData.splice(prevIdx,1)
   
    Alert.alert(
      "Remove Physician",
      `Are you sure you want to remove ${phy.name} from your physicians. ${phy.name} will not have access to your data.`,
      [
        {
          text: "Remove",
          onPress: () => {
            setPhys(newData);
            removePhysiciansFromUser([phy.user_id])
            showMessage({
              message: `${phy.name} removed from your physicians`,
              type: "warning",
              statusBarHeight: 2,
              duration: 3500,
              floating: true,
            });
          }
        },
        {
          text: "Cancel",
          onPress: () => console.error("Cancel Pressed"),
          style: "cancel"
        },

      ]
    );
   
  }

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap,data.item.key)}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    )
  }
  return (
    <>
    {imageurl.isFetching && (
      
          <Text>    Loading... </Text>
     
      )}
      {/* { userData.isSuccess  && (
      
      <Text>  { userData['data']['data']['info']['city']} </Text>
 
      )} */}
      
        <FlashMessage position="top" />
     {isLoading ? <View style={styles.loading}>
            <ActivityIndicator size='large' color="#0000ff" />
            </View>: <SafeAreaView style= {styles.container}>
       
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Avatar.Image
            source={{
              uri: imageurl.isSuccess ? imageurl.data : null
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
            <Text style={{color:"#777777", marginLeft: 20}}>{userData['data']['data']['info']['city']}, {country}</Text>
          </View>
            {/* <View style={styles.row}>
              <Icon name="phone" color="#777777" size={20}/>
              <Text style={{color:"#777777", marginLeft: 20}}>123456789</Text>
           </View> */}
          <View style={styles.row}>
            <Icon name="email" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{email}</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.row} onPress= {() => navigate('AddPhysician', {testImage: profileImage})}>
            <FontAwesome name="plus-circle" size={20} />  
                <Text style={{color:"#000", marginLeft: 20}}>Add Physicians</Text>
             
            </TouchableOpacity>
          </View>
          <Text style={{ marginLeft: 5}}>Your Physicians</Text>
          <Text style={{color:"#777777", marginLeft: 5}}>Your data is shared with: </Text>
          <SwipeListView
            data={phys}
            renderHiddenItem={renderHiddenItem}
            renderItem={renderItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            // rightActivationValue={-200}
            disableRightSwipe
          />
          
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
   backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  phyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  }
});
