import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../shared/button';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 

//import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function CreateEvent({navigation}) {
    
        
    const next = () => {

        if ( eventName == '' || category == '' || location == '' || dateText == '' || timeText == '' ) {
            Alert.alert('Error!', 'You have not specified all fields yet.', 
            [{text: 'Understood.'}])
        } else {

            const eventData = {
                name: eventName,
                category: category,
                location: location,
                date: dateText,
                time: timeText,
              };
            
            navigation.navigate('ChooseParticipants', {eventData: eventData});
        }
    } 
  

    const [eventName, setEventName] = useState('');
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState('');

    //selecting a category
    const choices = [
        {key:'1', value:'Sports'},
        {key:'2', value:'Eat'},
        {key:'3', value:'Study'},
        {key:'4', value:'Others'}
    ]

    //selecting a date and time
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Add Date');
    const [timeText, setTimeText] = useState('Add Time');

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        
        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear() ;
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
        setDateText(fDate);
        setTimeText(fTime);
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);

    }
    
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
                
                <Text style = {styles.text}>Please enter the name of the event:</Text>
                <TextInput
                    style = {styles.input}
                    placeholder= 'Event Name'
                    value = {eventName}
                    onChangeText = {text => setEventName(text)}
                ></TextInput> 
                
                <Text style = {styles.text}>Please select the event category:</Text>
                <SelectList
                    arrowicon={
                        <Text> </Text>
                    }
                    inputStyles = {styles.placeholder}
                    boxStyles= {styles.selectListBox}
                    search = {false} 
                    setSelected={(val) => setCategory(val)} 
                    data={choices}
                    placeholder='Event Category' 
                    fontFamily='Nunito-Sans-Bold'
                    alignItems= 'center'
                    save="value"/>

                <Text style = {styles.text}>Please enter the event location:</Text>
                <TextInput
                    style = {styles.input}
                    placeholder= 'Add location'
                    value = {location}
                    onChangeText = {text => setLocation(text)}
                ></TextInput> 
                {/* <GooglePlacesAutocomplete
                    placeholder='Search'
                    fetchDetails = {true}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                        setLocation(details.formatted_address);
                    }}
                    query={{
                        key: "AIzaSyCVTzQ7OPdB-otBcXZiKcZsNOhtjk2lkoU",
                        language: 'en',
                    }}
                    styles = {styles.input}
                /> */}
                
                <Text style = {styles.text}>Please enter the date of the event:</Text>
                <TouchableOpacity 
                    style = {styles.datePicker} 
                    onPress = {() => showMode('date')}
                    placeholder = 'date'>
                    <Text style = {styles.placeholder}>
                        {dateText}
                    </Text>
                </TouchableOpacity>
                
                <Text style = {styles.text}>Please enter the time of the event:</Text>
                <TouchableOpacity 
                    style = {styles.datePicker} 
                    onPress = {() => showMode('time')}
                    placeholder = 'time'>
                    <Text style = {styles.placeholder}>
                        {timeText}
                    </Text>
                </TouchableOpacity>

                {show && 
                    (<DateTimePicker
                    testID = 'dateTimePicker'
                    value = {date}
                    onChange = {onChangeDate}
                    mode = {mode}
                    is24Hour = {true}
                    dispaly ='default'
                />)}

            </View>

            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Choose Participants' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {320}
                            height = {45}
                            fontSize= {18}
                            onPress = {next}
                            ></CustomButton>
            </View>


            </ScrollView>
        </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
        //justifyContent: 'center', (if change scrollview to view)
        //paddingHorizontal: 35
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
        paddingVertical: 10,
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
    text: {
        marginTop: 10,
        fontFamily: "Nunito-Sans-Bold",
    },
    placeholder: {
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
    },
    // textevent: {
    //     marginTop: 60,
    //     fontFamily: "Nunito-Sans-Bold",
    // }
})