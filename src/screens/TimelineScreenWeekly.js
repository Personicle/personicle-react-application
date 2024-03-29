import { Pressable,SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Timeline from 'react-native-timeline-flatlist'
import { getUserEvents } from "../../api/http";
import {useEffect, useState } from "react";
import { SplashStack } from "../navigationStacks";
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import { Dimensions } from 'react-native';
import lodash from 'lodash';
import {
  StackedBarChart
} from "react-native-chart-kit";
import { clearNodeFolder } from "broadcast-channel";
import { getEvents } from "../utils/userEvents";

const TimelineScreenWeekly = () => {
  const[weeklyEvents, setWeeklyEvents] = useState([]);
  const[currentEvents, setCurrentWeekEvents] = useState([]);
  const[isloading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const[timelineYearWeek,setYearWeek] = useState("");
  const [chartData, setChartData] = useState({});
  const [formattedChartData, setFormattedChatData] = useState([]);


  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    backgroundColor: "#FFFFFF",
    color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 4, // optional, default 3
    barPercentage: 0.5,
    width: Dimensions.get("window").width,
    useShadowColorFromDataset: false // optional
  };

  const graphStyle = {
    // paddingLeft: 10
    // marginVertical: 8,
    // ...chartConfig.style
  }
  const events =  getEvents();

    async function formatEvents(hardRefresh){
        let data = []
        let start_times = []
        hardRefresh = hardRefresh || false
        let userEvents ;
        if(hardRefresh){
          userEvents = await getUserEvents();
        } else userEvents = events.data

        // console.error(events)
        userEvents["data"].forEach(event => {
          start_times.push(moment(event['start_time']).utc(event['start_time']).local().format('MM-DD-YYYY h:m:s.SSS a'))
          data.push({
            time: moment(event['start_time']).utc(event['start_time']).local().format('MM-DD-YYYY h:m:s.SSS a'),
            end_time: moment(event['end_time']).utc(event['end_time']).local().format('MM-DD-YYYY h:m:s.SSS a'),
            title: event["event_name"],
            duration: event['parameters']['duration'],
            event_id: event['unique_event_id']
          })
        })
  
        try {
            const groups = data.reduce((acc, d) => {
                const yearWeek = `${moment(d.time,"MM-DD-YYYY h:m:s.SSS a").year()}-${moment(d.time,"MM-DD-YYYY h:m:s.SSS a").week()}`;
                if (!acc[yearWeek]) {
                  acc[yearWeek] = [];
                }
                acc[yearWeek].push(d);
                return acc;
              
              }, {});
              setWeeklyEvents(groups)
        } catch (error) {
            console.error(error)
        }
        
          setIsLoading(false);
     }
 
     useEffect(()=>{
      events.isFetched && formatEvents();
     }, [events.isFetched && !events.isRefetching])


  useEffect(() => {
    setCurrentWeekEvents(weeklyEvents[timelineYearWeek]);
   }, [timelineYearWeek]);
   useEffect(() => {
    
    try {
   
      if (currentEvents !== undefined ){
        const groupedByDayOfWeek = lodash.groupBy(currentEvents, (event) => {
          return [moment(event['time'],'MM-DD-YYYY h:m:s.SSS a').startOf('day').format('dddd').substring(0,3)];
        });
        // console.error(groupedByDayOfWeek)
     

     let formattedData = Object.entries(groupedByDayOfWeek).map((event)=> {
       return [event[0],lodash.groupBy(event[1],'title')]
      })

          setFormattedChatData(formattedData)          
  
      } else {
        setChartData(undefined);
      }
    } catch (error) {
      console.error(error)
    }
    
   }, [currentEvents]);

   useEffect(()=>{
     if(currentEvents !== undefined){
    let uniqueEventsInWeek = [...new Set(currentEvents.map(({title})=> title))]
          let daysActive = [...new Set(currentEvents.map(({time})=> moment(time,'MM-DD-YYYY h:m:s.SSS a').startOf('day').format('dddd').substring(0,3)))]
          let dataToDisplay = [];
         
        let t = formattedChartData.forEach((e)=>{
          let temp = {}
          // console.error("inside for each")
          //  console.error(e.length)
           for (const [key, value] of Object.entries(e[1])) {
            console.warn(`${key}: ${value}`);
            temp[key+"_"+e[0]]  = lodash.sumBy(value, (o)=> {
              return (Math.floor(moment.duration(o['duration']).asMinutes()))
            })
          }
          
          console.error("temp")
          console.error(temp)
           dataToDisplay.push(Object.values(temp))
        })
        console.error("datatoDisplay")
        console.error(dataToDisplay)
          const datas = {
            labels: daysActive,
            legend: uniqueEventsInWeek,
            data:  dataToDisplay,
            // [3634771,273515],
            // [3367866,782142],
            // [20820000,3553875,11944589],
            // [2134164,918412]
            barColors: ["#eb4034", "#152ae6", "#21e010","#0C2C03"]
          }; 

          setChartData(datas);
        }
   },[formattedChartData])

  const setCalendarHeader = (sd,ed) => {
    if(firstLoad){
        setFirstLoad(false);
        setDateRange(moment().startOf('week').format("MMM Do YY").toString() + " - " + moment().endOf('week').format("MMM Do YY").toString())
        let yw = `${moment().year()}-${moment().week()}`;
        setYearWeek(yw);

    } else {
        setDateRange(moment(sd).format("MMM Do YY") + " - "+ moment(ed).format("MMM Do YY"))
        const yw2 = `${moment(sd,"MM-DD-YYYY h:m:s.SSS a").year()}-${moment(ed,"MM-DD-YYYY h:m:s.SSS a").week()}`;
        setYearWeek(yw2);
    }
  }
  return (
    <View style={styles.container}>
        {isloading ? (<SplashStack/> ): [(<CalendarStrip
          scrollable
          style={{height:100, paddingTop: 1, paddingBottom: 2}}
          daySelectionAnimation={{type: 'border', duration: 500, borderWidth: 1, borderHighlightColor: 'black'}}
          maxDate={moment().endOf('week')}
          onWeekChanged= {(sd,ed) => {
              setCalendarHeader(sd,ed)
          }}
          headerText ={dateRange}
          showDayName = {false}
          showDayNumber = {false}
        />), ( (chartData !== undefined)? <StackedBarChart
        style={graphStyle}
        data={chartData}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={chartConfig}
        formatYLabel={(t) => Math.trunc(parseInt(t)).toString()+"min"}
        /> : <Text>No events</Text>)]}
    </View>
  );
};

export default TimelineScreenWeekly;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		paddingTop:65,
		backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
});
