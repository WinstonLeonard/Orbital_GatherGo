import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import UpcomingEventsBox from '../shared/upcomingEventsBox';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 

export default function Events({navigation}) {

    const [data, setData] = useState([]);
    const [myEventsPressed, setMyEventsPressed] = useState(true);
    const [otherEventsPressed, setOtherEventsPressed] = useState(false)
    const [myEvents, setMyEvents] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [myEventsObject, setMyEventsObject] = useState([]);
    const [otherEventsObject, setOtherEventsObject] = useState([]);

    const [searchEvent, setSearchEvent] = useState('');
    const [filteredMyEvents, setFilteredMyEvents] = useState([]);
    const [filteredOtherEvents, setFilteredOtherEvents] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const ToggleMyEvents = () => {
        const handlePressIn = () => {
            if (myEventsPressed) {
                setSearchEvent('');
                setIsSearchActive(false);
                return;
            } else {
                setMyEventsPressed(!myEventsPressed);
                setOtherEventsPressed(!otherEventsPressed);
                setSearchEvent('');
                setIsSearchActive(false);
            }
        };
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePressIn}
            style={[styles.button, myEventsPressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>My Events</Text>
          </TouchableOpacity>
        );
    };

    const ToggleOtherEvents = () => {
        const handlePressIn = () => {
            if (otherEventsPressed) {
                setSearchEvent('');
                setIsSearchActive(false);
                return;
            } else {
                setMyEventsPressed(!myEventsPressed);
                setOtherEventsPressed(!otherEventsPressed);
                setSearchEvent('');
                setIsSearchActive(false);
            }
        };
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePressIn}
            style={[styles.button, otherEventsPressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Other Events</Text>
          </TouchableOpacity>
        );
    };

    const searchHandler = () => {
        console.log(searchEvent);
        setIsSearchActive(true);
        const filteredMyEvents = myEventsObject.filter((object) => object.name.includes(searchEvent));
        const filteredOtherEvents = otherEventsObject.filter((object) => object.name.includes(searchEvent));
        console.log(filteredMyEvents);
        console.log(filteredOtherEvents);
        setFilteredMyEvents(filteredMyEvents);
        setFilteredOtherEvents(filteredOtherEvents);
    }
    
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const myDocID = authentication.currentUser.uid;
                const myDocRef = doc(db, "users", myDocID);
                const myDocSnap = await getDoc(myDocRef);
        
                const myData = myDocSnap.data();
                const myEvents = myData.myEvents;
                const upcomingEvents = myData.upcomingEvents;
                const otherEvents = upcomingEvents.filter(item => !myEvents.includes(item));

                setMyEvents(myEvents);
                setOtherEvents(otherEvents);
                setIsSearchActive(false);
            }
            fetchData();
        },[])
    );
    
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
            for (let i = 0; i < myEvents.length; i++) {
                const eventID = myEvents[i];

                const docPromise = getDoc(doc(db, "events", eventID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const eventData = docSnapshot.data();
                const eventName = eventData.name;
                const eventCategory = eventData.category;
                const eventLocation = eventData.location;
                const eventDate = eventData.date;
                const eventTime = eventData.time;

                const object = {
                    name : eventName,
                    category : eventCategory,
                    location : eventLocation,
                    date : eventDate,
                    time : eventTime,
                    eventID: eventID,
                };
                temp.push(object);
            }
            setMyEventsObject(temp);
        };
        fetchData();
    }, [myEvents]);

    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
            for (let i = 0; i < otherEvents.length; i++) {
                const eventID = otherEvents[i];

                const docPromise = getDoc(doc(db, "events", eventID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const eventData = docSnapshot.data();
                const eventName = eventData.name;
                const eventCategory = eventData.category;
                const eventLocation = eventData.location;
                const eventDate = eventData.date;
                const eventTime = eventData.time;

                const object = {
                    name : eventName,
                    category : eventCategory,
                    location : eventLocation,
                    date : eventDate,
                    time : eventTime,
                    eventID: eventID,
                };
                temp.push(object);
            }
            setOtherEventsObject(temp);
        };
        fetchData();
    }, [otherEvents]);

    useEffect(() => {
        if (myEventsPressed && isSearchActive) {
            setData(filteredMyEvents);
        } else if (myEventsPressed && !isSearchActive) {
            setData(myEventsObject);
        } else if (otherEventsPressed && isSearchActive) {
            setData(filteredOtherEvents);
        } else if (otherEventsPressed && !isSearchActive) {
            setData(otherEventsObject);
        }
    }, [myEventsPressed, myEventsObject, otherEventsObject, filteredMyEvents, filteredOtherEvents]);

    useEffect(() => {
        if (searchEvent == '') {
            if (myEventsPressed) {
                setData(myEventsObject);
            } else {
                setData(otherEventsObject);
            }
        }
    }, [searchEvent]);

    return(
        // <KeyboardAvoidingView 
        // style = {styles.keyboardAvoidContainer}
        // enableOnAndroid = {true}
        // keyboardVerticalOffset = {-400}
        // behavior = "padding">
            
        <View style = {styles.container}>
            <View style = {styles.header}>
                <Text style = {styles.title}>Events</Text>
            </View>
            
            <View style = {styles.input}>
                <TextInput placeholder= 'Search' style = {styles.textInput} value = {searchEvent} onChangeText={(text) => setSearchEvent(text)}/>
                <TouchableOpacity onPress = {searchHandler}>
                    <FontAwesome name="search" size={24} color="black" style = {styles.icon} />
                </TouchableOpacity>
            </View>
            <View style = {styles.eventsContainer}> 
                <FlatList
                data = {data}
                renderItem= {({item}) => (
                    <UpcomingEventsBox
                        name = {item.name}
                        category = {item.category}
                        location = {item.location}
                        date = {item.date}
                        time = {item.time}
                        eventID = {item.eventID}
                    />
            
            )}/>
            </View >

            <View style = {styles.buttonContainer}>
                <ToggleMyEvents></ToggleMyEvents>
                <ToggleOtherEvents></ToggleOtherEvents>
            </View>
        </View>

        // </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#DEF5FF',
    },
    title: {
        fontFamily: "Nunito-Sans-Bold",
        alignSelf: 'center',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 24,
        //textAlign: 'center',
    },
    eventsContainer: {
        width: '100%',
        height: 480,
    },
    input: {
        alignItems: 'center',
        backgroundColor: 'white',
        width: 330,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        color: 'red',
        fontFamily: "Nunito-Sans-Bold",
      },
    icon: {
        marginLeft: 20,
    },
    header: {
        marginTop: 60,
        marginBottom: 25,
        flexDirection: 'row',
        width: 330,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        width: 330,
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 3,
        marginLeft: 10,
      },
      buttonPressed: {
        backgroundColor: '#007AFF',
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
      },
})
