
import { StyleSheet, Dimensions, Text, View, SafeAreaView, ScrollView, RefreshControl, FlatList} from "react-native";
import React from "react";
import {  useState, useEffect } from "react";
import { getDatastreams } from "../../api/http";
import UsersPhysicians from "../components/UsersPhysicians";
import { SplashStack } from "../navigationStacks";
import Physician from "../components/Physician";



function VisualizeResponses(){
  const [responses, setResponses] = useState([]);
  const[isloading, setIsLoading] = useState(true);
  const [physicianIds, setPhysicianIds] = useState([]);
  async function getPhysicianResponses(){
    const response =  await getDatastreams(datatype="com.personicle.individual.datastreams.subjective.physician_questionnaire");

    var result = response.data.reduce(function (r, a) {
        r[a.source.split(":")[1]] = r[a.source.split(":")[1]] || [];
        r[a.source.split(":")[1]].push(a);
        return r;
    }, Object.create(null));
    console.error("here")
    console.error(result);
  
    let arr = []
    for (const [key, value] of Object.entries(result)) {
     let temp = {
        "phy_id" : key
      }

      arr.push(temp);
    }
 

    
    setPhysicianIds(arr)

    setResponses(result)
    console.error("grouped by phys")
    console.error(result)
    setIsLoading(false)
   }
  useEffect(()=>{
    
     getPhysicianResponses();
  }, [])

  const refreshData = async () => {
    await getPhysicianResponses();
  }
  function renderPhysicians(itemData){
    // console.error("hola")
    // console.error(itemData.item)
      return <Physician  visualization={true} responses={responses} {...itemData.item}/>
  }
  
    return (
        <ScrollView style={styles.container} refreshControl={
          <RefreshControl refreshing={isloading} onRefresh={refreshData} />
        }>
           

       <FlatList
          data={physicianIds}
          renderItem={renderPhysicians}
          keyExtractor={item => item.physician_id}
        />
        </ScrollView>
      );
}

const styles = StyleSheet.create({
  container: {
      padding: 24,
      // alignItems: 'center',
      paddingTop: 10,
      flex: 1
  }
})
export default VisualizeResponses;
