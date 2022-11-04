import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheet from 'reanimated-bottom-sheet';
import {useTheme} from 'react-native-paper';
import Animated, { set } from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import {updateUserInfo, getUserInfo} from "../../api/http";


function EditProfileScreen ({navigation}){
    const {colors} = useTheme();
    const [profilePic, setProfilePic] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [address, setAddress] = useState('');
    const [zipcode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [submitted, formSubmitted] = useState(false);
    bs = React.createRef();
    fall = new Animated.Value(1);

  useEffect( () => {
    async function getUser(){
        const res = await getUserInfo();
        if(res != undefined){
           setWeight(res['data']['info']['weight'])
           setAddress(res['data']['info']['address'])
           setHeight(res['data']['info']['height'])
           setCountry(res['data']['info']['country'])
           setCity(res['data']['info']['city'])
           setPostalCode(res['data']['info']['zipcode'])
           setIsLoading(false);
        }
    }
    getUser();
  },[])

    const takePhotoFromCamera = () =>{
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
          }).then(image => {
            console.error(image);
            set(image.path);
            bs.current.snapTo(1);
          });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
          }).then(image => {
            console.error(image);
            setProfilePic(image.path);
            bs.current.snapTo(1);
          });
    }
    const updateUser =  async () => {
        console.error(weight)
        console.error(height)
        let  payload = {}
        if(height.length != 0 ) payload["height"] = height
        if(weight.length != 0 )payload["weight"] = weight
        if(address.length != 0 ) payload["address"] = address
        if(city.length != 0 ) payload["city"] = city
        if(country.length != 0 ) payload["country"] = country
        if(zipcode.length != 0 ) payload["zipcode"] = zipcode

        const res =  await updateUserInfo(payload);
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
         {isLoading ? <Text> {'Loading...'}</Text> : <View style={styles.container}>
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
                            <ImageBackground 
                                // source= { require("../../src/components/UI/stock.jpg")}
                                source={{
                                    uri: profilePic,
                                  }}
                                style={{height: 100, width: 100}}
                                imageStyle={{borderRadius: 15}}
                            >
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
                     <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>Tirth P</Text>               
                </View>
                <View style={styles.action}>
                    {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
                    <Text style={{color:"#777777", marginLeft: 3}}>Height</Text>
                    
                    <TextInput
                        placeholder="Enter Height"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        keyboardType="number-pad"
                        onChangeText={t => setHeight(t)}
                        value={height}
                    />
                </View>

                <View style={styles.action}>
                    {/* <FontAwesome name="weight" color={colors.text} size={20} /> */}
                    <Text style={{color:"#777777", marginLeft: 3}}>Weight</Text>
                    
                    <TextInput
                        placeholder="Enter Weight"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        keyboardType="number-pad"
                        onChangeText={t => setWeight(t)}
                        value={weight}
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name="address-book-o" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 7}}>Address</Text>

                    <TextInput
                        placeholder="Address"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={t => setAddress(t)}
                        value={address}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="globe" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 7}}>Country</Text>

                    <TextInput
                        placeholder="Country"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={t => setCountry(t)}
                        value={country}
                    />
                </View>   
                <View style={styles.action}>
                    <FontAwesome name="map-marker" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 13}}>City</Text>

                    <TextInput
                        placeholder="City"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={t => setCity(t)}
                        value={city}
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name="location-arrow" color={colors.text} size={20} />
                    <Text style={{color:"#777777", marginLeft: 9}}>Zipcode</Text>

                    <TextInput
                        placeholder="Postal code"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                        styles.textInput,
                        {
                            color: colors.text,
                        },
                        ]}
                        onChangeText={t => setPostalCode(t)}
                        value={zipcode}
                    />
                </View>
                <TouchableOpacity style={styles.commandButton} onPress={updateUser}>
                    <Text style={styles.panelButtonTitle}>Save</Text>
                </TouchableOpacity>
            </Animated.View>
        </View> }
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

  