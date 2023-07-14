import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import UpcomingEventsBox from '../shared/upcomingEventsBox';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 
import OtherEventsBox from '../shared/OtherEventsBox';


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

    function deleteMyEvent(eventID, host, eventParticipants, pendingInvites) {
        //Deletes the event from the creator's myEvents array and upcomingEvents array inside firestore
        async function deleteEventFromHost() {
            const docRef = doc(db, "users", host);
            const docSnap = await getDoc(docRef);
        
            const data = docSnap.data();
            const hostMyEvents = data.myEvents;
            const hostUpcomingEvents = data.upcomingEvents;
        
            const updatedHostMyEvents = hostMyEvents.filter(item => item != eventID);
            const updatedHostUpcomingEvents = hostUpcomingEvents.filter(item => item != eventID);

            setDoc(docRef, {
              myEvents: updatedHostMyEvents,
            }, { merge: true });
        
            setDoc(docRef, {
              upcomingEvents: updatedHostUpcomingEvents,
            }, { merge: true });

            setMyEvents(updatedHostMyEvents);
        }

        //deletes the event from all the participants' upcomingEvents inside firestore
        async function deleteEventFromParticipants() {
            console.log(eventParticipants);
            for (let i = 0; i < eventParticipants.length; i++) {
                const participant = eventParticipants[i];
                const docRef = doc(db, "users", participant);
                const docSnap = await getDoc(docRef);
        
                const data = docSnap.data();
                const participantUpcomingEvents = data.upcomingEvents;
                const updatedParticipantUpcomingEvents = participantUpcomingEvents.filter(item => item != eventID);
                
                setDoc(docRef, {
                    upcomingEvents: updatedParticipantUpcomingEvents,
                }, { merge: true });
            }
        }

        //deletes the event from a user's eventInvitations if they have not accepted it yet. 
        async function deleteEventFromPendingInvites() {
            console.log(pendingInvites);
            for (let i = 0; i < pendingInvites.length; i++) {
                const pendingInvitee = pendingInvites[i];
                const docRef = doc(db, "users", pendingInvitee);
                const docSnap = await getDoc(docRef)

                const data = docSnap.data();
                const pendingEventInvitations = data.eventInvitations;
                const updatedPendingEventInvitations = pendingEventInvitations.filter(item => item != eventID);

                setDoc(docRef, {
                    eventInvitations: updatedPendingEventInvitations,
                }, { merge: true });
            }
        }

        // event itself is deleted inside firestore
        async function deleteEventItself() {
            const docRef = doc(collection(db, "events"), eventID);
            deleteDoc(docRef)
            .then(() => {
                console.log(eventID + " successfully deleted!");
            })
        }

        deleteEventFromHost();
        deleteEventFromParticipants();
        deleteEventFromPendingInvites();
        deleteEventItself();
    }

    function deleteOtherEvent(eventID) {
        //Deletes the event from the user's upcoming events
        async function deleteFromUpcomingEvents() {
            const user = authentication.currentUser.uid;
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef)

            const data = docSnap.data();
            const userUpcomingEvents = data.upcomingEvents;
            const userMyEvents = data.myEvents;
            const updatedUserUpcomingEvents = userUpcomingEvents.filter(item => item != eventID);
            const otherEvents = updatedUserUpcomingEvents.filter(item => !userMyEvents.includes(item));
            setOtherEvents(otherEvents);
            setDoc(docRef, {
                upcomingEvents: updatedUserUpcomingEvents,
            }, { merge: true });
        }
        //Deletes the user from the event's participants in firestore    
        async function deleteUserFromParticipants() {
            const user = authentication.currentUser.uid;
            const docRef = doc(db, "events", eventID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            const eventParticipants = data.participants;
            const eventInvitationList = data.invitationList;
            const updatedEventParticipants = eventParticipants.filter(item => item != user);
            const updatedEventInvitationList = eventInvitationList.filter(item => item != user);
            setDoc(docRef, {
                participants: updatedEventParticipants,
                invitationList: updatedEventInvitationList,
            }, { merge: true });
        }
        deleteFromUpcomingEvents();
        deleteUserFromParticipants();
    } 

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

    if (myEventsPressed) {
        return (
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
            <View style={styles.eventsContainer}> 
                {data.length === 0 ? (
                <Text style={styles.noEventsText}>No Events Hosted</Text>
                ) : (
                <FlatList
                    data={data.sort((a, b) => {
                    const dateComparison = a.date.localeCompare(b.date);
                    if (dateComparison !== 0) {
                        return dateComparison;
                    } else {
                        const timeA = new Date(`1970-01-01T${a.time}`);
                        const timeB = new Date(`1970-01-01T${b.time}`);
                        return timeA - timeB;
                    }
                    })}
                    renderItem={({item}) => (
                    <UpcomingEventsBox
                        name={item.name}
                        category={item.category}
                        location={item.location}
                        date={item.date}
                        time={item.time}
                        eventID={item.eventID}
                        navigation={navigation}
                        deleteFunction={deleteMyEvent}
                    />    
                    )}
                />
                )}
            </View>

            <View style = {styles.buttonContainer}>
                <ToggleMyEvents></ToggleMyEvents>
                <ToggleOtherEvents></ToggleOtherEvents>
            </View>
        </View>
        )
    } else {
        return(            
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
                    {data.length === 0 ? (
                    <Text style={styles.noEventsText}>No Upcoming Events</Text>
                    ) : (
                    <FlatList
                        data={data.sort((a, b) => {
                        const dateComparison = a.date.localeCompare(b.date);
                    
                        if (dateComparison !== 0) {
                          return dateComparison;
                        } else {
                          const timeA = new Date(`1970-01-01T${a.time}`);
                          const timeB = new Date(`1970-01-01T${b.time}`);
                          
                          return timeA - timeB;
                        }
                        })}
                        renderItem= {({item}) => (
                        <OtherEventsBox
                            name = {item.name}
                            category = {item.category}
                            location = {item.location}
                            date = {item.date}
                            time = {item.time}
                            eventID = {item.eventID}
                            deleteFunction = {deleteOtherEvent}
                        />    
                )}/>
                )}
                </View >
    
                <View style = {styles.buttonContainer}>
                    <ToggleMyEvents></ToggleMyEvents>
                    <ToggleOtherEvents></ToggleOtherEvents>
                </View>
            </View>
        )
    }
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
        backgroundColor: '#39A5BD',
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
      },
      noEventsText: {
        fontFamily: "Nunito-Sans-Bold",
        alignSelf: 'center',
        color: '#2F2E2F',
        fontSize: 18,
        marginTop: 40,
        color: 'grey'
        //textAlign: 'center',
      },
})

