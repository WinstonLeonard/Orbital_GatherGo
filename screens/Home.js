import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { collection, doc, getDoc } from 'firebase/firestore';
import CustomButton from '../shared/button';


export default function  Home({navigation}) {

    const image = require("../assets/pictures/Homescreen.png")

    // const handleLogout = () => {
    //     authentication.signOut()
    //     .then(() => {
    //         navigation.replace('NewLogin')
    //     })
    //     .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.log(errorMessage)
    //         // ..
    //       })
    // }

    return (
        <ImageBackground source={image} resizeMode = 'cover' style={styles.image}>
            <View style = {styles.container}> 
                    <Text style = {styles.title}> Hello, </Text>
                    <Text style = {styles.title}> Evan Wijaya </Text>
            </View>

            <View style = {styles.signInOptions}>
                <TouchableOpacity
                        style={styles.button}
                        onPress={() => console.log("Button pressed")}
                    >
                    <Image
                    source={require('../assets/pictures/nearby.png')}
                    style={styles.icons}
                    />
                </TouchableOpacity> 

                <TouchableOpacity
                        style={styles.button}
                        onPress={() => console.log("Button pressed")}
                    >
                    <Image
                    source={require('../assets/pictures/expenses.png')}
                    style={styles.icons}
                    />
                </TouchableOpacity> 
            </View>

            <View style = {styles.UpcomingEvents}> 
                    <Text style = {styles.title}> Up-coming Events: </Text>
            </View>

        </ImageBackground>
    )

}


const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginBottom: 50,
        width: '80%'
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 28,
    },
    image: {
        flex: 1,
        alignItems: 'center',
    },
    button: {

    },
    signInOptions: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-evenly' , // Add equal spacing between buttons
        width: '100%', // Take full width of the container      
    },
    icons: {
        width: 170,
        height: 170,
        resizeMode: 'cover',
    },
    UpcomingEvents: {
        marginTop: 190,
        marginBottom: 50,
        width: '80%'
    }
})