import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React from "react";
import PhysiciansOutput from "../components/PhysiciansOutput";
import { useState, useEffect } from "react";
import { getPhyQuestions } from "../../api/http";
import { SplashStack } from "../navigationStacks";
import { physicianQuestions } from "../utils/physician";

const PhysicianQuestionScreen = () => {
  const [physicians, setPhysicians] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [manualRefresh, setManualRefresh] = useState(false);
  const phys = physicianQuestions();

  // if(phys.isSuccess && phys.isFetched) {
  //   setPhys();
  // }
  // const filteredPhysiciansWithQuestions = phys['data']['data']['physician_users'].filter(obj => Object.keys(obj.questions).length != 0)
  // setPhysicians(filteredPhysiciansWithQuestions)
  //     setIsLoading(false)
  // useEffect(() => {
  //   async function getPhysicians(){
  //   //  const phys =  await getPhyQuestions();
  //   try {
  //     if(phys.isFetched){
  //     const filteredPhysiciansWithQuestions = phys['data']['data']['physician_users'].filter(obj => Object.keys(obj.questions).length != 0)
  //     setPhysicians(filteredPhysiciansWithQuestions)
  //     setIsLoading(false)
  //     }

  //   } catch (error) {
  //     console.error(error)
  //   }

  //   }
  //   // getPhysicians();
  // }, [])
  const refreshData = async () => {
    setIsLoading(true);
    const physs = await getPhyQuestions();
    const filteredPhysiciansWithQuestions = physs["data"][
      "physician_users"
    ].filter((obj) => Object.keys(obj.questions).length != 0);
    setPhysicians(filteredPhysiciansWithQuestions);
    setManualRefresh(true);
    setIsLoading(false);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isloading} onRefresh={refreshData} />
      }
    >
      {(phys.isLoading || phys.isFetching) && (
        <Text>Fetching Physicians..</Text>
      )}
      {phys.isFetched && !manualRefresh && (
        <PhysiciansOutput
          physicians={phys["data"]["data"]["physician_users"].filter(
            (obj) => Object.keys(obj.questions).length != 0
          )}
        />
      )}
      {manualRefresh && <PhysiciansOutput physicians={physicians} />}
      {/* <ScrollView>
       { isloading ?  (<SplashStack/> ) :  <PhysiciansOutput physicians={physicians} />  }
       </ScrollView> */}
    </ScrollView>

    // (physicians == undefined ||  Object.keys(physicians).length === 0) ? <Splas
  );
};

export default PhysicianQuestionScreen;

const styles = StyleSheet.create({});
