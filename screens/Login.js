import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../shared/button';
import { authentication } from '../firebase/firebase-config';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";


export default function Login({navigation}) {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [inputValue, setInputValue] = useState('')
    const[passwordInputValue, setPasswordInputValue] = useState('')


    const handleSignUp = () => {
        createUserWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setInputValue('')
            setPasswordInputValue('')
            Alert.alert('Account Created', 'Thank you for creating a GatherGo account', 
            [{text: 'Understood.'}])
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('ERROR!', errorMessage, [{text: 'Understood.'}])
            setInputValue('')
            setPasswordInputValue('')
            // ..
          });

    }
    
    const handleLogin = () => {
        signInWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setInputValue('')
            setPasswordInputValue('')
            navigation.navigate("Home")
            // ...
        })
        .catch((error) => {
            setInputValue('')
            setPasswordInputValue('')
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('ERROR!', errorMessage, [{text: 'Understood.'}])
        });
    }

    return (
          <KeyboardAvoidingView
              style = {styles.keyboardAvoidContainer}
              enableOnAndroid = {true}
              keyboardVerticalOffset = {-400}
              behavior = "padding">
            <ScrollView
                contentContainerStyle = {styles.container}>
            <View style = {styles.imageContainer}>
            <Image source = {require('../assets/pictures/GatherGoGreyBG.png')}
                   style = {{
                    height: 300,
                    width: 400,
                    resizeMode: 'contain'
                   }}></Image> 
            </View>
            <View style = {styles.inputContainer}> 
                <TextInput
                    autoComplete = 'email'
                    placeholder= 'Enter your email'
                    value = {inputValue}
                    onChangeText = {text => {setEmail(text)
                                             setInputValue(text)}}
                    style = {styles.input}
                ></TextInput> 
                
                <TextInput
                    placeholder= 'Password'
                    value = {passwordInputValue}
                    onChangeText = {text => {setPassword(text)
                                             setPasswordInputValue(text)}}
                    style = {styles.input}
                    secureTextEntry
                ></TextInput> 
            </View>

            <CustomButton text = 'Login' onPress = {handleLogin}></CustomButton>
            <CustomButton text = 'Sign Up' onPress = {handleSignUp}></CustomButton>
        </ScrollView>
        </KeyboardAvoidingView>
    )

}


const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start', //center',
        alignItems: 'center',
        backgroundColor: '#2f2e2f',
    },
    imageContainer: {
        marginTop: 80,
        //backgroundColor: 'red',
        marginBottom: 60,
    },
    content: {  
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        textAlign: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    
})