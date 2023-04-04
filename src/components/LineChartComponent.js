import {View, Text,StyleSheet,Dimensions} from 'react-native';
import { VictoryLine,VictoryTooltip,VictoryVoronoiContainer, VictoryChart, VictoryTheme } from "victory-native";
import groupBy from "lodash/groupBy";
import moment from "moment";
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import {
  LineChart
} from 'react-native-chart-kit';
import {useState } from "react";


function LineChartComponent({questionIdRes}){
        let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
        let groupedByDay = groupBy(questionIdRes, (val) => moment(val.timestamp).format('MM-DD-YYYY'))

        let avgValByDay = {}
        for (let [key, value] of Object.entries(groupedByDay)) {
            let avg = value.reduce(function (sum, v) {
            return sum + parseFloat(v.value);
            }, 0) / value.length;
            avgValByDay[key] = avg;
        }
       let formattedData = []
       let maxY = Number.MIN_VALUE;
       let minY = Number.MAX_VALUE;
      //  let min = 0;
      //  let max = 0 ;
       
       for(let [key,value] of Object.entries(avgValByDay)){
         let temp = {}
         // max y and min y
         
         if(value > maxY) maxY = value;
         if(value < minY) minY = value;

         temp['x'] = key;
         temp['y'] = value;
         temp['info'] = groupedByDay[key]
         formattedData.push(temp);
       }
       const line = {
        labels: Object.keys(avgValByDay),
        datasets: [
          {
            data: Object.values(avgValByDay),
            strokeWidth: 2, // optional
            metaData: groupedByDay
          },
        ],
      };
      // console.error(formattedData)
    
        return (
          <View >
          <Svg>
            <Defs>
              <LinearGradient id="linearrrr" x1="0%" y1="0%" x2="0%" y2="100%" >
              <Stop offset="0%"   stopColor="green"/>
              <Stop offset="100%" stopColor="red" />
              </LinearGradient>
            </Defs>
            {console.error(minY)}
            {console.error(maxY)}

      {/* console.error(maxValue) */}
            <VictoryChart
            theme={VictoryTheme.material}
             style={{
              parent: {
                // border: "1px solid #ccc"
              },
              background: {
                fill: "#0761e0",
                fillOpacity: 0.9,
              }
            }}
            maxDomain={{y: maxY + 0.03*maxY}}
            minDomain={{y: minY - 0.03*minY}}

            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) =>  `${( JSON.stringify(datum.info,null,'\n'))}, avg ${(datum.y)}`}
                labelComponent={
                  <VictoryTooltip  cornerRadius={4}  constrainToVisibleArea />
                }
              />
            }
            >
              <VictoryLine
              interpolation="natural"
              animate={{
                onLoad: { duration: 3000 }
              }}
                style={{
                  
                  data: {
                    stroke: 'white' ,
                    // strokeWidth: ({ data }) => data.length,
                    
                  },
                  labels: {
                    fontSize: 15,
                    // fill: ({ datum }) => datum.x === 3 ? "#000000" : "#c43a31"
                  }
                }}
                data={formattedData}
              />
            </VictoryChart>
          </Svg>
           
          </View>
 
        );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      paddingTop:0,
      backgroundColor:'black'
    },
    list: {
      flex: 1,
      marginTop:1,
    },
    
  });
  
export default LineChartComponent;