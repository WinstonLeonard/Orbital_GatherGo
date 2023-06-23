import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import GroupChatContainer from '../shared/GroupChatContainer';
import { authentication, db } from '../firebase/firebase-config';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import GroupChat from '../shared/groupChat';
import { useFocusEffect } from '@react-navigation/native';


export default function Inbox({navigation}) {

    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const incomingInvitationHandler = () => {
        navigation.navigate('EventInvitations');
        console.log(upcomingEvents);
    }

    useFocusEffect(
        React.useCallback(() => {
            async function fetchUpcomingEvents() {
                const myDocID = authentication.currentUser.uid;
                const myDocRef = doc(db, "users", myDocID);
                const myDocSnap = await getDoc(myDocRef);  
                const myData = myDocSnap.data();
                const events = myData.upcomingEvents;
                const temp = [];
                for (let i = 0; i < events.length; i++) {
                    const object = {
                        key: i,
                        eventID: events[i], 
                    }
                    temp.push(object);
                }
                setUpcomingEvents(temp);
            }
            fetchUpcomingEvents();
        }, [])
    );

    // useEffect(() => {
    //     async function fetchUpcomingEvents() {
    //         const myDocID = authentication.currentUser.uid;
    //         const myDocRef = doc(db, "users", myDocID);
    //         const myDocSnap = await getDoc(myDocRef);  
    //         const myData = myDocSnap.data();
    //         const events = myData.upcomingEvents;
    //         const temp = [];
    //         for (let i = 0; i < events.length; i++) {
    //             const object = {
    //                 key: i,
    //                 eventID: events[i], 
    //             }
    //             temp.push(object);
    //         }
    //         setUpcomingEvents(temp);
    //     }
    //     fetchUpcomingEvents();
    // },[]);

    return (

        <View style = {styles.container}>
            
            <View style = {styles.headerContainer}> 
                <Text style = {styles.headerText}>Inbox</Text>
                <View style = {styles.envelopContainer}>
                    <TouchableOpacity onPress = {incomingInvitationHandler}>
                    <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fenvelope.png?alt=media&token=16c56aa8-83ec-4734-8136-9e6800f1a2d2'}}
                            style  = {styles.envelopStyle}
                            resizeMode= 'contain'/>
                    </TouchableOpacity>
                </View>
            </View>

            <GroupChatContainer
                navigation = {navigation}
                eventID = {'GLOBAL'} />

            <FlatList
            data = {upcomingEvents}
            renderItem= {({item}) => (
                <GroupChatContainer
                    navigation = {navigation}
                    eventID = {item.eventID}   
                />
            )}
            />
            
            {/* <GroupChatContainer></GroupChatContainer> */}

            {/* <View>
                <Text onPress = {() => navigation.navigate('TestGroupChat')}
                    style = {{ fontSize: 26, fontWeight: 'bold' }}>GroupChat</Text>
            </View> */}

         </View>   
        

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'flex-start',
    },
    headerContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 35,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 40,
        fontFamily: 'Nunito-Sans-Bold',
        marginLeft: 35,
    },
    envelopContainer: {
        //backgroundColor: 'red',
        width: 50,
        height: 50,
        position: 'absolute',
        left: 305,
    },
    envelopStyle: {
        width: 50,
        height: 50,
    },
})