import {Text,View, SafeAreaView, FlatList, StyleSheet} from 'react-native';
import ImagePicker from './ImagePicker';

function ImageResponse({question}){
    return(
        <View style={styles.container}>
            <Text>{question}</Text>
            <ImagePicker/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',

        flex: 1
    }
  });
export default ImageResponse;