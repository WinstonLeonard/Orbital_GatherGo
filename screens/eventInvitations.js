import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import EventRequestBox from '../shared/eventRequestBox';


export default function EventInvitations({navigation}) {

    const [myEventInvitations, setMyEventInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [myUpcomingEvents, setMyUpcomingEvents] = useState([]);
    const [data, setData] = useState([]);


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

    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < myEventInvitations.length; i++) {
                const eventID = myEventInvitations[i];

                const docPromise = getDoc(doc(db, "events", eventID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const eventData = docSnapshot.data();
                const eventName = eventData.name;
                const eventCategory = eventData.category;
                const eventLocation = eventData.location;
                const eventDate = eventData.date;
                const eventTime = eventData.time;

                const acceptHandler = async () => {
                    const myDocID = authentication.currentUser.uid;
                    const myDocPromise = getDoc(doc(db, "users", myDocID));

                    const [myDocSnapshot] = await Promise.all([myDocPromise]);

                    const myData = myDocSnapshot.data();
                    
                    const currentEventInvitations = myData.eventInvitations;
                    const currentUpcomingEvents = myData.upcomingEvents;
                    const currentParticipants = eventData.participants;

                    const newEventsInvitations = currentEventInvitations.filter(item => item != eventID);
                    const newUpcomingEvents = [...currentUpcomingEvents, eventID];
                    const newParticipants = [...currentParticipants, myDocID];

                    const myRef = doc(db, 'users', myDocID);
                    
                    setDoc(myRef, {
                        eventInvitations: newEventsInvitations,
                        upcomingEvents: newUpcomingEvents,
                    }, { merge: true });

                    const eventRef = doc(db, 'events', eventID);
                    
                    setDoc(eventRef, {
                        participants: newParticipants,
                    }, { merge: true });

                    setMyEventInvitations(newEventsInvitations);
                    console.log(eventName + ' Accepted');
                }
            
                const rejectHandler = async () => {
                    const myDocID = authentication.currentUser.uid;
                    const myDocPromise = getDoc(doc(db, "users", myDocID));

                    const [myDocSnapshot] = await Promise.all([myDocPromise]);

                    const myData = myDocSnapshot.data();

                    const currentEventInvitations = myData.eventInvitations;
                    const newEventsInvitations = currentEventInvitations.filter(item => item != eventID);

                    const myRef = doc(db, 'users', myDocID);
                    
                    setDoc(myRef, {
                        eventInvitations: newEventsInvitations,
                    }, { merge: true });

                    setMyEventInvitations(newEventsInvitations);
                    console.log(eventName + ' Accepted');
                }
                
                const object = {
                    name : eventName,
                    category : eventCategory,
                    location : eventLocation,
                    date : eventDate,
                    time : eventTime,
                    acceptHandler : acceptHandler,
                    rejectHandler : rejectHandler,
                };
                
                temp.push(object);
            }
    
            //setMyEventInvitations(temp);
            setData(temp);
            setIsLoading(false);
        };
    
        fetchData();
    }, [myEventInvitations]);



    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }

    return(
        <KeyboardAvoidingView 
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
            
        <View style = {styles.container}>
            <Text style = {styles.title}>Event Invitations</Text>
            
            <View style = {styles.inputContainer}> 
            

                <FlatList
                data = {data}
                renderItem= {({item}) => (
                    <EventRequestBox
                        name = {item.name}
                        category = {item.category}
                        location = {item.location}
                        date = {item.date}
                        time = {item.time}
                        acceptHandler= {item.acceptHandler}
                        rejectHandler= {item.rejectHandler}    
                    />
            )}/>
            
            </View>
        </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    title: {
        fontFamily: "Nunito-Sans-Bold",
        textAlign: 'left',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 80,
        marginBottom: 25,
        marginLeft: 40
    },
    eventsContainer: {
        width: '100%',
        marginBottom: 250,

    },
})
