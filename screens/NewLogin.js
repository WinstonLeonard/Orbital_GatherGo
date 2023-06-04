import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../shared/button';
import { authentication } from '../firebase/firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";


export default function NewLogin({navigation}) {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [inputValue, setInputValue] = useState('')
    const[passwordInputValue, setPasswordInputValue] = useState('')

    
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

    const handleNewAcc = () => navigation.navigate('SignUp')
    
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
                <Text style = {styles.login}>Login</Text>
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
            
            <CustomButton text = 'Login' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {320}
                          height = {45}
                          fontSize= {18}
                          onPress = {handleLogin}></CustomButton>
            
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

            <View style = {styles.createAcc}>
                <CustomButton text = 'Create Account' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {120}
                          height = {35}
                          fontSize = {12}
                          onPress = {handleNewAcc}></CustomButton>
                <CustomButton text = 'Forgot Password?' 
                          buttonColor = 'white' 
                          textColor = '#2F2E2F'
                          cornerRadius= {10} 
                          width = {120}
                          height = {35}
                          fontSize = {12}
                          onPress = {() => console.log("forgot password button pressed")}></CustomButton>
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
        shadowOpacity: 0.3, 
        shadowRadius: 5, 
        shadowOffset: {
          width: 2, 
          height: 4,
        },
        paddingHorizontal: 10,
    },
    login: {
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
        shadowOpacity: 0.3, 
        shadowRadius: 5, 
        shadowOffset: {
          width: 1, 
          height: 2,
        },
        paddingHorizontal: 10,
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    createAcc: {
        marginTop: 90,
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-evenly' , // Add equal spacing between buttons
        width: '80%', // Take full width of the container      
    },
})