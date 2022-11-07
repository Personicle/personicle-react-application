import React, {useState,useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import SearchBar from "react-native-dynamic-search-bar"
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function AddPhysician({navigation}) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [physiciansAdded, setPhysicians] = useState([]);
    const[submit, setSubmit] = useState(false);
    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
           
            setData(response['data']['results']);
            setFilteredData(response['data']['results']);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData("https://randomuser.me/api/?results=20");
    }, []);
    const savePhysicians = () => {
        console.error(physiciansAdded)
    }
    useLayoutEffect(()=> {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={()=> setSubmit(true)} style={{
                  
                }}>
              <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "#000",
                }}
               >Save</Text>
            </TouchableOpacity>

            )
        })
      }, [navigation]);

     const searchFilterFunction = (text) => {
        if(text){  
            const newData = data.filter(item => {
                const itemData = item.name.first ? item.name.first.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredData(newData);
        } else {
            setFilteredData(data);
        }
    }
 
    // save physicians
    useEffect(()=>{
        if(physiciansAdded !== undefined &&  physiciansAdded.length !== 0) {
            console.error(physiciansAdded)
            navigation.goBack();
        }
    },[submit])
    return ( 

        <ScrollView style={styles.container}>
            <View>
                <SearchBar
                placeholder="Search Physicians..."
                // onPress={() => alert("onPress")}
                onClearPress={() => setPhysicians([])}
                onChangeText={(text) => searchFilterFunction(text)}
            />

                {physiciansAdded.map((item, index) => {
                    return (
                        <View style={styles.physicians}>
                                <Text>{item}</Text>
                            <TouchableOpacity onPress= {() => {
                                setPhysicians(physiciansAdded.filter(phy => phy !== item))
                            }} >
                               <FontAwesome name="times-circle-o" style={{marginLeft: 5, color: "#f56262"}} size={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}

            {
                    filteredData.map((item, index) => {
                        return (
                            <View key={index} style={styles.itemContainer}>
                                <TouchableOpacity style= {styles.itemContainer} onPress={() => {
                                    if(!physiciansAdded.includes(item.name.first)) {
                                        setPhysicians(curr => [...curr, item.name.first])
                                    }
                                }
                                
                                 }>
                                <Image
                                    source={{ uri: item.picture.large }}
                                    style={styles.image}
                                />
                                <View>
                                    <Text style={styles.textName}>{item.name.first} {item.name.last}</Text>
                                    <Text style={styles.textEmail}>{item.login.username}</Text>
                                    {/* <FontAwesome name="plus-circle" style={{marginLeft: 5, color: "blue"}} size={20} />   */}
                                </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5
    },
    physicians: {
        flexDirection: 'row',
        marginBottom: 5,
        flex: 1,
        marginLeft: 15
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        flex: 1
      },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "600",
    },
    textEmail: {
        fontSize: 14,
        marginLeft: 10,
        color: "grey",
    }
})
export default AddPhysician;