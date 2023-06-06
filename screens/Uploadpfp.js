import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc} from "firebase/firestore"; 

export default function Uploadpfp({navigation}) {

    const [pfp, setPfp] = useState("");

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

            <View style = {styles.inputContainer}>

            
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
    inputContainer: {
        width: 275,
        marginTop: 60,
    },
    textInput: {
        fontFamily: 'Nunito-Sans',
        textAlign: 'center',    
        fontSize: 16,
        paddingVertical: 8,
      },
      line: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'grey',
        elevation: 3, // Adjust the elevation value as needed
      },
      selectListInput: {
        fontSize: 20,
        textAlign: 'justify'
      },
      selectListBox: {
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 3,
        borderRadius: 0,
        borderColor: 'grey',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        zIndex: 1,
      },
      buttonContainer: {
        position: 'absolute',
        bottom: 70,
      }
})