import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';

export default function GroupChatContainer({navigation, eventID}) {

    const [eventName, setEventName] = useState('')
    const [imageUrl, setImageUrl] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=d19c79af-4d10-4400-825e-88578818fef9');
    const [lastMessage, setLastMessage] = useState('');

    const openGroupChat = () => {
        navigation.navigate('TestGroupChat', { eventID: eventID });
    }

    const images = {
        categories: {
            'Sports' :"https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd",
            'Eat' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Feat%20icon.png?alt=media&token=ee7bf011-8772-45ef-8555-5ba95fbe0aca",
            'Study' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fnew%20study%20icon.png?alt=media&token=fd5cbcb7-fe30-43f9-8e83-fc3ba1528fdb",
            'Others' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fothers_icon.png?alt=media&token=c59640d4-5f09-44fc-81a3-b4f72a00b241",
        }
    }

    useEffect(() => {
        async function fetchEventData() {
            const docPromise = getDoc(doc(db, "events", eventID));
        
            const [docSnapshot] = await Promise.all([docPromise]);

            const eventData = docSnapshot.data();
            const eventName = eventData.name;
            const eventCategory = eventData.category;


            setEventName(eventName);
            setImageUrl(images.categories[eventCategory]);
        };
        fetchEventData();
    }, []);

    return(
    <TouchableOpacity onPress = {openGroupChat}>
    <View style = {styles.groupContainer}>

        <View style = {styles.pfpContainer}>
        <Image source = {{uri: imageUrl}}
                    style = {styles.pfpStyle}
                    resizeMode='contain' />
        </View>

        <View style = {styles.nameContainer}>
            <Text style = {styles.nameStyle}> {eventName} </Text>

            <Text style = {styles.chatStyle}> {eventID} </Text>

        </View>

    </View>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 10,
        width: 340,
        alignContent: 'center',
        //borderColor: 'black',
        //borderWidth: 2,
    }, 
    pfpContainer: {
        //backgroundColor: 'red',
        width: 60,
        height: 60,
    },
    pfpStyle: {
        width: 60,
        height: 60,
        //borderColor: 'black',
        borderWidth: 2.5,
        //borderRadius: 1000, 
    },
    nameContainer: {
        //backgroundColor: 'red',
        textAlign: 'left',
        justifyContent: 'center',
        marginLeft: 10,
    },
    nameStyle: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 24,
        textAlign: 'left',
    },
    chatStyle: {
        fontFamily: 'Nunito-Sans',
        fontSize: 16,
        textAlign: 'left',
        marginLeft: 5,
    }
})