import {Text,Alert,View, SafeAreaView, TextInput, StyleSheet} from 'react-native';
import {useState,useContext} from 'react';
import ImagePicker from './ImagePicker';
import SelectPicker from 'react-native-form-select-picker';
import { PhysiciansContext } from '../context/physicians-context';
import Button from './UI/Button';
import moment from "moment";

 
function RenderQuestions({question, options, tag,response_type,onCancel,onSubmit}){
   const PhysicianCtx = useContext(PhysiciansContext);

    const [number, onChangeNumber] = useState(null);
    const [selected, setSelected] = useState();
    const [text, onChangeText] = useState(null);
    const [responses, setResponses] = useState({
        test: '',
        res: {}
    });
    // setResource(prevState => ({
    //     ...prevState,
    //     comment: "new Value",
    // }))

    function inputChangedHandler(inputIdentifier, enteredValue) {
        console.error(inputIdentifier)
        console.error(enteredValue)
            // setResponses(prevState => ({
            //    ...prevState,
            //    [inputIdentifier]: enteredValue,
            // }))
            setResponses((curInputs) => {
                return {
                  ...curInputs,
                  res: responses.res[inputIdentifier] = enteredValue
                //   [inputIdentifier]: enteredValue
                };
              });
      }

    function submitResponses(){
        // if(true){
        //     Alert.alert('Some error')
        //     return;
        // }
        console.error(responses.test)
        onSubmit(
            {   "streamName": "com.personicle.individual.datastreams.subjective.physician_questionnaire", "test": responses.res,
            "source": "Personicle:#{key}", "unit": "", "confidence": 100, "dataPoints":[{ "timestamp": moment(), "value": [] } ] }
        )
         
    }
    return(
        <View style={styles.container}>
          {/* {console.error(question)} */}
            <Text>{question}</Text>
            {response_type == 'numeric' ?  <TextInput
                style={styles.input}
               
                  onChangeText= {inputChangedHandler.bind(this, tag)}
                //    value = {responses.test}
                   placeholder = "Enter a numeric value"
                   keyboardType = "numeric"
              
                     /> : (response_type == 'string') ? <TextInput
                     style={styles.input}
                     onChangeText={inputChangedHandler.bind(this, tag)}
                     placeholder="Enter string response"
                     keyboardType="default"
                          /> : (response_type == 'image' ) ? <ImagePicker/> :  (response_type == 'survey') ? <SelectPicker
                          onValueChange={(value) => {
                              setSelected(value);
                          }}
                          selected={selected}
                          placeholder="--Select-- "
                          >
                          
                          {Object.values(options).map((val, index) => (
                              <SelectPicker.Item label={val} value={val} key={index} />
                          ))}
      
                  </SelectPicker> : ''}
                        <View style={styles.buttons}>
                        <Button mode="flat" onPress={onCancel} style={styles.button} >Cancel</Button>
                        <Button  onPress={submitResponses} style={styles.button} >Submit</Button>

                </View> 
        </View>
        // <View>
        //     <Text>{question}</Text>
        //     {response_type == 'numeric' ?  (<TextInput
        //         style={styles.input}
        //         // onChangeText={inputChangedHandler(this, 'description')}
        //         value={number}
        //         placeholder="Enter a numeric value"
        //         keyboardType="numeric"
        //     /> ): null }
        // </View>
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
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        minWidth: 120,
        marginHorizontal: 8,
      },
    
  });


export default RenderQuestions;