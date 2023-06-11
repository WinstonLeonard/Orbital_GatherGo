import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import CustomButton from '../shared/button';

export default function NewEvent({navigation}) {
    return (
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
    
            <ScrollView
                contentContainerStyle = {styles.container}>

            
            <View style = {styles.inputContainer}> 
                <Text style = {styles.title}>Create New Event</Text>
                <TextInput
                    placeholder= 'Event Name'
                    //value = {inputValue}
                    onChangeText = {text => {setEmail(text)
                                            setInputValue(text)}}
                    style = {styles.input}
                ></TextInput> 
                
                <TextInput
                    placeholder= 'Event Category (drop down)'
                    //value = {passwordInputValue}
                    onChangeText = {text => {setPassword(text)
                                            setPasswordInputValue(text)}}
                    style = {styles.input}
                    secureTextEntry
                ></TextInput> 

                <TextInput
                    placeholder= 'Location'
                    //value = {inputValue}
                    onChangeText = {text => {setEmail(text)
                                            setInputValue(text)}}
                    style = {styles.input}
                ></TextInput> 
                
                <TextInput
                    placeholder= 'Date'
                    //value = {passwordInputValue}
                    onChangeText = {text => {setPassword(text)
                                            setPasswordInputValue(text)}}
                    style = {styles.input}
                    secureTextEntry
                ></TextInput>       

                <TextInput
                    placeholder= 'Time'
                    //value = {passwordInputValue}
                    onChangeText = {text => {setPassword(text)
                                            setPasswordInputValue(text)}}
                    style = {styles.input}
                    secureTextEntry
                ></TextInput> 
            </View>
            
            <CustomButton text = 'Choose Attendees' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {320}
                            height = {45}
                            fontSize= {18}
                            //onPress = {handleLogin}
                            ></CustomButton>
            

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
    inputContainer: {
        width: '80%',
        marginBottom: 220
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
    title: {
        fontFamily: "Nunito-Sans-Bold",
        textAlign: 'left',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 80,
        marginBottom: 25,
    },
})