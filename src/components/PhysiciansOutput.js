
import {View, StyleSheet} from 'react-native';
import PhysiciansQuestions from './PhysiciansQuestions'
import PhysiciansList from './PhysiciansList';


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