import {Text,TextInput,View, SafeAreaView, FlatList, StyleSheet,Dimensions} from 'react-native';
import {useState,useEffect} from 'react';
import SelectPicker from 'react-native-form-select-picker';
import {
    LineChart
  } from 'react-native-chart-kit';
  import groupBy from "lodash/groupBy";
  import moment from "moment";

function AllResponses({route, navigation}){


    const responses = route.params?.responses;
    const physicianId = route.params?.physician_id;
    const [selected, setSelected] = useState("");
    const [renderChart,setRenderChart] = useState(false);
    // var groupedByResponseType = responses.reduce(function (r, a) {
    //     a.value.forEach(val => {  
    //         r[val.response_type] =  r[val.response_type] || [] 
    //         r[val.response_type].push(a);
    //     })
    //     return r;
    // }, Object.create(null));
    console.error(responses);

    // var groupedByTag = responses.reduce(function (r, a) {
    //     a.value.forEach(val => {  
    //         r[val.question_id] =  r[val.question_id] || []
    //         r[val.question_id].push(a);
    //     })
    //     return r;
    // }, Object.create(null));
    // console.error(groupedByResponseType)

    // console.error(groupedByTag)
    let groupedByTag = {}
    responses.forEach(function(res) { 
      const values = res.value;

      values.forEach(function (val) {
        let temp = {}
        temp = {
          question_id: val.question_id,
          timestamp: res.timestamp,
          value: val.value,
          confidence: res.confidence,
          response_type: val.response_type,

        }
        if(!groupedByTag[val.question_id]){
         
          groupedByTag[val.question_id] = [temp];
        } else {
          groupedByTag[val.question_id].push(temp) ;
        }
        
      })
    
    });
 
    console.error(groupedByTag)
    useEffect(() => {
        if(selected){
          console.error("sue effect")
          setRenderChart(true);

        }
        else
           setRenderChart(false);
    }, [selected])



    function RenderChart({questionId}){
       
     const questionIdRes = groupedByTag[questionId];

  //  const  timestamps = groupedByTag[questionId].map(function(value) {
  //     return value.timestamp;
  //   });
     let groupedByDay = groupBy(questionIdRes, (val) => moment(val.timestamp).format('MM-DD-YYYY'))

    console.error(groupedByDay)
    let avgValByDay = {}
    for (let [key, value] of Object.entries(groupedByDay)) {
      let avg = value.reduce(function (sum, v) {
        console.error(sum);
        return sum + parseFloat(v.value);
      }, 0) / value.length;
      // console.error(value.length)
      avgValByDay[key] = avg;
    }
   
    console.error(avgValByDay)
        // const line = {
        //     labels: Object.keys(avgValByDay),
        //     datasets: [
        //       {
        //         data: Object.values(avgValByDay),
        //         strokeWidth: 2, // optional
        //         metaData: avgValByDay
        //       },
        //     ],
        //   };

          const line = {
            labels: ["jan","Feb","March", "April", "May","June"],
            datasets: [
              {
                data: [20, 45, 28, 80, 99, 43],
                strokeWidth: 2, // optional
              },
            ],
          };
          return (
              <LineChart
                data={line}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                yAxisLabel={''}
                chartConfig={{
                  backgroundColor: '#1846ab',
                  backgroundGradientFrom: '#1e58d8',
                  backgroundGradientTo: '#4476e5',
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                onDataPointClick={(value,dataset,getColor) => console.error(values) }
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
             
   
          );
    }
    return (
        <View style={styles.container}>
            <Text>{physicianId}</Text>

            <SelectPicker
                          onValueChange={(value) => {
                             //render chart
                            //  console.error("rfe");
                            //   return <RenderChart/>
                              setSelected(value);
                          }}
                          
                          selected={selected}
                          placeholder="--Select-- "
                          >
                         
                         {Object.keys(groupedByTag).map((val, index) => (
                              <SelectPicker.Item label={val} value={val} key={index} />
                          ))}
                  </SelectPicker> 
                  <View>
                    {
                    renderChart ? <RenderChart questionId={selected}/> : <Text>{''}</Text>

                  }
                  </View>
               
        </View>

     
    )
}

const styles = StyleSheet.create({
    container: {
         padding: 24,
          alignItems: 'center',
          paddingTop: 10,
          flex: 1
    }
  });
export default AllResponses;