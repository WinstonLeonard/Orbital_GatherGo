import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { SelectList } from 'react-native-dropdown-select-list'
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc} from "firebase/firestore"; 

export default function Gender({navigation}) {

    const [gender, setGender] = useState("");

    const choices = [
        {key:'1', value:'Male'},
        {key:'2', value:'Female'},
        {key:'3', value:'Prefer Not To Say'},
    ]

    const next = () => {
        const docID = authentication.currentUser.uid;
        const userRef = doc(db, 'users', docID);
  
        if (gender == '') {
            Alert.alert('Error!', 'You have not specified your gender yet.', 
            [{text: 'Understood.'}])
        } else {
            setDoc(userRef, {
                gender: gender,
            }, { merge: true });
            navigation.navigate('Uploadpfp')
        }
    }
  

    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>


            <Text style = {styles.header}> What's your gender? </Text>

            <View style = {styles.inputContainer}>

            <SelectList
                arrowicon={
                    <Text> </Text>
                }
                inputStyles = {styles.selectListInput}
                boxStyles= {styles.selectListBox}
                search = {false} 
                setSelected={(val) => setGender(val)} 
                data={choices}
                placeholder='Choose your gender' 
                fontFamily='Nunito-Sans-Bold'
                alignItems= 'center'
                save="value"/>
            
            </View>

            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Next' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {next}></CustomButton>
            </View>


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