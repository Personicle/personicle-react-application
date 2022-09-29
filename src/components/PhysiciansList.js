import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import Physician from './Physician';

function renderPhysicians(itemData){
  // console.error("hola")
  // console.error(itemData.item)
    return <Physician  {...itemData.item}/>
}
function PhysiciansList({physicians}){
    // console.error("inside")
    // console.error(physicians)

    return (
        <SafeAreaView >
        <FlatList
          data={physicians}
          renderItem={renderPhysicians}
          keyExtractor={item => item.physician_id}
        />
      </SafeAreaView>
        // <Flatlist data={physicians} 
        //     renderItem={renderPhysicians} 
        //     keyExtractor={(item) => item.physician_id} />
    )
}
export default PhysiciansList