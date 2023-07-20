import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import CustomButton from '../shared/button';
import { authentication } from '../firebase/firebase-config';
import { sendPasswordResetEmail } from "firebase/auth";


export default function ForgotPassword({navigation}) {
    const [email, setEmail] = useState('');

    const backHandler = () => {
        navigation.pop();
    }

    const sendHandler = () => {

        sendPasswordResetEmail(authentication, email)
        .then(() => {
            Alert.alert('Email Sent!', 'Instructions to reset your password has been sent to the given email.', [{text: 'Understood.'}]);
            navigation.pop();
            // Password reset email sent!
            // ..
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('ERROR!', errorMessage, [{text: 'Understood.'}]);
            // ..
        });
    }

    return(
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding"
        >
        <StatusBar style="auto"/>
            <Text style = {styles.title}>Forgot Your Password?</Text>
            <Text style = {styles.bodyText}>Enter your registered email below</Text>
            <Text style = {styles.bodyText}>to receive password reset instruction</Text>

            <Image
                source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Femail%20sent%20icon.jpg?alt=media&token=65b9154e-d833-4ba5-bac1-247477463f45'}}
                style = {styles.imageStyle}
                resizeMode= 'cover'
            />

            <View style = {styles.inputContainer}> 
                <TextInput
                    autoComplete = 'email'
                    placeholder= 'Email Address'
                    value = {email}
                    onChangeText = {text => {setEmail(text)}}
                    style = {styles.input}
                ></TextInput> 

            </View>

            <View style = {styles.textContainer}>
                <Text style = {styles.rmStyle}>Remember Password? </Text>
                <TouchableOpacity onPress={backHandler}>
                    <Text style = {styles.loginStyle}>Login</Text>
                </TouchableOpacity>
            </View>

            <CustomButton text = 'Send' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {50} 
                          width = {330}
                          height = {55}
                          fontSize = {22}
                          onPress = {sendHandler}></CustomButton>
                




        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 24,
        marginBottom: 30,
    },
    bodyText: {
        fontFamily: 'Nunito-Sans-Bold',
        color: 'grey',
    },
    imageStyle: {
        width: 310,
        height: 230,
        marginTop: 30,
        marginBottom: 30,
        //borderColor: 'black',
        //borderWidth: 1,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 35,
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
                elevation: 4,
            },
            ios: {
                shadowOpacity: 0.3, 
                shadowRadius: 5,
            }
        }),
        shadowOffset: {
          width: 2, 
          height: 4,
        },
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: 'row',
        marginBottom: 35,
    },
    rmStyle: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 15,
    },
    loginStyle: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 15,
        color: '#62C7DD'
    }
})