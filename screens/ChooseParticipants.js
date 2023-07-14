import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../shared/button';
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import uuid from 'uuid-random';

export default function ChooseParticipants({navigation, route}) {
    
    //loading friendlist
    const [myFriendList, setMyFriendList] = useState([]);
    const [friendData, setFriendData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [invitationList, setInvitationList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
    
            const myData = myDocSnap.data();
            setMyFriendList(myData.friendList);
        }
        fetchData();
    },[]);
    
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < myFriendList.length; i++) {
                const friendUid = myFriendList[i];

                const docPromise = getDoc(doc(db, "users", friendUid));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const friendData = docSnapshot.data();
                const friendUsername = friendData.username;
                
                const object = {
                    key: friendUid,
                    value: friendUsername,
                };
                
                temp.push(object);
            }
    
            setFriendData(temp);
            setIsLoading(false);
        };
    
        fetchData();
    }, [myFriendList]);

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }

    const updateMyEvents = async (eventID) => {
        const myID = authentication.currentUser.uid;
        const myPromise = getDoc(doc(db, 'users', myID));
        const [myDocSnapshot] = await Promise.all([myPromise]);
        
        const myData = myDocSnapshot.data();
        const currentMyEvents = myData.myEvents;
        const newMyEvents = [...currentMyEvents, eventID];

        const myRef = doc(db, 'users', myID);
        setDoc(myRef, {
            myEvents: newMyEvents,
        }, { merge: true });
    }

    const updateMyUpcomingEvents = async (eventID) => {
        const myID = authentication.currentUser.uid;
        const myPromise = getDoc(doc(db, 'users', myID));
        const [myDocSnapshot] = await Promise.all([myPromise]);
        
        const myData = myDocSnapshot.data();
        const currentupcomingEvents = myData.upcomingEvents;
        const newupcomingEvents = [...currentupcomingEvents, eventID];

        const myRef = doc(db, 'users', myID);
        setDoc(myRef, {
            upcomingEvents: newupcomingEvents,
        }, { merge: true });
    }

    const next = async () => {
        const {eventData} = route.params;
        const generatedUUID = uuid();
        const eventID = generatedUUID;
        const collectionRef = collection(db, 'events');
        const hostID = authentication.currentUser.uid;
        const newDocumentRef = doc(collectionRef, generatedUUID); 

        setDoc(newDocumentRef, {
            name: eventData.name,
            category: eventData.category,
            location: eventData.location,
            date: eventData.date,
            time: eventData.time,
            hostID: hostID,
            eventID: eventID,
            description: eventData.description,
            invitationList: [],
            participants: [],
          })
          .catch((error) => {
            console.log('Error creating event:', error);
          });

        //sending invitations by adding eventID to eventInvitations property of users
        for (let i = 0; i < invitationList.length; i++) {
            
            const userID = invitationList[i];
            const myUserPromise = getDoc(doc(db, 'users', userID));
            const [userDocSnapshot] = await Promise.all([myUserPromise]);

            const userData = userDocSnapshot.data();
            const currentEventInvitationList = userData.eventInvitations;
            const newEventsInvitationList = [...currentEventInvitationList, eventID]
            
            
            const userRef = doc(db, 'users', userID);

            setDoc(userRef, {
                eventInvitations: newEventsInvitationList,
            }, { merge: true });
        }

        //setting events invited list
        const eventRef = doc(db, 'events', eventID);
        setDoc(eventRef, {
            invitationList: invitationList,
        }, { merge: true });

        //adding eventID to myEvents property
        updateMyEvents(eventID);
        updateMyUpcomingEvents(eventID);
        
        navigation.navigate("Home");
    }
    
    return (
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
    
            <ScrollView
                contentContainerStyle = {styles.container}>

            
            <View style = {styles.inputContainer}> 
                <Text style = {styles.title}>Choose Participants</Text>
                
                <MultipleSelectList
                    arrowicon={
                        <Text> </Text>
                    }
                    inputStyles = {styles.placeholder}
                    boxStyles= {styles.selectListBox}
                    dropdownStyles={styles.selectListBox}
                    checkBoxStyles={{borderColor:'#39A5BD'}}
                    badgeStyles={{backgroundColor:'#39A5BD'}}
                    search = {true} 
                    setSelected={(val) => setInvitationList(val)} 
                    data={friendData}
                    placeholder='Choose Participates' 
                    fontFamily='Nunito-Sans-Bold'
                    alignItems= 'center'
                    save="key"/>

            </View>

            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Send Invitation' 
                            buttonColor = '#39A5BD'
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
    inputContainer: {
        width: '80%',
        marginBottom: 250
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
    placeholder: {
        fontFamily: "Nunito-Sans-Bold",
    },
    selectListBox: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: 'white',
        borderColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
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
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
    },
})