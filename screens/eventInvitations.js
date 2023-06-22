import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import EventRequestBox from '../shared/eventRequestBox';


export default function EventInvitations({navigation}) {

    const [myEventInvitations, setMyEventInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [myUpcomingEvents, setMyUpcomingEvents] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
    
            const myData = myDocSnap.data();
            setMyEventInvitations(myData.eventInvitations);
            setMyUpcomingEvents(myData.upcomingEvents)
        }
        fetchData();
    },[]);  

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const temp = [];
    
    //         for (let i = 0; i < myEventInvitations.length; i++) {
    //             const eventID = myEventInvitations[i];

    //             const docPromise = getDoc(doc(db, "events", eventID));
    
    //             const [docSnapshot] = await Promise.all([docPromise]);
    
    //             const eventData = docSnapshot.data();
    //             const eventName = eventData.name;
    //             const eventCategory = eventData.category;
    //             const eventLocation = eventData.location;
    //             const eventDate = eventData.date;
    //             const eventTime = eventData.time;

    //             const acceptHandler = async () => {
    //                 const myDocID = authentication.currentUser.uid;
    //                 const myDocPromise = getDoc(doc(db, "users", myDocID));

    //                 const [myDocSnapshot] = await Promise.all([myDocPromise]);

    //                 const myData = myDocSnapshot.data();
                    
    //                 const currentEventInvitations = myData.eventInvitations;
    //                 const currentUpcomingEvents = myData.upcomingEvents;

    //                 const newEventsInvitations = currentEventInvitations.filter(item => item != eventID);
    //                 const newUpcomingEvents = [...currentUpcomingEvents, eventID];

    //                 const myRef = doc(db, 'users', myDocID);
                    
    //                 setDoc(myRef, {
    //                     eventInvitations: newEventsInvitations,
    //                     upcomingEvents: newUpcomingEvents,
    //                 }, { merge: true });

    //                 setMyEventInvitations(newEventsInvitations);
    //                 console.log(eventName + ' Accepted');
    //             }
            
    //             const rejectHandler = async () => {
    //                 const myDocID = authentication.currentUser.uid;
    //                 const myDocPromise = getDoc(doc(db, "users", myDocID));

    //                 const [myDocSnapshot] = await Promise.all([myDocPromise]);

    //                 const myData = myDocSnapshot.data();

    //                 const currentEventInvitations = myData.eventInvitations;
    //                 const newEventsInvitations = currentEventInvitations.filter(item => item != eventID);

    //                 const myRef = doc(db, 'users', myDocID);
                    
    //                 setDoc(myRef, {
    //                     eventInvitations: newEventsInvitations,
    //                 }, { merge: true });

    //                 setMyEventInvitations(newEventsInvitations);
    //                 console.log(eventName + ' Accepted');
    //             }
                
    //             const object = {
    //                 name : eventName,
    //                 category : eventCategory,
    //                 location : eventLocation,
    //                 date : eventDate,
    //                 time : eventTime,
    //                 acceptHandler : acceptHandler,
    //                 rejectHandler : rejectHandler,
    //             };
                
    //             temp.push(object);
    //         }
    
    //         setMyEventInvitations(temp);
    //         setIsLoading(false);
    //     };
    
    //     fetchData();
    // }, [myEventInvitations]);



    // if (isLoading) {
    //     return (
    //       <View style={styles.loadingContainer}>
    //         <ActivityIndicator size="large" color="#0000ff" />
    //       </View>
    //     );
    // }

    return(
        // <KeyboardAvoidingView 
        //     style = {styles.keyboardAvoidContainer}
        //     enableOnAndroid = {true}
        //     keyboardVerticalOffset = {-400}
        //     behavior = "padding">
        // <View style = {styles.container}>

        //     <FlatList
        //     data = {myEventInvitations}
        //     renderItem= {({item}) => (
        //         <EventRequestBox
        //             name = {item.name}
        //             category = {item.category}
        //             location = {item.location}
        //             date = {item.date}
        //             time = {item.time}
        //             acceptHandler= {item.acceptHandler}
        //             rejectHandler= {item.rejectHandler}    
        //         />
        //     )}/>

        // </View>
        // </KeyboardAvoidingView>
        <View style = {styles.container}>
            <Text>Hello fucking worldd</Text>
        </View>
    )
  
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        fontFamily: "Nunito-Sans-Bold",
        fontSize: 20,
        marginTop: 70,
        marginBottom: 45,
    },
    inputContainer: {
        width: 275,
        marginBottom: 40,
    },
    textInput: {
        fontFamily: 'Nunito-Sans',
        textAlign: 'center',    
        fontSize: 16,
        paddingVertical: 8,
      },
    line: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'grey',
        elevation: 3, // Adjust the elevation value as needed
    },
    secondHeaderContainer: {
        marginTop: 110,
        marginBottom: 30,
        textAlign: 'center',
    },
    secondHeader: {
        fontFamily: "Nunito-Sans-Bold",
        fontSize: 20,
    },
})
