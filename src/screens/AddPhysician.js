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
import { getAllPhysicians, addPhysiciansToUser } from '../../api/http';
import { showMessage } from "react-native-flash-message";

function AddPhysician({navigation, route}) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [physiciansAdded, setPhysicians] = useState([]);
    const[submit, setSubmit] = useState(false);
    const[isLoading, setIsloading] = useState(false);
    const testImage = route.params?.testImage;
    const fetchData = async () => {
        try {
            // const response = await axios.get(url);
            // setData(response['data']['results']);
            // setFilteredData(response['data']['results']);
            setIsloading(true);
            const res = await getAllPhysicians();
            setData(res['data']);
            setFilteredData(res['data']);
            setIsloading(false);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        // async function getProfileImageUrl(imageKey){
        //     const res = await getImageUrl(imageKey);
        //     setProfileImage(res['data']['image_url'])
        //     setIsLoading(false);
      
        //   }
    }, []);
    
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
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
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
        async function save(physicians){
            const res = await addPhysiciansToUser(physicians); // api call to add physicians to user
            if(res.status == 200){
                showMessage({
                    message: "Physicians added successfully",
                    type: "success",
                    statusBarHeight: 2,
                    duration: 3500,
                    floating: true,
                  });
                
            } else {
                showMessage({
                    message: "Something went wrong. Physicians not added",
                    type: "warning",
                    statusBarHeight: 2,
                    duration: 3500,
                    floating: true
                  });
            }
            navigation.goBack();
        }
        if(physiciansAdded !== undefined &&  physiciansAdded.length !== 0) {
            // save added physicians
            let physicians = []
            physiciansAdded.forEach(phy => physicians.push(phy.id))
             save(physicians)
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

                {physiciansAdded.map((item) => {
                    return (
                        <View key={item.id} style={styles.physicians}>
                                <Text style={{marginLeft: 22, marginTop: 5}}>{item.name}</Text>
                            <TouchableOpacity onPress= {() => {
                                setPhysicians(physiciansAdded.filter(phy => phy.id !== item.id))
                            }} >
                               <FontAwesome name="times-circle-o" style={{marginLeft: 5, marginTop: 5, color: "#f56262"}} size={20} />
                            </TouchableOpacity>
                        </View>
                    )
                })}

                {filteredData.length === 0 && !isLoading &&  <Text style={{alignItems: 'center', marginLeft: 25 , marginTop: 10}}>No Results</Text>  }

            {
                   isLoading ? <ActivityIndicator size='large' color="#0000ff"/> : filteredData.map((item) => {
                        return (
                            <View key={item.id} style={styles.itemContainer}>
                                <TouchableOpacity style= {styles.itemContainer} onPress={() => {
                                    if(!physiciansAdded.some(phy => phy.id === item.id)) {

                                        setPhysicians( [...physiciansAdded, {id: item.id, name: item.name}])
                                    }
                                }
                                
                                 }>
                                <Image
                                    source={{ uri: testImage}}
                                    style={styles.image}
                                />
                                <View>
                                    <Text style={styles.textName}>{item.name}</Text>
                                    {/* <Text style={styles.textEmail}>{item.login.username}</Text> */}
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