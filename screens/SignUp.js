import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../shared/button';
import { authentication } from '../firebase/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function SignUp({navigation}) {
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
            navigation.navigate('NamePage');
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

    const handleBackToLogin = () => navigation.navigate('NewLogin')

    return (
          <KeyboardAvoidingView
              style = {styles.keyboardAvoidContainer}
              enableOnAndroid = {true}
              keyboardVerticalOffset = {-400}
              behavior = "padding">
            <ScrollView
                contentContainerStyle = {styles.container}>
            <View style = {styles.imageContainer}>
            <Image source = {require('../assets/pictures/GatherGoWhiteBG.png')}
                   style = {{
                    height: 146,
                    width: 229,
                    resizeMode: 'contain'
                   }}></Image> 
            </View>
            <View style = {styles.inputContainer}> 
                <Text style = {styles.signup}>Sign Up</Text>
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

            <CustomButton text = 'Sign Up' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {320}
                          height = {45}
                          fontSize= {18}
                          onPress = {handleSignUp}></CustomButton>
            
            <Text style = {styles.text}>-------- or sign in with --------</Text>

            <View style = {styles.signInOptions}>
                <TouchableOpacity
                        style={styles.button}
                        onPress={() => console.log("Button pressed")}
                    >
                    <Image
                    source={require('../assets/pictures/google.png')}
                    style={styles.image}
                    />
                </TouchableOpacity> 

                <TouchableOpacity
                        style={styles.button}
                        onPress={() => console.log("Button pressed")}
                    >
                    <Image
                        source={require('../assets/pictures/facebook.png')}
                        style={styles.image}
                    />
                </TouchableOpacity> 
            </View>
            <View style = {styles.backtologin}>
                <CustomButton text = 'Already have an account?' 
                        buttonColor = 'white' 
                        textColor = '#2F2E2F'
                        cornerRadius= {10} 
                        width = {300}
                        height = {35}
                        fontSize = {18}
                        onPress = {handleBackToLogin}></CustomButton>
            </View>
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
        backgroundColor: 'white',
    },
    imageContainer: {
        marginTop: 100,
        //backgroundColor: 'red',
        marginBottom: 55,
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        ...Platform.select({
            android: {
              elevation: 2,
            },
            ios: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
            },
        }),
        paddingHorizontal: 10,
    },
    signup: {
        fontFamily: "Nunito-Sans-Bold",
        textAlign: 'left',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 25,
    },
    text: {
        marginTop: 20, 
        marginBottom: 30,
        fontFamily: "Nunito-Sans-Bold"
    },
    signInOptions: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-evenly' , // Add equal spacing between buttons
        width: '50%', // Take full width of the container      
    },
    button: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        ...Platform.select({
            android: {
              elevation: 2,
            },
            ios: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
            },
        }),
        paddingHorizontal: 10,
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    backtologin: {
        marginTop: 60
    }
})