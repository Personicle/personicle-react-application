import {Text,View, SafeAreaView, FlatList} from 'react-native';
import {useLayoutEffect} from 'react';
import NumericResponse from '../components/NumericResponse';
import ImageResponse from '../components/ImageResponse';
import SurveyResponse from '../components/SurveyResponse';
import StringResponse from '../components/StringResponse';

function renderQuestions(itemData){
  // console.error("hola")
  if(itemData.item.response_type == 'numeric'){
    return <NumericResponse  {...itemData.item}/>
  } else if (itemData.item.response_type == 'image'){
    return <ImageResponse  {...itemData.item}/>
  } else if (itemData.item.response_type == 'survey'){
    return <SurveyResponse  {...itemData.item}/>
  } else if (itemData.item.response_type == 'string'){
    return <StringResponse {...itemData.item} />
  }
}
function PhysiciansQues({route, navigation}){
  const phyName = route.params?.phyName;
  const questions = route.params?.questions;

  useLayoutEffect(()=> {
    navigation.setOptions({
      title: `Questionnaire by ${phyName}`
    })
  }, [navigation]);
  // console.error(questions)
    return (

      <SafeAreaView >
        <FlatList
          data={questions}
          renderItem={renderQuestions}
          // keyExtractor={item => item.physician_id}
        />
      </SafeAreaView>
        // <View>
        //   <Text>Questionnaire by {phyName}</Text>
        // </View>
      );
}

export default PhysiciansQues;