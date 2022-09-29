
import {View, StyleSheet} from 'react-native';
import PhysiciansQuestions from './PhysiciansQuestions'
import PhysiciansList from './PhysiciansList';


const DUMMY_PHYSICIANS = [
    {
        physician_id: 1,
        name: 'doctor who',
        questions: [{
            question: "What is your daily blood pressure?",
            tag :"blood-pressure",
            options: ["\u003c120","120-129","130-140","\u003e140"]
        }]
    },
    {
        physician_id: 2,
        name: 'doctor strange',
        questions: [{
            question: "What is your daily blood pressure?",
            tag :"blood-pressure",
            options: ["\u003c120","120-129","130-140","\u003e140"]
        }]
    }

]
function PhysiciansOutput({physicians, physician_id}){
    return (
        <View style={styles.container}>
            {/* <PhysiciansQuestions physicians={DUMMY_PHYSICIANS} physician_id={physician_id}/> */}
            <PhysiciansList physicians={physicians}/>
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
export default PhysiciansOutput;