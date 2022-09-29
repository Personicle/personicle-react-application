import {View,Button, Alert, Text, StyleSheet} from 'react-native';
import {launchCameraAsync, useCameraPermissions, PermissionStatus ,launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import {useState} from 'react';
import * as Permissions from 'expo-permissions';
function ImagePicker(){
    const [cameraPermissionInfo, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState(null);
    async function verifyPermissions(){
        if(cameraPermissionInfo.status === PermissionStatus.UNDETERMINED ){
           const persmissionRes = await requestPermission();
           return persmissionRes.granted;
        }
        if(cameraPermissionInfo.status === PermissionStatus.DENIED){
            Alert.alert("Insufficient Permissions", "You need to grant camera permission to submit photos");
            return false;
        }
        return true;
    }
    async function takeImageHandler(){
        const hasPermission = await verifyPermissions();
        if(!hasPermission) return; 

        const image =  await launchCameraAsync({
            allowsEditing: true,
            aspect: [16,9],
            quality: 0.5,
        });
        console.error(image);
    }

    const pickImageHandler = async () => {
        // const {status_roll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
       const res = await requestMediaLibraryPermissionsAsync();
       if(res.status === PermissionStatus.DENIED) return
       console.error(res)
        const result = await launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.error(result);

        if (!result.cancelled) {
          setImage(result.uri);
        }
      };
    return (
        <View>
            { 
                <>
                <Button title="Take Image" onPress={takeImageHandler} /> 
                 <Text style={styles.text}> OR </Text>
                <Button title="Choose from Library" onPress={pickImageHandler} /> 
                 </>
            }
           
        </View>
    )
}
const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
    }
  });
export default ImagePicker;