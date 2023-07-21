import React, {useEffect, useState} from 'react';
import { View, FlatList, Modal, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list';
import { authentication, db } from '../firebase/firebase-config';
import CustomButton from './button';
import { useFocusEffect } from '@react-navigation/native';

export default function SplitBillPopUp({ modalVisible, closeModal, navigation }) {

    const [myEvents, setMyEvents] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [event, setEvent] = useState([]);
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            setCategory('');
            setLocation('');
            setEventDate('');
        }
    }, [modalVisible]);

    //retrieve events data
    useEffect(() => {
        async function fetchData() {
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
    
            const myData = myDocSnap.data();
            const myEvents = myData.myEvents;
            const upcomingEvents = myData.upcomingEvents;
            const otherEvents = upcomingEvents.filter(item => !myEvents.includes(item));

            setMyEvents(myEvents);
        }
        fetchData();
    },[]);

    //create key-value pair of events
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < myEvents.length; i++) {
                const eventID = myEvents[i];

                const docPromise = getDoc(doc(db, "events", eventID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const eventData = docSnapshot.data();
                const eventName = eventData.name;
                
                const object = {
                    key: eventID,
                    value: eventName,
                };
                
                temp.push(object);
            }

            setEventData(temp);
            setIsLoading(false);
        };
    
        fetchData();
    }, [myEvents]);
 
    const updateInfo = async () => {
            const docPromise = getDoc(doc(db, "events", event));
            const [docSnapshot] = await Promise.all([docPromise]);
            const eventData = docSnapshot.data();
            const eventDate = eventData.date;
            const eventTime = eventData.time;
            setCategory(eventData.category);
            setLocation(eventData.location);
            const formattedDate = formatDate(eventDate, eventTime);
            setEventDate(formattedDate);
            
    }

    function formatDate(dateString, time) {
        const [day, month, year] = dateString.split('/').map(Number);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-UK', options);
        return formattedDate + " at " + time;
        
    }

    useEffect(() => {
        if (event && isDataLoaded) {
            updateInfo();
        }
    }, [event, isDataLoaded]);

    const next = () => {
        navigation.navigate('CreateSplitBill', {eventID: event});
        closeModal();
    }

    return (
    <Modal visible={modalVisible} onRequestClose={closeModal} transparent = {true} animationType='fade'>
        <View style={styles.container}>
        <View style = {styles.modalContent}>
            
            <View style = {styles.header}>
                <Text style = {styles.headerText}>Create Split Bill</Text>
            </View>
            <ScrollView>
            <SelectList
                arrowicon={
                    <Text> </Text>
                }
                inputStyles = {styles.placeholder}
                boxStyles= {styles.selectListBox}
                dropdownStyles={styles.dropdown}
                search = {false} 
                setSelected={(val) => {
                    setEvent(val);
                    setIsDataLoaded(true);
                }} 
                data={eventData}
                placeholder='Event Category' 
                fontFamily='Nunito-Sans-Bold'
                alignItems= 'center'
                save="key"/>
            
            <Text style={styles.subtitle}>Event Information:</Text>
            <Text style={styles.text}>Category: {category}</Text>
            <Text style={styles.text}>Location: {location}</Text>
            <Text style={styles.text}>Date and time: {eventDate}</Text>

            <CustomButton text = 'Create Bill' 
                            buttonColor = 'black' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {330}
                            height = {45}
                            fontSize= {18}
                            onPress = {next}
                            ></CustomButton>
            </ScrollView>
        </View>
        </View>
    </Modal>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
    },
    modalContent: {
        width: '100%', // Adjust the width as needed
        height: '40%', // Adjust the height as needed
        backgroundColor: 'white', // Modal background color
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        width: 330,
        justifyContent: 'center'
    },
    dropdown: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 10,
        marginTop: 5,
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
    header: {
        backgroundColor: '#39A5BD',
        width: '100%',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Nunito-Sans-Bold',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Nunito-Sans-Bold',
        flex: 1,
        fontWeight: 'bold',
        marginTop: 10
    },
    text: {
        fontSize: 16,
        fontFamily: 'Nunito-Sans-Bold',
        flex: 1,
        fontWeight: 'bold',
        color: 'grey',
        marginTop: 5,
    }
});
