import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomButton from '../shared/button';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authentication, db } from '../firebase/firebase-config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';


export default function EditEvent({navigation, route}) {
    
    const {eventID} = route.params;
    const [eventName, setEventName] = useState('');
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [inputHeight, setInputHeight] = useState(50); 

    const choices = [
        {key:'1', value:'Sports'},
        {key:'2', value:'Eat'},
        {key:'3', value:'Study'},
        {key:'4', value:'Others'}
    ]
    
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Add Date');
    const [timeText, setTimeText] = useState('Add Time');
    const [isLoading, setIsLoading] = useState(true);
    const [alreadyInvited, setAlreadyInvited] = useState([]);
    const [notYetInvited, setNotYetInvited] = useState([]);
    const [myFriendList, setMyFriendList] = useState([]);

    //fetching the data
    useFocusEffect(
    React.useCallback(() => {
        const fetchData = async () => {
            const docPromise = getDoc(doc(db, "events", eventID));

            const [docSnapshot] = await Promise.all([docPromise]);

            const eventData = docSnapshot.data();
            setEventName(eventData.name);
            setCategory(eventData.category);
            setLocation(eventData.location);
            setDateText(eventData.date);
            setTimeText(eventData.time);
            setDescription(eventData.description);

        };
        fetchData();
        setIsLoading(false);
    }, []));

    //fetching event participants
    useFocusEffect(
    React.useCallback(() => {
        async function fetchFriendData() {
            //getting friends list
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
            const myData = myDocSnap.data();
            setMyFriendList(myData.friendList);
            
            //getting already invited
            const docPromise = getDoc(doc(db, "events", eventID));

            const [docSnapshot] = await Promise.all([docPromise]);

            const eventData = docSnapshot.data();
            setAlreadyInvited(eventData.invitationList);

        }
        fetchFriendData();
    },[]));

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }

    //change date
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

    //updating events
    const update = () => {
        console.log('update');
        console.log(eventName);
        console.log(category);
        console.log(location);
        console.log(dateText);
        console.log(timeText);

        const docRef = doc(db, 'events', eventID);
        
        setDoc(docRef, {
            name: eventName,
            category: category,
            location: location,
            date: dateText,
            time: timeText,
            description: description,
        }, { merge: true });

        navigation.pop();
    }

    const updateParticipants = () => {
        const eventData = {
            eventID: eventID,
            notYetInvited: myFriendList.filter((friendUid) => !alreadyInvited.includes(friendUid)),
            alreadyInvited: alreadyInvited,
        }
        navigation.navigate('UpdateParticipants', {eventData: eventData})
    }

    return (
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
    
            <ScrollView
                contentContainerStyle = {styles.container}>

            <View style = {styles.formContainer}> 
                <Text style = {styles.title}>Edit Event</Text>

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
                    search = {false} 
                    setSelected={(val) => setCategory(val)} 
                    data={choices}
                    placeholder= {category} 
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
                    onContentSizeChange={handleContentSizeChange}
                    ></TextInput>

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
            <CustomButton text = 'Update Participants' 
                    buttonColor = '#39A5BD' 
                    textColor = 'white'
                    cornerRadius= {10} 
                    width = {320}
                    height = {45}
                    fontSize= {18}
                    onPress = {updateParticipants}
                    ></CustomButton>

            <CustomButton text = 'Update' 
                    buttonColor = '#2F2E2F' 
                    textColor = 'white'
                    cornerRadius= {10} 
                    width = {320}
                    height = {45}
                    fontSize= {18}
                    onPress = {update}
                    ></CustomButton>
            </View>


            </ScrollView>
        </KeyboardAvoidingView>
    );

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
    }
})