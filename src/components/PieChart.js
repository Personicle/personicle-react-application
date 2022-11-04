import {View,Alert,Text, StyleSheet, ScrollView} from 'react-native';
import groupBy from "lodash/groupBy";
import moment from "moment";
import {useEffect, useState } from "react";
import { VictoryBar,VictoryTooltip, VictoryVoronoiContainer,VictoryChart, VictoryLine,VictoryTheme, VictoryPie, VictoryLabel} from "victory-native";
import CalendarStrip from 'react-native-calendar-strip';
import { SplashStack } from "../navigationStacks";


function PieChart({questionIdRes}){
   const [todayEvents, setTodayEvents] = useState([]);
   const [firstLoad, setFirstLoad] = useState(true);
   const[isloading, setIsLoading] = useState(true);
   const[groupedByDay, setgroupedByDay] = useState({});
   const[groupedByWeek, setgroupedByWeek] = useState({});
   const [dateRange, setDateRange] = useState("");
   const[timelineYearWeek,setYearWeek] = useState("");
   const[currentEvents, setCurrentWeekEvents] = useState([]);
  const [formattedChartData, setFormattedChatData] = useState([]);
   const[renderBarChart, setRenderBarChart] =  useState(false);
   const[BarChartData, setBarChartData] = useState([]);
    // console.error(questionIdRes)

    // console.error(groupedByDay)
useEffect(()=> {
    async function groupEventsByWeek() {
        console.error("use efect")
        console.error(questionIdRes)
        let groupedByDay = groupBy(questionIdRes, (val) => moment(val.timestamp).format('MM-DD-YYYY'))
   
        // const yearWeek = groupBy(questionIdRes, (val) => { `${moment(val.timestamp,"MM-DD-YYYY h:m:s.SSS a").year()} - ${moment(val.timestamp,"MM-DD-YYYY h:m:s.SSS a").week()}` }) 
        // `${moment(d.time,"MM-DD-YYYY h:m:s.SSS a").year()}-${moment(d.time,"MM-DD-YYYY h:m:s.SSS a").week()}`;
        console.error(groupedByDay)
        console.error("grouped by year week")
        const yearWeek = questionIdRes.reduce((acc, d) => {

            const yearWeek = `${moment(d.timestamp,).year()}-${moment(d.timestamp).week()}`;
            if (!acc[yearWeek]) {
              acc[yearWeek] = [];
            }
            acc[yearWeek].push(d);
            return acc;
          
          }, {});
        console.error(yearWeek)
        setgroupedByWeek(yearWeek);
       setgroupedByDay(groupedByDay)
    }
    groupEventsByWeek();
},[])
useEffect(() => {
    console.error("hola")
    console.error(timelineYearWeek)
    console.error(groupedByWeek[timelineYearWeek])
    setCurrentWeekEvents(groupedByWeek[timelineYearWeek]);
    setRenderBarChart(false);
   }, [timelineYearWeek]);

const setCalendarHeader = (sd,ed) => {
    if(firstLoad){
        setFirstLoad(false);
        setDateRange(moment().startOf('week').format("MMM Do YY").toString() + " - " + moment().endOf('week').format("MMM Do YY").toString())
        let yw = `${moment().year()}-${moment().week()}`;
        setYearWeek(yw);

    } else {
        console.error("not first load")
        setDateRange(moment(sd).format("MMM Do YY") + " - "+ moment(ed).format("MMM Do YY"))
        const yw2 = `${moment(sd,).year()}-${moment(ed,).week()}`;
        console.error(yw2)
        setYearWeek(yw2);
    }
  }

  useEffect(()=>{

    if(currentEvents !=  undefined){
        console.error("Exists")
        let formattedData = [];
            let temp = {}
            currentEvents.forEach(r => {
                if(temp[r.value] == undefined){
                    console.error("hereee")
                    temp[r.value] = []
                    temp[r.value].push(r)
        
                }
                else{
                    console.error("hereee else")
                    temp[r.value].push(r)
                }
        
            })
            formattedData.push(temp)
            let dataToPlot = []
            Object.entries(formattedData[0]).forEach( ([k,v]) => {
                dataToPlot.push( {
                    x: k, y: v.length, details: v
                })
            })
            console.error(dataToPlot)
            setFormattedChatData(dataToPlot)   
    } else {
        setFormattedChatData(undefined)   

    }
  }, [currentEvents])
    function getSelectedDaysResponses(date){
        // if(firstLoad)
        //     setgroupedByDay(events)
        if(groupedByDay[moment(date).format('MM-DD-YYYY')] === undefined){
          setTodayEvents([]);
          setFirstLoad(false);
          setIsLoading(false)
          console.error("if undefiend")
        } else {
          console.error("defined")

            let dayToPlot = groupedByDay[moment(date).format('MM-DD-YYYY')]
            setIsLoading(true);
            let formattedData = [];
            let temp = {}
            dayToPlot.forEach(r => {
                if(temp[r.value] == undefined){
                    console.error("hereee")
                    temp[r.value] = []
                    temp[r.value].push(r)
        
                }
                else{
                    console.error("hereee else")
                    temp[r.value].push(r)
                }
        
            })
            formattedData.push(temp)
            console.error(formattedData)
            
           
            let dataToPlot = []
            Object.entries(formattedData[0]).forEach( ([k,v]) => {
                dataToPlot.push( {
                    x: k, y: v.length, details: v
                })
            })
          setFirstLoad(false);
          setTodayEvents(dataToPlot);
          setIsLoading(false);
        }
      }

    function BarChart(){
        formattedBarChartData = [];
        console.error(BarChartData)
        let groupedByDay = groupBy(BarChartData, (val) => moment(val.timestamp).format('MM-DD-YYYY'))
        console.error(groupedByDay)
        // BarChartData.forEach(res => {
        //     let temp = {}
        //     temp['x'] = moment(res.timestamp).format('MM-DD-YYYY')
        //     temp['y'] = res.value
        //     formattedBarChartData.push(temp);
        // });
        Object.entries(groupedByDay).forEach( ([k,v]) => {
          let temp ={}
          temp['x'] = k
          temp['y'] = v.length
          formattedBarChartData.push(temp);
        })
        return(
        <View>
            
            <VictoryChart
            theme={VictoryTheme.material}
            height={250}
            //  style={{
            //   parent: {
            //     // border: "1px solid #ccc"
            //   },
              
            //   background: {
            //     // fill: "#0761e0",
            //     fillOpacity: 0.9,
            //   }
            // }}
            >
              <VictoryBar
            barWidth={({ index }) => index * 2 + 8}
            style={{
              data: { fill: "#c43a31" }
            }}
            labels={({ datum }) => `${datum.y}`}
          data={formattedBarChartData}
          />
            {/* <VictoryLine
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
                data={formattedBarChartData}
              /> */}
            </VictoryChart>
            
            </View>)
    }

    return (
        // (formattedChartData == undefined ||  formattedChartData.length == 0)  ?   <Text>{'No events'}</Text>  
              <View style={styles.container}>
                        {[( <CalendarStrip
                            scrollable
                            style={{height:50, paddingTop: 0, paddingBottom: 0}}
                            daySelectionAnimation={{type: 'border', duration: 500, borderWidth: 1, borderHighlightColor: 'black'}}
                            maxDate={moment().endOf('week')}
                            onWeekChanged= {(sd,ed) => {
                                setCalendarHeader(sd,ed)
                            }}
                            headerText ={dateRange}
                            showDayName = {false}
                            showDayNumber = {false}
                         />),  (<VictoryPie
                            innerRadius={5} labelRadius={50}
                            labels={({ datum }) => `${datum.x}`}
                            width={350} height={320}
                            // labelComponent={ 

                            //    <VictoryLabel
                            //     text={({ datum }) => [`${datum.x}`]}
                            //     textAnchor={({ text }) => text.length > 1 ? "start" : "middle"}
                            //   />

                            // }
                            cornerRadius={({ datum }) => datum.y * 5}
                            animate={{
                            duration: 3500
                            }}
                            padAngle={({ datum }) => datum.y}
                            theme = {VictoryTheme.material}
                            data={ formattedChartData == undefined ? "no events" :  formattedChartData}

                            events={[{
                            target: "data",
                            eventHandlers: {
                            onPressIn: () => {
                            return [
                                {
                                target: "data",
                                mutation: (props) => {
                                    // console.error('index: '+props.index);
                                    // return null;
                                }
                                }, {
                                target: "labels",
                                mutation: (props) => {
                                    const t = JSON.stringify(props.datum.details)
                                    setRenderBarChart(true);
                                    setBarChartData(props.datum.details)
                                    // return Alert.alert("Selected event", t);
                                } 
                                }
                            ];
                            }
                            }
                            }]}
                            />

                    ) ]}

         
           {renderBarChart == true ? <BarChart/> : null}

            
        
        </View>
    );

   
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   padding: 20,
    //   paddingTop:65,
    //   backgroundColor:'white'
    },
    list: {
      flex: 1,
      marginTop:20,
    },
  });
export default PieChart;