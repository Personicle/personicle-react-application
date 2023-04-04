import { Footer,Pressable,SafeAreaView, StyleSheet, Text, View,FlatList, RefreshControl,ScrollView } from "react-native";
import React from "react";
import Timeline from 'react-native-timeline-flatlist'
import { getUserEvents } from "../../api/http";
import {useEffect, useState } from "react";
import { SplashStack } from "../navigationStacks";
import groupBy from "lodash/groupBy";
import moment from "moment";
import CalendarStrip from 'react-native-calendar-strip';
import { getEvents } from "../utils/userEvents";

import { useMutation, useQueryClient } from 'react-query'

const TimelineScreen = () => {
  const[isloading, setIsLoading] = useState(true);
  const[dailyEvents, setDailyEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [onRefresh, setRefresh] = useState(false);
  const events = getEvents();
  const queryClient = useQueryClient()

  async function formatEvents(hardRefresh){
    let data = []
    let dates =[]
    //  const events =  await getUserEvents();
    try {
      hardRefresh = hardRefresh || false
      let userEvents;
      console.error(hardRefresh)
      if(hardRefresh) userEvents = await getUserEvents();
      else userEvents = events.data;

      userEvents.data.forEach(event => {
       
        data.push({
          time: moment(event["start_time"]).utc(event['start_time']).local().format(''),
          end_time: moment(event["end_time"]).utc(event['end_time']).local().format(''),
          title: event["event_name"],
        })
       })
        let groupedByDay = groupBy(data, (dt) => moment(dt['time']).format('MM-DD-YYYY'))
        setDailyEvents(groupedByDay)
        if(hardRefresh){
        //   const userEventsMutation = useMutation( {
        //     onSuccess: () => {
        //     // console.error("on success mutation")
        //     // console.error(updatedData)
            queryClient.setQueryData(['user-events'], (prev) => (userEvents ))
        //     }
        // })
        }
        setIsLoading(false);
        
    } catch (error) {
      console.error(error)
    }
   
    
    }
  // useEffect(() => {
  //   async function getEvents(){
  //   let data = []
  //   let dates =[]
  //    const events =  await getUserEvents();

   
  //    events["data"].forEach(event => {
       
  //     data.push({
  //       time: moment(event["start_time"]).utc(event['start_time']).local().format(''),
  //       end_time: moment(event["end_time"]).utc(event['end_time']).local().format(''),
  //       title: event["event_name"],
  //     })
  //    })
  //     let groupedByDay = groupBy(data, (dt) => moment(dt['time']).format('MM-DD-YYYY'))
  //     setDailyEvents(groupedByDay)
  //     setIsLoading(false);
  //   }
  //   getEvents();
  //   console.error("refresh")
  // }, [onRefresh])
  useEffect(() => {
    events.isFetched && formatEvents()
  },[events.isFetched && !events.isRefetching])

  function getSelectedDaysEvents(date){
    if(dailyEvents[moment(date).format('MM-DD-YYYY')] === undefined){
      setTodayEvents([]);
      setFirstLoad(false);
    } else {
      let today_events = []
      // moment().format('h:mm:ss a');
       dailyEvents[moment(date).format('MM-DD-YYYY')].forEach(e => {
        // console.error(moment().format('Z'))
         today_events.push({
          time: moment(e["time"]).format('h:mm:ss a'),
          end_time:  moment(e["end_time"]).format('h:mm:ss a'),
          title: e["title"],
         })
       
      })
      setFirstLoad(false);
      setTodayEvents(today_events);
     
    }
  }

useEffect(()=> {
  if(firstLoad){
    getSelectedDaysEvents(moment().format("MM-DD-YYYY"));
  }
},[])
const refreshData = async () => {
  setRefresh(true);
  formatEvents(true); // mutate cache as well
 
}
const getFooter = () => {
  return <Text>{' '}</Text>;
};
  return (
    <FlatList style={styles.container} ListHeaderComponent={

      <>
         {isloading ? (<SplashStack/> ):  [(<CalendarStrip
          scrollable
          style={{height:100, paddingTop: 1, paddingBottom: 2}}
          daySelectionAnimation={{type: 'border', duration: 500, borderWidth: 1, borderHighlightColor: 'black'}}
          maxDate={moment()}
          selectedDate={moment()}
          onDateSelected={(date) => {getSelectedDaysEvents(date)}}
          // calendarColor={'white'}
          // calendarHeaderStyle={{color: 'white'}}
          // dateNumberStyle={{color: 'black'}}
          // dateNameStyle={{color: 'black'}}
          // iconContainer={{flex: 0.1}}
        />), (todayEvents === undefined || todayEvents.length === 0) ? (<Text>No events</Text>) :(<Timeline 
          style={styles.list}
          // data= {}
          data={todayEvents}
          separator={false}
          onEventPress = {(e) => {
            console.error(e)
            
          }}
          
         /> ) ]}
      </>

    } refreshControl={
      <RefreshControl refreshing={isloading} onRefresh={refreshData}  />
    }  ListFooterComponent={getFooter} />
       
        
    
    
  // </FlatList>
    // <SafeAreaView>
    //   <View>
    //     <Text>TimelineScreen</Text>
    //     <Timeline 
    //       style={styles.list}
    //       data={data}
    //     />
    //   </View>
    // </SafeAreaView>
  );
};

export default TimelineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
		paddingTop:0,
		backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:1,
  },
});
