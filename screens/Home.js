import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { collection, doc, getDoc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import CustomButton from '../shared/button';
import { onAuthStateChanged } from "firebase/auth";
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { StatusBar } from "expo-status-bar";
import HomeUpcomingEvents from '../shared/HomeUpcomingEvents';
import { LogBox } from 'react-native';
import { useData } from '../shared/DataContext';


export default function  Home({navigation}) {
    LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

    const image = require("../assets/pictures/HomescreenBackground.png")

    const [username, setUsername] = useState('')
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const flatListRef = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const { setNotificationCount } = useData();
    const {setFriendRequestCount} = useData();

    const nearbyHandler = () => {
        navigation.navigate('Nearby');
    }

    const expensesHandler = () => {
        navigation.navigate('Expenses');
    }
    
    onAuthStateChanged(authentication, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          // ...
        } else {
            navigation.reset({
                index: 0, // Index of the screen to reset to
                routes: [{ name: 'NewLogin' }], // Array of screen objects to set as the new stack
            });
      
          // User is signed out
          // ...
        }
    });

    async function getUsername() {
        const docID = authentication.currentUser.uid;
        const docRef = doc(db, "users", docID);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();
        setUsername(data.username);  
    }

    async function getUpcomingEvents() {
        setRefreshKey(prevKey => prevKey + 1);
        const docID = authentication.currentUser.uid;
        const docRef = doc(db, "users", docID);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();
        setNotificationCount(data.eventInvitations.length);
        setFriendRequestCount(data.friendRequestList.length);   
        const upcomingEvents = data.upcomingEvents;
        const upcomingEventsInAWeek = [];

        for (let i = 0; i < upcomingEvents.length; i++) {
            const currentDate = new Date();
            const eventID = upcomingEvents[i];
            const eventRef = doc(db, "events", eventID);
            const eventDocSnap = await getDoc(eventRef);

            const eventData = eventDocSnap.data();
            const eventDate = eventData.date;
            const eventTime = eventData.time;

            function formatDate(stringDate, stringTime) {
                const dateString = stringDate;
                const timeString = stringTime;
                const [day, month, year] = dateString.split('/');
                const [hours, minutes] = timeString.split(':');
                const dateObject = new Date(year, month - 1, day, hours, minutes);
                return dateObject;
            }

            const dateObject = formatDate(eventDate, eventTime);
            const timeDifference = dateObject - currentDate;
            if (dateObject >= currentDate && timeDifference <= 604800000) {
                const object = {
                    key: i,
                    eventID: eventID,
                    date: dateObject
                }
                upcomingEventsInAWeek.push(object);
            }

        }
        setUpcomingEvents(upcomingEventsInAWeek);
    }
    
    useEffect(() => {
        getUsername();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const currentTime = new Date();

            async function getTimeAndLocation() {
                await getUsername();
                const docID = authentication.currentUser.uid;
                const userRef = doc(db, 'users', docID);

                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
        
                let location = await Location.getCurrentPositionAsync({});

                const geoPoint = { latitude: location.coords.latitude, 
                                   longitude: location.coords.longitude };
                setDoc(userRef, {
                    location: geoPoint,
                    lastOnline : currentTime,
                }, { merge: true });
            };
            getUpcomingEvents();
            getTimeAndLocation();
        }, [])
    );

    function emptyData() {
        return (
            <View style = {styles.noEventsContainer}>
                <Text style = {styles.noEventsText}>No Upcoming Events...</Text>
            </View>
        )
    }

    return (
        <ImageBackground source={image} resizeMode = 'cover' style={styles.image}>
            <StatusBar style="auto"/>
            <View style = {styles.container}> 
                    <Text style = {styles.title}> Hello, </Text>
                    <Text style = {styles.title}> {username} </Text>
            </View>

            <View style = {styles.signInOptions}>
                <TouchableOpacity
                        onPress={nearbyHandler}
                    >
                    <Image
                    source={require('../assets/pictures/nearby.png')}
                    style={styles.icons}
                    />
                </TouchableOpacity> 

                <TouchableOpacity
                        onPress={expensesHandler}
                    >
                    <Image
                    source={require('../assets/pictures/expenses.png')}
                    style={styles.icons}
                    />
                </TouchableOpacity> 
            </View>

            <View style = {styles.UpcomingEvents}> 
                    <Text style = {styles.title}> Events In The Next 7 Days: </Text>
            </View>

            <View style = {styles.eventsContainer}>
            <FlatList
                ref = {flatListRef}
                data = {upcomingEvents
                        .sort((a,b) => {
                            if (a.date < b.date) {
                                return -1;
                            } else if (b.date > a.date) {
                                return 1;
                            } else if (a.date === b.date) {
                                return 0;
                            }
                        })}
                horizontal = {true}
                decelerationRate="fast"
                snapToInterval={310}
                renderItem= {({item}) => (
                    <HomeUpcomingEvents
                        key={refreshKey}
                        eventID = {item.eventID}
                    />
            )}
                ListEmptyComponent = {emptyData}
                />
            </View>
            
        </ImageBackground>
    )

}


const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginBottom: 50,
        width: '80%'
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
    },
    image: {
        flex: 1,
        alignItems: 'center',
    },
    signInOptions: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-evenly' , // Add equal spacing between buttons
        width: '100%', // Take full width of the container      
    },
    icons: {
        width: 170,
        height: 170,
        resizeMode: 'cover',
    },
    UpcomingEvents: {
        marginTop: 170,
        marginBottom: 15,
        width: '80%'
    },
    users: {
        width: 310,
        height: 140,
        backgroundColor: '#AEE9F6',
        borderRadius: 15
    },
    dummy: {
        marginTop: 20,
        marginLeft: 10,
    },
    eventsContainer: {
        width: 310,
        height: 140,
        //backgroundColor: '#AEE9F6',
        borderRadius: 15,
        justifyContent: 'center',
    },
    noEventsContainer: {
        width: 310,
        height: 140,
        backgroundColor: '#AEE9F6',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noEventsText: {
        fontFamily: 'Nunito-Sans-Bold',
        color: 'grey',
        fontSize: 20,
    }
})