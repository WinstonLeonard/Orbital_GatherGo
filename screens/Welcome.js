import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import CustomButton from '../shared/button';



export default function Welcome({navigation}) {
    const pressHandler = () => navigation.navigate('Login')
    return (
        <View style = {styles.container}>

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