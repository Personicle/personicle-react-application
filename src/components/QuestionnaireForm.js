import { View,SafeAreaView, Button,FlatList, StyleSheet} from "react-native";
import RenderQuestions from "./RenderQuestions";



function renderQuestions(itemData ,onCancel,onSubmit){

    return <RenderQuestions  onSubmit={onSubmit} onCancel={onCancel} {...itemData.item}/>
  }
function QuestionnaireForm({questions, onCancel,onSubmit}){

    return (
        <SafeAreaView style={styles.container}>
            {/* {console.error(questions)} */}
             <FlatList data={questions}
             renderItem={item => renderQuestions(item, onCancel,onSubmit)} />

                    
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      // backgroundColor: GlobalStyles.colors.primary800,
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
export default QuestionnaireForm;