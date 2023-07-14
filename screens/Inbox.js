import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import GroupChatContainer from '../shared/GroupChatContainer';
import { authentication, db } from '../firebase/firebase-config';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import GroupChat from '../shared/groupChat';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function Inbox({navigation}) {

    const [searchEvent, setSearchEvent] = useState('');

    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const [filteredEvents, setFilteredEvents] = useState('');

    const [data, setData] = useState(upcomingEvents);

    const [isSearchActive, setIsSearchActive] = useState(false);

    const incomingInvitationHandler = () => {
        navigation.navigate('EventInvitations');
    }
    

    const searchHandler = () => {
        console.log(searchEvent);
        setIsSearchActive(true);
        const filtered = upcomingEvents.filter((object) => object.eventName.includes(searchEvent))
        setFilteredEvents(filtered);
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
                    const myEventRef = doc(db, "events", events[i]);
                    const myEventSnap = await getDoc(myEventRef);
                    const eventData = myEventSnap.data();
                    const eventName = eventData.name;
                    const object = {
                        key: i,
                        eventID: events[i],
                        eventName: eventName,
                    }
                    temp.push(object);
                }
                setUpcomingEvents(temp);
                setIsSearchActive(false);
            }
            fetchUpcomingEvents();
        }, [])
    );


    useEffect(() => {
        if (isSearchActive) {
            setData(filteredEvents);
        } else {
            setData(upcomingEvents);
        }
    }, [isSearchActive, filteredEvents, upcomingEvents]);

    useEffect(() => {
        if (searchEvent == '') {
            setData(upcomingEvents);
        }
    }, [searchEvent])

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

            <View style = {styles.input}>
                <TextInput placeholder= 'Search' style = {styles.textInput} value = {searchEvent} onChangeText={text => setSearchEvent(text)} />
                <TouchableOpacity onPress = {searchHandler}>
                    <FontAwesome name="search" size={24} color="black" style = {styles.icon} />
                </TouchableOpacity>
            </View>

            <GroupChatContainer
                navigation = {navigation}
                eventID = {'GLOBAL'} />

            <FlatList
            //data = {upcomingEvents}
            //data = {filteredEvents}
            data = {data}
            renderItem= {({item}) => (
                <GroupChatContainer
                    navigation = {navigation}
                    eventID = {item.eventID}   
                />
            )}
            />

         </View>   
        

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DEF5FF',
        alignItems: 'center',
    },
    headerContainer: {
        backgroundColor: '#DEF5FF',
        flexDirection: 'row',
        marginLeft: 35,
        marginRight: 35,
        marginTop: 53,
        alignItems: 'center',
        marginBottom: 20,
        // justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Nunito-Sans-Bold',
        flex: 1,
        textAlign: 'center',
        paddingLeft: 45,
        fontWeight: 'bold',

    },
    envelopContainer: {
        //backgroundColor: 'red',
        width: 45,
        height: 45,
    },
    envelopStyle: {
        width: 45,
        height: 45,
    },
    input: {
        alignItems: 'center',
        backgroundColor: 'white',
        width: 330,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 15,
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