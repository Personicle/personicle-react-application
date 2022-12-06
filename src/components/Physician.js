import {Pressable, View, Text, StyleSheet, SafeAreaView, RefreshControl, ScrollView} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native'
import { getPhyQuestions, getPhyName } from '../../api/http';
import {PhysiciansQuestion} from '../navigationStacks'
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../RootNavigation";
import {navigate} from "../RootNavigation"
import {useEffect, useState } from "react";
import { FlatList } from 'react-native-gesture-handler';
import { getPhyNameFromId } from "../utils/physician"


function Physician({phy_id,visualization,responses,physician_user_id, questions, physician: {name} = {}} ) {

    const [phyName, setPhyName] = useState("")
    const [phyRemoved, setPhyRemoved] = useState(false)
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true)
    const r = getPhyNameFromId(phy_id);
    // console.error(r)
    // to get physician
    async function getName(){
        // const res = await getPhyName(phy_id);
        const res = r['data']
        
        if(res.status == 404){
            setPhyRemoved(true); // requested phy does not exist for this user
        } else {
            setPhyRemoved(false); 
            setPhyName(res['data'][0]['name'])
        }
        setLoading(false);
      
    }
   // we are fetching physician questionnaire datastream for all physicians for a user.
   // So when a physician is removed, we still get that physician's responses when fetching physician_questionnaire datastream for a user
   // When we call the api to get the physician name, we correctly do not get the response back as this user has removed the physician.
   //Handling this case here

    useEffect(() => {
        if(!visualization){
            setLoading(false);
        } else{
            getName();
        }
    
    }, [isFocused && r.isFetched])
    const refreshData = async () => {
        console.error("hola")
        await getName();
      }
    function  physicianPressHandler(){
        if(!visualization)
            navigate("Questionnaire", {physician_id: physician_user_id, phyName: name, questions: questions['questions']});
        else
            navigate("Responses Visualization", {physician_id: phy_id, phyName: phyName, responses: responses[phy_id]});

    }   
    return (
        
         <SafeAreaView> 
            
            {isLoading && !phyRemoved ? <Text>{'Loading...'}</Text> : (phyRemoved ? null :  
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
            </Pressable>)}
           
            
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