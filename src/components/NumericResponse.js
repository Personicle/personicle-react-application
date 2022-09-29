import {Text,View, SafeAreaView, TextInput, StyleSheet} from 'react-native';
import {useState} from 'react';

function NumericResponse({question}){
    const [number, onChangeNumber] = useState(null);
    return(
        <View style={styles.container}>
            <Text>{question}</Text>
                    <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Enter a numeric value"
                keyboardType="numeric"
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


export default NumericResponse;