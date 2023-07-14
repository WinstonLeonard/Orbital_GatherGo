import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc} from "firebase/firestore"; 
import { StatusBar } from "expo-status-bar";


export default function NamePage({navigation}) {

    const [name, setName] = useState('');

    const next = () => {
        const docID = authentication.currentUser.uid;
        const userRef = doc(db, 'users', docID);

        if (name == '') {
            Alert.alert('Error!', 'You have not specified your name yet.', 
            [{text: 'Understood.'}])
        } else {
            setDoc(userRef, {
                name: name,
            }, { merge: true });

            setDoc(userRef, {
                friendRequestList: [],
            }, { merge: true });

            setDoc(userRef, {
                friendList: [],
            }, { merge: true });

            setDoc(userRef, {
                eventInvitations: [],
            }, { merge: true });

            setDoc(userRef, {
                upcomingEvents: [],
            }, { merge: true });

            setDoc(userRef, {
                myEvents: [],
            }, { merge: true });

            const geoPoint = { latitude: 33.812511, 
                               longitude: -117.918976};

            setDoc(userRef, {
                location: geoPoint
            }, { merge: true });

            navigation.navigate('UsernamePage')
        }
    }

    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>
        <StatusBar style="auto"/>

            <Text style = {styles.header}> What's your name? </Text>

            <View style = {styles.inputContainer}>

            <TextInput
                style={styles.textInput}
                placeholder="Enter your name..."
                value={name}
                onChangeText={text => setName(text)}>
                
            </TextInput>
            <View style={styles.line} /> 
            
            </View>

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
        marginBottom: 440,
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
})