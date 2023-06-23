import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc, query, where, getDocs, } from "firebase/firestore";


export default function UsernamePage({navigation}) {

    const [username, setUsername] = useState('');

    const next = async () => {
        const docID = authentication.currentUser.uid;
        const userRef = doc(db, 'users', docID);

        if (username == '') {
            Alert.alert('Error!', 'You have not specified your username yet.', 
            [{text: 'Understood.'}])
        } else {
            const exists = await searchDocuments('users', 'username', username);
            console.log(exists)
            if (exists) {
                Alert.alert('Error!', 'That username is already taken.', 
                [{text: 'Understood.'}])
            } else {
                setDoc(userRef, {
                    username: username,
                }, { merge: true });
                navigation.navigate('Birthday')
            }
        }
    }

    const searchDocuments = async (collectionPath, field, value) => {
        try {
            const q = query(collection(db, collectionPath), where(field, '==', value));
            const querySnapshot = await getDocs(q);
        
            if (querySnapshot.empty) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            // Handle errors
            console.error('Error searching for documents:', error);
        }
      };

    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>


            <Text style = {styles.header}> Choose a username </Text>

            <View style = {styles.inputContainer}>

            <TextInput
                style={styles.textInput}
                placeholder="Enter your username..."
                value={username}
                onChangeText={text => setUsername(text)}>
                
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