import {View, Text, StyleSheet} from 'react-native';

function PhysiciansQuestions({physicians, physician_id}){
    return (
        <View style={styles.container}>
            <Text style={styles.phyname}>
                {/* {physician_id} */}
            </Text>
        </View>
    )
}
export default PhysiciansQuestions;

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 6,
        // flex: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    phyname: {
        fontSize: 12,
    }
})