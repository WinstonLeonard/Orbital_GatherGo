import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import CustomButton from '../shared/button';
import { authentication } from '../firebase/firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { StatusBar } from "expo-status-bar";


export default function Welcome({navigation}) {
    const pressHandler = () => {
        //navigation.navigate('NewLogin')
        onAuthStateChanged(authentication, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              navigation.navigate('Home');
              // ...
            } else {
                navigation.navigate('NewLogin');
              // User is signed out
              // ...
            }
        });

    }
    
    return (
        <View style = {styles.container}>
            <StatusBar style="auto"/>
            <Text style = {styles.titleFont}> Ready to start gathering? </Text>

            <View style = {styles.imageContainer}>
            <Image source = {require('../assets/pictures/GatherGoGreyBG.png')}
                   style = {{
                    height: 300,
                    width: 400,
                    resizeMode: 'contain'
                   }}></Image> 
            </View>

            <CustomButton text= "Get Started!" 
                          buttonColor= "#39A5BD" 
                          textColor='white' 
                          onPress = {pressHandler}
                          width = {155}
                          height = {60}
                          fontSize = {18}
                          cornerRadius= {26} ></CustomButton>


        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2F2E2F",
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleFont: {
        fontFamily: "Nunito-Sans-Bold",
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    imageContainer: {
        marginTop: 10,
        //backgroundColor: 'red',
        marginBottom: 10,
    },
})