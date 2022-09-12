import { Pressable,SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Timeline from 'react-native-timeline-flatlist'
import { getUserEvents } from "../../api/http";
import {useEffect, useState } from "react";
import { SplashStack } from "../navigationStacks";
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';

const TimelineScreenWeekly = () => {
  const[weeklyEvents, setWeeklyEvents] = useState([]);
  const[currentEvents, setCurrentWeekEvents] = useState([]);
  const[isloading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const[timelineYearWeek,setYearWeek] = useState("");

  useEffect(() => {
    async function getEvents(){
        let data = []
        let start_times = []
        const events =  await getUserEvents();
    
        events["data"].forEach(event => {
          start_times.push(moment(event['start_time']).utc(event['start_time']).local().format('MM-DD-YYYY h:m:s.SSS a'))
          data.push({
            time: moment(event['start_time']).utc(event['start_time']).local().format('MM-DD-YYYY h:m:s.SSS a'),
            end_time: moment(event['end_time']).utc(event['end_time']).local().format('MM-DD-YYYY h:m:s.SSS a'),
            title: event["event_name"],
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
    getEvents();
  }, [])

  useEffect(() => {
    setCurrentWeekEvents(weeklyEvents[timelineYearWeek]);
   }, [timelineYearWeek]);

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
        />),(<Timeline 
          style={styles.list}
          data={currentEvents}
          onEventPress = {(e) => {
            console.error(e)
          }}
         /> )]}
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
