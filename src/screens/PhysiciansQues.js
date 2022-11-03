import {Text,TextInput,View, SafeAreaView, FlatList, StyleSheet} from 'react-native';
import {useState,useLayoutEffect, useContext} from 'react';
import RenderQuestions from '../components/RenderQuestions';
import Button from '../components/UI/Button';
import {GlobalStyles} from "../../constants/styles"
import moment from "moment";
import QuestionnaireForm from '../components/QuestionnaireForm';
import { PhysiciansContext } from '../context/physicians-context';
import SelectPicker from 'react-native-form-select-picker';
import ImagePicker from '../components/ImagePicker'
import { getUserId } from '../../api/interceptors';
import { sendPhysicianResponses } from '../../api/http';
import { ScrollView } from 'react-native-gesture-handler';


function PhysiciansQues({route, navigation}){
  const PhysicianCtx = useContext(PhysiciansContext);
  const [selected, setSelected] = useState();
  const [responses, setResponses] = useState({
      test: '',
      res: {},
  });
  const phyName = route.params?.phyName;
  const questions = route.params?.questions;
  const physicianId = route.params?.physician_id;

  useLayoutEffect(()=> {
    navigation.setOptions({
      title: `Questionnaire by ${phyName}`
    })
  }, [navigation]);
  

  function cancelHandler(){
    navigation.goBack();
  }
  
  async function  confirmHandler(){
   let data_packet = []
   for (let key of Object.keys(responses.res)) {
    console.error(key + " -> " + responses.res[key])
    data_packet.push({
      'question_id': key,
      'value': responses.res[key]
    })
   }
   const uid = await getUserId()
   const finalDataPacket = {"streamName": "com.personicle.individual.datastreams.subjective.physician_questionnaire", "individual_id": uid,
   "source": `Personicle:${physicianId}`, "unit": "", "confidence": 100, "dataPoints":[{ "timestamp": moment().format("YYYY-MM-DD HH:mm:ss"), "value": data_packet }]}
    // PhysicianCtx.submitResponses( );

    sendPhysicianResponses(finalDataPacket)
    navigation.goBack();
  }
  function renderQuestions(itemData ,onCancel,onSubmit){

    return <RenderQuestions  onSubmit={confirmHandler} onCancel={cancelHandler} {...itemData.item}/>
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    console.error("here")
    console.error(inputIdentifier)
    console.error(enteredValue)
          setResponses(prevState => ({
            res:{
              ...prevState.res,
              [inputIdentifier]: enteredValue
            }
          }));
  }

  function Question({question}){
    if(question['response_type'] == 'numeric') {
      return ( 
        <>
          <Text style={styles.question} >{question['question']}</Text>
        
          <TextInput style={styles.input} 
          onChangeText={inputChangedHandler.bind(this, question['tag'])}
          // onChangeText={text => setResponses}

          placeholder = "Enter a numeric value" 
          value = {responses.res[question['tag']]}
          keyboardType = "numeric" />
        </>
      )
    } else if(question['response_type'] == 'string') {
      return (
        <>
        <Text style={styles.question} >{question['question']}</Text>
        <TextInput  style={styles.input} 
         onChangeText={inputChangedHandler.bind(this, question['tag'])}  
         placeholder="Enter string response" 
         value = {responses.res[question['tag']]}
         keyboardType="default"/>
       </>
      )
    
    } else if(question['response_type'] == 'image') {
      return (
        <>
        <Text style={styles.question} >{question['question']}</Text>
        <ImagePicker/> 
       </>
      )
    } else if(question['response_type'] == 'survey') {
      return (
        <>
        <Text style={styles.question} >{question['question']}</Text>
        <SelectPicker  onValueChange={(value) => { inputChangedHandler.bind(value, question['tag']) 
        setSelected(value)}} selected={selected}placeholder="--Select-- ">
                  {Object.values(question['options']).map((val, index) => (
                  <SelectPicker.Item label={val} value={val} key={index} />
                  ))}
        </SelectPicker> 
       </>
      )
    } 
    
  }
  

    return (
       
      // <SafeAreaView style={styles.container} >
      //   {/* <QuestionnaireForm questions={questions} onCancel={cancelHandler} onSubmit={confirmHandler} /> */}
      //   <FlatList
      //     data={questions}
      //     renderItem={renderQuestions}
      //   />

   <ScrollView style={styles.container} >
     {questions.map((ques,i)=>{
       return (
        <>
          <Question  question={ques}/>
          
      
         </>
       )
  
    })}
    <View style={styles.buttons}>

    <Button mode="flat" onPress={cancelHandler} style={styles.button} >Cancel</Button>
          <Button  onPress={confirmHandler} style={styles.button} >Submit</Button>
    </View>
    
    </ScrollView>
     
      );
}
const styles = StyleSheet.create({
  container: {
       padding: 24,
        // alignItems: 'center',
        paddingTop: 10,
        flex: 1
  },
  input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  text: {
    fontSize: 14,
    color: '#2f354b',
    textAlign: 'center'
  },
  question: {
    padding: 20,
    fontSize: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
export default PhysiciansQues;