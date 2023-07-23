import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import EventPopUp from './EventPopup';


export default function HomeUpcomingEvents({eventID}) {
    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        if (eventID == 'GLOBAL') {
          setModalVisible(false);
        } else {
          setModalVisible(true);
        }
      }
    
    const closeModal = () => {
        setModalVisible(false);
    }
    
    
    
    async function getEventDetails() {
        const docID = eventID;
        const docRef = doc(db, "events", docID);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();

        setEventName(data.name);
        setEventLocation(data.location);
        setEventDate(formatDate(data.date, data.time));
    }

    function formatDate(dateString, time) {
        const [day, month, year] = dateString.split('/').map(Number);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-UK', options);
        return formattedDate + " at " + time; 
    }

    useEffect(() => {
        getEventDetails();
    }, []);

    return (
    <TouchableOpacity style = {styles.users} onPress={openModal}>
        {
            modalVisible === true ?
            <EventPopUp modalVisible={modalVisible} closeModal={closeModal} eventID = {eventID} />
            :
            null
        }
        <View style = {styles.textContainer}>
            <Text style = {styles.dummy}>{eventName}</Text>
            <Text style = {styles.dummy}>📍{eventLocation}</Text>
            <Text style = {styles.dummy}>🗓️ {eventDate}</Text>
        </View>
    </TouchableOpacity> 
    )
}

const styles = StyleSheet.create({
    users: {
        width: 310,
        height: 140,
        backgroundColor: '#8CDFF0',
        borderRadius: 15,
        justifyContent: 'center',
    },
    textContainer: {
        marginLeft: 15,
        marginRight: 15,
        //backgroundColor: 'red',
    },
    dummy: {
        marginBottom: 10,
        fontFamily: 'Nunito-Sans-Bold'
    }
})