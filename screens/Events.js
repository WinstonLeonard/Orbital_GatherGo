import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import UpcomingEventsBox from '../shared/upcomingEventsBox';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 

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
            
            <View style = {styles.input}>
                <TextInput placeholder= 'Search' style = {styles.textInput} />
                <FontAwesome name="search" size={24} color="black" style = {styles.icon} />
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
        backgroundColor: '#DEF5FF',
    },
    title: {
        fontFamily: "Nunito-Sans-Bold",
        alignSelf: 'center',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 60,
        marginBottom: 25,
    },
    eventsContainer: {
        width: '100%',
        //marginBottom: 200,
        //backgroundColor: 'red',
        height: 560,
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
})
