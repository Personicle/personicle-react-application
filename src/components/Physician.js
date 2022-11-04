import {Pressable, View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native'
import { getPhyQuestions, getPhyName } from '../../api/http';
import {PhysiciansQuestion} from '../navigationStacks'
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../RootNavigation";
import {navigate} from "../RootNavigation"
import {useEffect, useState } from "react";


function Physician({phy_id,visualization,responses,physician_user_id, questions, physician: {name} = {}} ) {

    const [phyName, setPhyName] = useState("")
    const [isLoading, setLoading] = useState(true)
    
    useEffect(() => {
        if(!visualization){
            setLoading(false);
        } else{
            async function getName(){
                const name = await getPhyName(phy_id);
                setPhyName(name['data'][0]['name'])
                setLoading(false);
            }
    
            getName();
        }
       

    }, [])
  
    function  physicianPressHandler(){
        if(!visualization)
            navigate("Questionnaire", {physician_id: physician_user_id, phyName: name, questions: questions['questions']});
        else
            navigate("Responses Visualization", {physician_id: phy_id, phyName: phyName, responses: responses[phy_id]});

    }   
    return (
        <SafeAreaView>
            {isLoading ? <Text>{'Loading...'}</Text> :  
             (visualization == true ) ?  <Pressable onPress={physicianPressHandler} style={({pressed}) => pressed && styles.pressed}>
                <View style={styles.phy}>
                    <View >
                        <Text styles={[styles.text]}>{phyName}</Text>
                    </View>
                </View>
            </Pressable> : <Pressable onPress={physicianPressHandler} style={({pressed}) => pressed && styles.pressed}>
                <View style={styles.phy}>
                    <View >
                        <Text styles={[styles.text]}>{name}</Text>
                    </View>
                </View>
            </Pressable>}
           
            
        </SafeAreaView>
        
        )
}
export default Physician;
const styles = StyleSheet.create({
    phy:{
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#e4e6eb',
        borderRadius: 6,
        elevation: 3,
        shadowColor: '#BDC3C7',
        shadowRadius: 4,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        
    },
    text: {
        alignItems: 'center'
    },
    pressed: {
        opacity: 0.75
    }

})