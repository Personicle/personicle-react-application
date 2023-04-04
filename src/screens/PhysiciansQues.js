import {
  Text,
  Alert,
  TextInput,
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useRef,
} from "react";
import RenderQuestions from "../components/RenderQuestions";
import Button from "../components/UI/Button";
import { GlobalStyles } from "../../constants/styles";
import moment from "moment";
import QuestionnaireForm from "../components/QuestionnaireForm";
import { PhysiciansContext } from "../context/physicians-context";
import SelectPicker from "react-native-form-select-picker";
// import ImagePicker from '../components/ImagePicker'
import { getUserId } from "../../api/interceptors";
import { sendPhysicianResponses, uploadImage } from "../../api/http";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import { showMessage } from "react-native-flash-message";
import { useQueryClient } from "react-query";

function PhysiciansQues({ route, navigation }) {
  const PhysicianCtx = useContext(PhysiciansContext);
  const [selected, setSelected] = useState();
  const [responses, setResponses] = useState({
    test: "",
    res: {},
  });
  const [pickerValue, setPickerValue] = useState({});
  const phyName = route.params?.phyName;
  const questions = route.params?.questions;
  const physicianId = route.params?.physician_id;

  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Questionnaire by ${phyName}`,
    });
  }, [navigation]);

  function cancelHandler() {
    navigation.goBack();
  }

  const choosePhotoFromLibrary = (question) => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {

      setResponses((prevState) => ({
        res: {
          ...prevState.res,
          [question["tag"]]: image.sourceURL,
        },
      }));
      // setProfilePic(image);
      // setProfileImage(''); // reset the profile image to the image uploaded by user
    });
  };

  async function confirmHandler() {
    let data_packet = [];
    let image_data_packet = [];
    for (let key of Object.keys(responses.res)) {
      let resType = "";
      questions.forEach((element) => {
        if (element["tag"] === key) {
          resType = element["response_type"];
        }
      });
      if (resType == "image") {
        // call image uupload api to validate and return image key, then format datastream response
        // calling uploadImagefunction, (call image upload service with image)
        const r = await uploadImage(responses.res[key]);

        try {
          if (r["status"] == 201) {
            image_data_packet.push({
              question_id: key,
              value: r["data"][0]["image_key"],
              response_type: resType,
            });

          } else if (r["status"] == 422) {
            Alert.alert("Error", `${r["error"][0]}`, [
              {
                text: "Cancel",
                style: "cancel",
              },
            ]);
            return;
          }
        } catch (error) {
          // console.error(error);
        }
      } else {
        data_packet.push({
          question_id: key,
          value: responses.res[key],
          response_type: resType,
        });
      }
    }
    //  console.error(data_packet)
    const uid = await getUserId();
    //  try {

    //   console.error("final")
    //   console.error(image_data_packet)
    //  } catch (error) {
    //    console.error(error)
    //  }
    if (data_packet.length > 0 || image_data_packet.length > 0) {
      let finalPacket = data_packet.concat(image_data_packet);
      const finalDataPacket = {
        streamName:
          "com.personicle.individual.datastreams.subjective.physician_questionnaire",
        individual_id: uid,
        source: `Personicle:${physicianId}`,
        unit: "",
        confidence: 100,
        dataPoints: [
          {
            timestamp: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            value: finalPacket,
          },
        ],
      };
      const res = await sendPhysicianResponses(finalDataPacket);
      if(res){
        await queryClient.refetchQueries({ queryKey: ['physician-responses']})
      }
      navigation.goBack();
    }

    // PhysicianCtx.submitResponses( );

    // console.error(res)
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setResponses((prevState) => ({
      res: {
        ...prevState.res,
        [inputIdentifier]: enteredValue,
      },
    }));
  }

  function Question({ question }) {
    let items = [];
    question["options"].map((val, index) => {
      let temp = {};
      temp["label"] = val;
      temp["value"] = val;
      items.push(temp);
    });
    if (question["response_type"] == "numeric") {
      return (
        <>
          <Text style={styles.question}>{question["question"]}</Text>

          <TextInput
            style={styles.input}
            onChangeText={inputChangedHandler.bind(this, question["tag"])}
            // onChangeText={text => setResponses}

            placeholder="Enter a numeric value"
            value={responses.res[question["tag"]]}
            keyboardType="numeric"
          />
        </>
      );
    } else if (question["response_type"] == "string") {
      return (
        <>
          <Text style={styles.question}>{question["question"]}</Text>
          <TextInput
            style={styles.input}
            onChangeText={inputChangedHandler.bind(this, question["tag"])}
            placeholder="Enter string response"
            value={responses.res[question["tag"]]}
            keyboardType="default"
          />
        </>
      );
    } else if (question["response_type"] == "image") {
      return (
        <>
          <Text style={styles.question}>{question["question"]}</Text>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => choosePhotoFromLibrary(question)}
          >
            <Text style={styles.panelButtonTitle}>Upload Image</Text>
          </TouchableOpacity>
          {/* <ImagePicker/>  */}
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.question}>{question["question"]}</Text>
          <Dropdown
            style={styles.dropdown}
            data={items}
            maxHeight={300}
            labelField="label"
            valueField="value"
            search
            value={pickerValue[question["tag"]]}
            onChange={(item) => {
              setPickerValue((curr) => ({
                ...curr,
                [question["tag"]]: item.value,
              }));
              setResponses((prevState) => ({
                res: {
                  ...prevState.res,
                  [question["tag"]]: item.value,
                },
              }));
            }}
          />
        </>
      );
    }
  }

  return (
    // <SafeAreaView style={styles.container} >
    //   {/* <QuestionnaireForm questions={questions} onCancel={cancelHandler} onSubmit={confirmHandler} /> */}
    //   <FlatList
    //     data={questions}
    //     renderItem={renderQuestions}
    //   />

    <ScrollView style={styles.container}>
      {questions.map((ques, i) => {
        return (
          <>
            <Question question={ques} />
          </>
        );
      })}
      <View style={styles.buttons}>
        <Button mode="flat" onPress={cancelHandler} style={styles.button}>
          Cancel
        </Button>
        <Button onPress={confirmHandler} style={styles.button}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    // alignItems: 'center',
    paddingTop: 10,
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 14,
    color: "#2f354b",
    textAlign: "center",
  },
  question: {
    padding: 20,
    fontSize: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  dropdown: {
    height: 30,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    marginLeft: 25,
  },
  commandButton: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#0d58d1",
    alignItems: "center",
    marginTop: 10,
  },
});
export default PhysiciansQues;
