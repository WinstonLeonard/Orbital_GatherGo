import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc} from "firebase/firestore"; 

export default function Uploadpfp({navigation}) {

    const [pfp, setPfp] = useState(require('../assets/pictures/Upload profile pic logo.png'));

    const next = () => {
        console.log('next');
    }
  

    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>


            <Text style = {styles.header}> Upload a profile picture </Text>


            <View style = {styles.imageContainer}>
            <Image source = {require('../assets/pictures/new profile pic logo.png')}
                    style = {styles.imageStyle}
                    resizeMode='contain'
                   ></Image> 
            </View>


            <CustomButton text = 'Skip for now' 
                          buttonColor = '#39A5BD' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {next}></CustomButton>

            <CustomButton text = 'Next' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {next}></CustomButton>


        </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: 'white',
      },
    header: {
        fontFamily: "Nunito-Sans-Bold",
        fontSize: 24,
        paddingTop: 100,

    },
    imageContainer: {
        marginTop: 10,
        backgroundColor: 'red',
        marginBottom: 10,
    },
    imageStyle: {
        width: 300,
        height: 400,
    },
      buttonContainer: {
        position: 'absolute',
        bottom: 70,
      }
})