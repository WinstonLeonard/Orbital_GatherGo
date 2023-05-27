import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { authentication } from '../firebase/firebase-config';
import CustomButton from '../shared/button';


export default function  Home({navigation}) {


    const handleLogout = () => {
        authentication.signOut()
        .then(() => {
            navigation.replace('Login')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            // ..
          })
    }

    return (
        <View style = {styles.container}> 
            <Text style = {styles.title}> Home Screen</Text>
            <Text style = {styles.title}> Welcome... </Text>
            <Text style = {styles.title}> {authentication.currentUser?.email} </Text>
            <Text style = {styles.title}> Home screen to be continued... </Text>
            <CustomButton text = "Logout" onPress={handleLogout}></CustomButton>

            <View style = {styles.imageContainer}>
            <Image style={{width: 300, height: 400}}
                   source={require('../assets/pictures/TARIWIGGLE.gif')}
                   resizeMode= 'contain'/>
            </View>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 10,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#292929',
    },
    title: {
        marginBottom: 10,
        fontSize: 20,
        color: 'cyan',
    },
    imageContainer: {
        //backgroundColor: 'red',
    }
})