import React from 'react';
import { View, StyleSheet } from 'react-native';


const MoveRight = () => {
    return (
        <View style={styles.background}>
            <View style={styles.top} >
                <View style={styles.bottom} />
            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    background:{
      height: 50,
      width: 50,
      borderRadius:25,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row-reverse',
      backgroundColor:"#0000003d",
      paddingBottom:10
    },
    top: {
        height: 20,
        width: 3,
        backgroundColor: 'white',
        transform: [{ rotate: '-45deg' }]
    },
    bottom: {
        height: 20,
        width: 3,
        backgroundColor: 'white',
        marginTop: 9,
        marginLeft: -9,
        transform: [{ rotate: '-90deg' }],
    }
});

export default MoveRight;
