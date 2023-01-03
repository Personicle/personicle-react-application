import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import SelectPicker from "react-native-form-select-picker";
import LineChartComponent from "../components/LineChartComponent";
import PieChart from "../components/PieChart";
import ImageComponent from "../components/ImageComponent";
import { userImageResponses } from "../utils/physician";

function AllResponses({ route, navigation }) {
  const responses = route.params?.responses;
  const physicianId = route.params?.physician_id;
  const name = route.params?.phyName;
  const imageResponses = route.params?.imageResponses;

  const [selected, setSelected] = useState("");
  const [renderChart, setRenderChart] = useState(true);
  var groupedByQuestionIdTag = responses.reduce(function (r, a) {
    a.value.forEach((val) => {
      r[val.question_id] = r[val.question_id] || [];
      r[val.question_id].push(val.response_type);
    });
    return r;
  }, Object.create(null));

  let groupedByTag = {};
  responses.forEach(function (res) {
    const values = res.value;

    values.forEach(function (val) {
      let temp = {};
      temp = {
        question_id: val.question_id,
        timestamp: res.timestamp,
        value: val.value,
        confidence: res.confidence,
        response_type: val.response_type,
      };
      if (!groupedByTag[val.question_id]) {
        groupedByTag[val.question_id] = [temp];
      } else {
        groupedByTag[val.question_id].push(temp);
      }
    });
  });

  responses.forEach(function (res) {
    const values = res.value;

    values.forEach(function (val) {
      let temp = {};
      temp = {
        question_id: val.question_id,
        timestamp: res.timestamp,
        value: val.value,
        confidence: res.confidence,
        response_type: val.response_type,
      };
      if (!groupedByTag[val.question_id]) {
        groupedByTag[val.question_id] = [temp];
      } else {
        groupedByTag[val.question_id].push(temp);
      }
    });
  });
  // console.error("grouped by tag")
  // console.error(groupedByTag)
  useEffect(() => {
    if (selected) setRenderChart(true);
    else setRenderChart(false);
  }, [selected]);

  function RenderChart({ questionId }) {
    const questionIdRes = groupedByTag[questionId];
    const responseType = groupedByQuestionIdTag[questionId];

    if (responseType !== undefined) {
      if (responseType[0] == "numeric") {
        return <LineChartComponent questionIdRes={questionIdRes} />;
      } else if (responseType[0] == "survey" || responseType[0] == "string") {
        console.error("holaaaaaqaa");
        console.error(responseType);

        return <PieChart questionIdRes={questionIdRes} />;
      } else if (responseType[0] == "image") {
        return (
          <ImageComponent
            questionIdRes={questionIdRes}
            questionId={questionId}
            physicianId={physicianId}
          />
        );
      }
    }

    return <Text>{"Not able to visualize this datastream"}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={{ alignItems: "center", textAlign: "center" }}>{name}</Text>
      <SelectPicker
        style={{ alignItems: "center" }}
        onValueChange={(value) => {
          setSelected(value);
        }}
        selected={selected}
        placeholder="--Select-- "
      >
        {Object.keys(groupedByTag).map((val, index) => (
          <SelectPicker.Item label={val} value={val} key={index} />
        ))}
      </SelectPicker>
      <View style={styles.container}>
        {renderChart ? (
          <RenderChart questionId={selected} />
        ) : (
          <Text>{""}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    // alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
});
export default AllResponses;
