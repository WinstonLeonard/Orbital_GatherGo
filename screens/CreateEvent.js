import React, { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from '../shared/button';
import { SelectList } from 'react-native-dropdown-select-list';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


export default function CreateEvent({navigation}) {
    
    const [eventName, setEventName] = useState('');
    const [category, setCategory] = useState("");
    
    const [date, setDate] = useState(new Date(2004, 3, 12));
    const[stringDate, setStringDate] = useState('12 April 2004');

    const [time, setTime] = useState(new Date());
    
    //selecting a gender
    const choices = [
        {key:'1', value:'Sports'},
        {key:'2', value:'Eat'},
        {key:'3', value:'Study'},
    ]

    //selecting a date
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setStringDate(formatDate(currentDate));
      };
    
    const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: false,
    });
    };

    const showDatepicker = () => {
    showMode('date');
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-UK', options);
    };


    
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
                    style = {styles.input}
                    placeholder= 'Event Name'
                    value = {eventName}
                    onChangeText = {text => setEventName(text)}
                ></TextInput> 
                
                <SelectList
                    arrowicon={
                        <Text> </Text>
                    }
                    inputStyles = {styles.selectListInput}
                    boxStyles= {styles.selectListBox}
                    search = {false} 
                    setSelected={(val) => setCategory(val)} 
                    data={choices}
                    placeholder='Event Category' 
                    fontFamily='Nunito-Sans-Bold'
                    alignItems= 'center'
                    save="value"/>

                <TextInput
                    placeholder= 'Location'
                    //value = {inputValue}
                    onChangeText = {text => {setEmail(text)
                                            setInputValue(text)}}
                    style = {styles.input}
                ></TextInput> 
                
                <TouchableOpacity style = {styles.datePicker} onPress = {showDatepicker}>
                    <Text style = {styles.selectListInput}>Date</Text>
                </TouchableOpacity>
                
                
                <TouchableOpacity style = {styles.datePicker} onPress = {showDatepicker}>
                    <Text style = {styles.selectListInput}>Time</Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Choose Attendees' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {320}
                            height = {45}
                            fontSize= {18}
                            //onPress = {handleLogin}
                            ></CustomButton>
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
    inputContainer: {
        width: '80%',
        marginBottom: 250
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
    selectListInput: {
        fontWeight: 50,
        color: '#bbbebf',
        fontFamily: "Nunito-Sans-Bold",
    },
    selectListBox: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: 'white',
        borderColor: 'white',
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
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
    },
    datePicker: {
        padding: 12,
        backgroundColor: 'white',
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
          width: 1, 
          height: 2,
        },
        paddingHorizontal: 10,
    }
})