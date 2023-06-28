import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import UpcomingEventsBox from '../shared/upcomingEventsBox';
import { useFocusEffect } from '@react-navigation/native';

export default function Events({navigation}) {

    const [myUpcomingEvents, setMyUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);


    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const myDocID = authentication.currentUser.uid;
                const myDocRef = doc(db, "users", myDocID);
                const myDocSnap = await getDoc(myDocRef);
        
                const myData = myDocSnap.data();
                setMyUpcomingEvents(myData.upcomingEvents)
            }
            fetchData();
        },[])
    );  

    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < myUpcomingEvents.length; i++) {
                const eventID = myUpcomingEvents[i];

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
    
            setData(temp);
            setIsLoading(false);
        };
    
        fetchData();
    }, [myUpcomingEvents]);

    return(
        // <KeyboardAvoidingView 
        // style = {styles.keyboardAvoidContainer}
        // enableOnAndroid = {true}
        // keyboardVerticalOffset = {-400}
        // behavior = "padding">
            
        <View style = {styles.container}>
            <Text style = {styles.title}>Events</Text>
            
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
        // flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontFamily: "Nunito-Sans-Bold",
        alignSelf: 'flex-start',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 80,
        marginBottom: 25,
        marginLeft: 40
    },
    eventsContainer: {
        //width: '100%',
        marginBottom: 295,
    },
})
