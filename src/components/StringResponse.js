import {Text,View, SafeAreaView, TextInput, StyleSheet} from 'react-native';
import {useState} from 'react';

function StringResponse({question}){
    const [text, onChangeText] = useState(null);
    return(
        <View style={styles.container}>
            <Text>{question}</Text>
                    <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="Enter description"
                keyboardType="default"
            />
        </View>
    )
}
const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    container: {
        padding: 24,
        alignItems: 'center',
        paddingTop: 10,
        flex: 1
    }
  });


export default StringResponse;