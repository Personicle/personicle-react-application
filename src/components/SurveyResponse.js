import {Text,View, FlatList, StyleSheet} from 'react-native';
import {useState} from 'react';
import SelectPicker from 'react-native-form-select-picker';
function SurveyResponse({question,options}){
    const [selected, setSelected] = useState();
    return(
        <View style={styles.container}>
            <Text>{question}</Text>
                <SelectPicker
                    onValueChange={(value) => {
                        // Do anything you want with the value. 
                        // For example, save in state.
                        setSelected(value);
                    }}
                    selected={selected}
                    placeholder="--Select-- "
                    >
                    
                    {Object.values(options).map((val, index) => (
                        <SelectPicker.Item label={val} value={val} key={index} />
                    ))}

            </SelectPicker>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        paddingTop: 10,
        flex: 1
    }
})
export default SurveyResponse;