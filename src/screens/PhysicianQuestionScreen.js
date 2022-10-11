import { SafeAreaView, StyleSheet, Text, View, ScrollView,RefreshControl,} from "react-native";
import React from "react";
import PhysiciansOutput from "../components/PhysiciansOutput";
import {  useState, useEffect } from "react";
import { getPhyQuestions } from "../../api/http";
import {SplashStack } from "../navigationStacks";


const PhysicianQuestionScreen = () => {
  const [physicians, setPhysicians] = useState([]);
  const[isloading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPhysicians(){
     const phys =  await getPhyQuestions();
     const filteredPhysiciansWithQuestions = phys['data']['physician_users'].filter(obj => Object.keys(obj.questions).length != 0)
     setPhysicians(filteredPhysiciansWithQuestions)
     setIsLoading(false)

    }
    getPhysicians();
  }, [])
  const refreshData = async () => {
    const phys =  await getPhyQuestions();
    const filteredPhysiciansWithQuestions = phys['data']['physician_users'].filter(obj => Object.keys(obj.questions).length != 0)
     setPhysicians(filteredPhysiciansWithQuestions)
     setIsLoading(false)
  }
    return (
      < ScrollView refreshControl={
        <RefreshControl refreshing={isloading} onRefresh={refreshData} />
      }>
        <PhysiciansOutput physicians={physicians} /> 
      {/* <ScrollView>
       { isloading ?  (<SplashStack/> ) :  <PhysiciansOutput physicians={physicians} />  }
       </ScrollView> */}
     </ ScrollView>
    
      // (physicians == undefined ||  Object.keys(physicians).length === 0) ? <Splas
    );
  };

export default PhysicianQuestionScreen;

const styles = StyleSheet.create({});
