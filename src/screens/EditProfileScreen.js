import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
import {useTheme} from 'react-native-paper';
import Animated, { set } from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import {updateUserInfo, getUserInfo, getImageUrl} from "../../api/http";
import BackgroundGeolocation from "react-native-background-geolocation";
import {ImageCache} from "../utils/cache";
import { useMutation, useQueryClient } from 'react-query'
import { userProfileData, userProfileImage, updateUserProfileImage } from '../utils/user';
import { isEqual } from 'lodash';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";

function EditProfileScreen ({navigation}){
    const {colors} = useTheme();
    const [profilePic, setProfilePic] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    // const [profileImage, setProfileImage] = useState(''); // profile image url fetched from api
    const [userUploadedImage, setUserUploadedImage] = useState('');
    bs = React.createRef();
    fall = new Animated.Value(1);
    let  payload = { data : { info : {} }}
    // 

    const [info, setInfo] = useState({
      'height': '',
      'weight': '',
      'address': '',
      'country': '',
      'city': '',
      'zipcode': '',

    });
    const [initialInfo, setInitialInfo] = useState({
      'height': '',
      'weight': '',
      'address': '',
      'country': '',
      'city': '',
      'zipcode': '',

    });
    const queryClient = useQueryClient()
    const profileImage = userProfileImage(); //uncomment once image upload service is running
    const userData = userProfileData();
  useEffect( () => {
    async function setUser(){
        let uData = {
          'height': userData['data']['data']['info']['height'],
          'weight': userData['data']['data']['info']['weight'],
          'address': userData['data']['data']['info']['address'],
          'country': userData['data']['data']['info']['country'],
          'city': userData['data']['data']['info']['city'],
          'zipcode': userData['data']['data']['info']['zipcode'],
        }
        setInitialInfo(uData)
        setInfo(uData)
        setIsLoading(false);

    }
    setUser();
  },[])

    const profileMutation = useMutation(updateUserInfo, {
        onSuccess: () => {
        // console.error("on success mutation")
        // console.error(updatedData)

        queryClient.setQueryData(['user-profile-data'], (prev) => ( {
          ...prev,
          data: payload['data'] 
         }))
        }
    })
    const profileImageMutation = useMutation(updateUserProfileImage, {
      onSuccess: () => {
      // console.error("on success mutation")
      // console.error(updatedData)
      queryClient.setQueryData(['user-profile-image'], (prev) => (userUploadedImage))
      showMessage({
        message: `Profile image updated!`,
        type: "success",
        statusBarHeight: 2,
        duration: 3500,
        floating: true,
      });
      navigation.goBack();
      },
      onError: (error, variables, context) =>{
      showMessage({
        message: `${error}`,
        type: "warning",
        statusBarHeight: 2,
        duration: 3500,
        floating: true,
      });
      navigation.goBack();
      }
  })
  
    const takePhotoFromCamera = () =>{
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
          }).then(image => {
            // console.error(image);
            setProfilePic(image);
            setProfileImage('');
            bs.current.snapTo(1);
          });
    }
    let temp = ''
    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
          }).then(image => {
            
            setUserUploadedImage(image['path'])

            profileImageMutation.mutate(image , {
              onError: () =>{}
            }) // this shouls be called after user presses submit button
            bs.current.snapTo(1);
          });
    }
    
    const updateUser =  async () => {
      try {
        if(!isEqual(initialInfo, info)){
          // if there is a change from user
          payload["data"]["info"] = info
          payload["data"]["email"] = userData['data']['data']['email']
          payload["data"]["name"] = userData['data']['data']['name']
          profileMutation.mutate(payload["data"]["info"]) 
        }
  
      } catch (error) {
        console.error(error)
      }
        setIsLoading(false);

        navigation.goBack();

    }
    const renderInner = () => (
       <View style={styles.panel}>
           <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>

            <TouchableOpacity style={styles.commandButton} onPress={takePhotoFromCamera} >
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.commandButton} onPress={choosePhotoFromLibrary} >
                <Text style={styles.panelButtonTitle}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton} onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
       </View>
    )
       
    const renderHeader = () =>(
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    )
    return (
        <>
        <FlashMessage position="top" />
        {console.error(profileImageMutation)}
        {profileImageMutation.isLoading && Object.keys(profileImageMutation.variables).length !== 0 && <Text>Updating Profile Image...</Text>}
        {profileImageMutation.isError && <Text>There was an error uploading profile image</Text>}
         { (userData.isLoading ) && <Text>Loading...</Text>}
         {userData.isFetched && userData.isSuccess &&  (<View style={styles.container}>
            <BottomSheet
                ref={bs}
                snapPoints={[330, 0]}
                initialSnap={1}
                renderContent={renderInner}
                renderHeader={renderHeader}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />

            <Animated.View style={{margin: 20,  opacity: Animated.add(0.1, Animated.multiply(fall, 1.0))}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=> bs.current.snapTo(0)}>
                        <View style= {{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                          {/* {console.error(temp)} */}
                            <ImageBackground 
                                // source= { require("../../src/components/UI/stock.jpg")}
                                source={{
                                    uri:  profileImage.isSuccess ? profileImage.data : userUploadedImage // uncomment once image upload service is running
                                  }}
                                style={{height: 100, width: 100}}
                                imageStyle={{borderRadius: 15}}
                            >
                              {/* {console.error(userUploadedImage)} */}
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Icon
                                    name="camera"
                                    size={35}
                                    color="#fff"
                                    style={{
                                    opacity: 0.7,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    borderRadius: 10,
                                    }}
                                />
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                     <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>{name}</Text>               
                </View>
                <View style={styles.action}>
                    {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
                    <Text style={{color:"#777777", marginLeft: 3}}>Height</Text>
                    
                    <TextInput
                        placeholder={userData['data']['data']['info']['height']}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        keyboardType="number-pad"
                        onChangeText={ (t) => {
                          if(t === ''){
                            setInfo( (prev) => ({
                              ...prev,
                              height: initialInfo['height']
                            }))
                          } else {
                            setInfo( (prev) => ({
                              ...prev,
                              height: t
                            }))
                          }
                       }
                      }
                        // value={height}
                    />
                </View>

                <View style={styles.action}>
                    {/* <FontAwesome name="weight" color={colors.text} size={20} /> */}
                    <Text style={{color:"#777777", marginLeft: 3}}>Weight</Text>
                    
                    <TextInput
                        placeholder={userData['data']['data']['info']['weight']}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        keyboardType="number-pad"
                        // onChangeText={t => setInfo( (prev) => ({
                        //   ...prev,
                        //   weight: t
                        // }) )}

                        onChangeText={ (t) => {
                          if(t === ''){
                            setInfo( (prev) => ({
                              ...prev,
                              weight: initialInfo['weight']
                            }))
                          } else {
                            setInfo( (prev) => ({
                              ...prev,
                              weight: t
                            }))
                          }
                       }
                      }
                        // value={weight}
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name="address-book-o" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 7}}>Address</Text>

                    <TextInput
                        placeholder={userData['data']['data']['info']['address']}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={ (t) => {
                          if(t === ''){
                            setInfo( (prev) => ({
                              ...prev,
                              address: initialInfo['address']
                            }))
                          } else {
                            setInfo( (prev) => ({
                              ...prev,
                              address: t
                            }))
                          }
                       }
                      }
                        // value={address}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="globe" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 7}}>Country</Text>

                    <TextInput
                        placeholder={userData['data']['data']['info']['country']}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={ (t) => {
                          if(t === ''){
                            setInfo( (prev) => ({
                              ...prev,
                              country: initialInfo['country']
                            }))
                          } else {
                            setInfo( (prev) => ({
                              ...prev,
                              country: t
                            }))
                          }
                       }
                      }
                        // value={country}
                    />
                </View>   
                <View style={styles.action}>
                    <FontAwesome name="map-marker" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 13}}>City</Text>

                    <TextInput
                        placeholder={userData['data']['data']['info']['city']}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={ (t) => {
                          if(t === ''){
                            setInfo( (prev) => ({
                              ...prev,
                              city: initialInfo['city']
                            }))
                          } else {
                            setInfo( (prev) => ({
                              ...prev,
                              city: t
                            }))
                          }
                       }
                      }
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name="location-arrow" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 9}}>Zipcode</Text>

                    <TextInput
                        placeholder={userData['data']['data']['info']['zipcode']}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={ (t) => {
                          if(t === ''){
                            setInfo( (prev) => ({
                              ...prev,
                              zipcode: initialInfo['zipcode']
                            }))
                          } else {
                            setInfo( (prev) => ({
                              ...prev,
                              zipcode: t
                            }))
                          }
                       }
                      }
                        
                    />
                </View>
                <TouchableOpacity style={[ isEqual(info,initialInfo) ? styles.commandButtonDisabled : styles.commandButton]} onPress={updateUser} disabled={isEqual(info,initialInfo)}>
                    <Text style={styles.panelButtonTitle}>Save</Text>
                </TouchableOpacity>
            </Animated.View>
            </View> ) }
        </>
        
    )
}


export default EditProfileScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    commandButton: {
      padding: 12,
      borderRadius: 15,
      backgroundColor: '#0d58d1',
      alignItems: 'center',
      marginTop: 12,
    },
    commandButtonDisabled: {
      padding: 12,
      borderRadius: 15,
      backgroundColor: '#cccccc',
      alignItems: 'center',
      marginTop: 12,
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
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      // elevation: 5,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
    },
  });

  