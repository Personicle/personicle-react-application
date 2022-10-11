
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl,FlatList} from "react-native";
import React from "react";
import {  useState, useEffect } from "react";

function UsersPhysicians({responses}){
    const[setPhysicians, physicians] = useState([]);
    useEffect(()=> {

    },[])

    return (
        <SafeAreaView >
            <FlatList
            data={physicians}
            renderItem={renderPhysicians}
            keyExtractor={item => item.physician_id}
            />
        </SafeAreaView>
      );
}

export default UsersPhysicians;