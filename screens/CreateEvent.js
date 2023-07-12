import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../shared/button';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 
import { Ionicons } from '@expo/vector-icons'; 

//import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function CreateEvent({navigation}) {
    
        
    const next = () => {

        if ( eventName == '' || category == '' || location == '' || dateText == '' || timeText == '' || description == '') {
            Alert.alert('Error!', 'You have not specified all fields yet.', 
            [{text: 'Understood.'}])
        } else {

            const eventData = {
                name: eventName,
                category: category,
                location: location,
                date: dateText,
                time: timeText,
                description: description
              };
            
            navigation.navigate('ChooseParticipants', {eventData: eventData});
        }
    } 
  

    const [eventName, setEventName] = useState('');
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [inputHeight, setInputHeight] = useState(50); 

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
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        let hours = tempDate.getHours().toString().padStart(2, '0'); // Add leading zero to hours
        let minutes = tempDate.getMinutes().toString().padStart(2, '0'); // Add leading zero to minutes
        let fTime = hours + ':' + minutes;
        
        setDateText(fDate);
        setTimeText(fTime);
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);

    }

    const handleDescription = (newText) => {
        setDescription(newText);
      };
    
    const handleContentSizeChange = (event) => {
        const { contentSize } = event.nativeEvent;
        const newInputHeight = contentSize.height;
        setInputHeight(newInputHeight);
    };

    return (
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
    
            <ScrollView
                contentContainerStyle = {styles.container}>

            
            <View style = {styles.formContainer}> 
                <Text style = {styles.title}>Create New Event</Text>
                
                <TextInput
                    style = {styles.inputContainer}
                    placeholder= 'Event Name'
                    value = {eventName}
                    onChangeText = {text => setEventName(text)}
                ></TextInput> 
                
                <SelectList
                    arrowicon={
                        <Text> </Text>
                    }
                    inputStyles = {styles.placeholder}
                    boxStyles= {styles.selectListBox}
                    dropdownStyles={styles.dropdown}
                    search = {false} 
                    setSelected={(val) => setCategory(val)} 
                    data={choices}
                    placeholder='Event Category' 
                    fontFamily='Nunito-Sans-Bold'
                    alignItems= 'center'
                    save="value"/>

                <View style = {styles.inputContainer}>                    
                    <Ionicons name="location-sharp" size={24} color="black" />
                    <TextInput
                        style = {styles.textInput}
                        placeholder= 'Add location'
                        value = {location}
                        onChangeText = {text => setLocation(text)}
                    >    
                    </TextInput> 
                </View>
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
                    styles = {styles.inputContainer}
                /> */}
                
                <TouchableOpacity 
                    style = {styles.datePicker} 
                    onPress = {() => showMode('date')}>
                    <Ionicons name="ios-calendar-sharp" size={22} color="black" />
                    <Text style = {styles.textInput}>
                        {dateText}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style = {styles.datePicker} 
                    onPress = {() => showMode('time')}>
                    <Ionicons name="time-outline" size={22} color="black" />
                    <Text style = {styles.textInput}>
                        {timeText}
                    </Text>
                </TouchableOpacity>

                <TextInput
                    multiline
                    style={[styles.inputDescription, { height: inputHeight + 8 }]}
                    placeholder='Write a description...'
                    value = {description}
                    onChangeText = {handleDescription}
                    onContentSizeChange={handleContentSizeChange}></TextInput>

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
    formContainer: {
        width: '80%',
        marginBottom: 250
    },
    inputContainer: {
        textAlign: 'left',
        backgroundColor: '#EDF2FB',
        fontFamily: "Nunito-Sans-Bold",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row'
    },
    title: {
        fontFamily: "Nunito-Sans-Bold",
        textAlign: 'left',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 60,
        marginBottom: 40,
        alignSelf: 'center'
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
        backgroundColor: '#EDF2FB',
        borderColor: '#EDF2FB',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
    },
    datePicker: {
        padding: 12,
        backgroundColor: '#EDF2FB',
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    inputDescription: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: '#EDF2FB',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 10,
    },
    textInput: {
        marginLeft: 10,
        fontFamily: "Nunito-Sans-Bold",
        width: 250,
        // backgroundColor: 'red'
    },
    dropdown: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: 'white',
        borderColor: 'white',
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
    }
})