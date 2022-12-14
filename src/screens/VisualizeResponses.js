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
import { phyResponses } from "../utils/physician";

function VisualizeResponses() {
  const [responses, setResponses] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [physicianIds, setPhysicianIds] = useState([]);
  const [hf, setHardRefresh] = useState(false);

  const r = phyResponses();
  async function getPhysicianResponses(hardRefresh) {
    // const response =
    let response;
    var hardRefresh = hardRefresh || false;
    if (!hardRefresh) {
      response = r["data"];
    } else {
      response = await getDatastreams(
        (datatype =
          "com.personicle.individual.datastreams.subjective.physician_questionnaire")
      );
    }
    console.error(r);
    console.error(response);

    var result = response.data.reduce(function (r, a) {
      r[a.source.split(":")[1]] = r[a.source.split(":")[1]] || [];
      r[a.source.split(":")[1]].push(a);
      return r;
    }, Object.create(null));
    console.error(result);

    let arr = [];
    for (const [key, value] of Object.entries(result)) {
      let temp = {
        phy_id: key,
      };
      arr.push(temp);
    }
    setPhysicianIds(arr);

    setResponses(result);
    // console.error("grouped by phys")
    setIsLoading(false);
  }
  useEffect(() => {
    r.isFetched && getPhysicianResponses();
  }, [r.isFetched && !r.isRefetching]);

  const refreshData = async () => {
    setHardRefresh(true);
    await getPhysicianResponses(true);
  };
  function renderPhysicians(itemData) {
    return (
      <Physician
        hardRefresh={hf}
        visualization={true}
        responses={responses}
        {...itemData.item}
      />
    );
  }
  const getFooter = () => {
    return <Text> </Text>;
  };
  return (
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
