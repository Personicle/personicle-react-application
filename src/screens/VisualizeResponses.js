import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getDatastreams } from "../../api/http";
import UsersPhysicians from "../components/UsersPhysicians";
import { SplashStack } from "../navigationStacks";
import Physician from "../components/Physician";
import { phyResponses, userImageResponses } from "../utils/physician";
import { useMutation, useQueryClient } from "react-query";

function VisualizeResponses() {
  const [responses, setResponses] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [physicianIds, setPhysicianIds] = useState([]);
  const [imageResponses, setImageResponsesForPhy] = useState([]);
  const [hf, setHardRefresh] = useState(false);

  const r = phyResponses();

  const queryClient = useQueryClient();

  //   const phyResponsesMutation = useMutation( {
  //     onSuccess: () => {
  //     // console.error("on success mutation")
  //     // console.error(updatedData)

  //     queryClient.setQueryData(['physician-responses'], (prev) => ( getDatastreams(datatype="com.personicle.individual.datastreams.subjective.physician_questionnaire") ))
  //     }
  // })

  async function getPhysicianResponses(hardRefresh) {
    // const response =
    let response;
    var hardRefresh = hardRefresh || false;
    if (!hardRefresh) {
      response = r["data"];
    } else {
     response =  await getDatastreams(datatype="com.personicle.individual.datastreams.subjective.physician_questionnaire");
    }
    // console.error("hardRefresh")
    // console.error(hardRefresh)
    // console.error(r);
    // console.error(response);

    var result = response.data.reduce(function (re, a) {
      re[a.source.split(":")[1]] = re[a.source.split(":")[1]] || [];
      re[a.source.split(":")[1]].push(a);
      return re;
    }, Object.create(null));
    // console.error(result);

    let arr = [];
    for (const [key, value] of Object.entries(result)) {
      let temp = {
        phy_id: key,
      };
      arr.push(temp);
    }
    setPhysicianIds(arr);

    setResponses(result);
    // console.error("grouped by phys  ")
    // console.error(result);
    // let imageResponsesForPhy = []
    let t = {}; // phyId-questionId: [imageres1, imageres2]
    let t2 = {}; // phyId-questionId: [imageres1, imageres2]

    try {
      for (var phyId of Object.keys(result)) {
        for(var responses of result[phyId]){
          for(var userRes of responses['value']){
            if(userRes['response_type'] == 'image'){

              // temp.push([userRes,userRes['question_id']])
              // imageResponsesForPhy.push([phyId,userRes['question_id'], userRes['value']])
              if (t2[`${phyId}-${userRes["question_id"]}`] !== undefined) {
                // t[`${phyId}-${userRes["question_id"]}`].push(userRes["value"]);
                t2[`${phyId}-${userRes["question_id"]}`].push( [userRes["value"], responses['timestamp']]);

              } else {
                // t[`${phyId}-${userRes["question_id"]}`] = [userRes["value"]];
                t2[`${phyId}-${userRes["question_id"]}`] = [ [userRes["value"], responses['timestamp']]];
              }
            }    
          }
        }
        // if(temp.length > 0) imageResponsesForPhy[phyId] = temp // push only if image reponses exists for this physician
      }

      setImageResponsesForPhy([t2]);

      // console.error([t])
      console.error("t2")
      console.error([t2])

    } catch (error) {
      // console.error(error);
    }

    // console.error("grouped by phy images");

    setIsLoading(false);
  }
  useEffect(() => {
    r.isFetched && getPhysicianResponses();
  }, [r.isFetched && !r.isRefetching]);

  const refreshData = async () => {
    setHardRefresh(true);
    setIsLoading(true);

    await getPhysicianResponses(true);
    setIsLoading(false);
  };
  function renderPhysicians(itemData) {
    console.error("image responses")
    console.error(imageResponses)
    return (
      <Physician
        hardRefresh={hf}
        visualization={true}
        imageResponses={imageResponses}
        responses={responses}
        {...itemData.item}
      />
    );
  }
  const getFooter = () => {
    return <Text> </Text>;
  };
  return (
    <>
      {/* {(isloading || r.isFetching || r.isLoading) && <Text>Syncing..</Text>} */}
      <FlatList
        style={styles.container}
        data={physicianIds}
        renderItem={renderPhysicians}
        keyExtractor={(item) => item.physician_id}
        ListHeaderComponent={<></>}
        refreshControl={
          <RefreshControl refreshing={isloading} onRefresh={refreshData} />
        }
        ListFooterComponent={getFooter}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    // alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
});
export default VisualizeResponses;
