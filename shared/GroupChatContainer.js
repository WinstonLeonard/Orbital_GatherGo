import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { collection, query, where, getDocs, getDoc, doc, setDoc, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function GroupChatContainer({navigation, eventID}) {

    const [eventName, setEventName] = useState('')
    const [imageUrl, setImageUrl] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=d19c79af-4d10-4400-825e-88578818fef9');
    const [lastMessage, setLastMessage] = useState('');
    const [displayLastMessage, setDisplayLastMessage] = useState('')
    const [myUsername, setMyUsername] = useState('');

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
        async function getUsername() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            setMyUsername(data.username);
               
        }
        getUsername();
      }, []);

    useEffect(() => {
        async function fetchEventData() {
            if (eventID == 'GLOBAL') {
                setEventName('Global Chat');
                setImageUrl('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2FgatherGo%20circle.png?alt=media&token=d7572fdb-d549-4eab-950f-4dca85f9e42b');
            } else {
                const docPromise = getDoc(doc(db, "events", eventID));
        
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const eventData = docSnapshot.data();
                const eventName = eventData.name;
                const eventCategory = eventData.category;
    
    
                setEventName(eventName);
                setImageUrl(images.categories[eventCategory]);
            }
        };
        fetchEventData();
    }, []);

    useLayoutEffect(() => {
        // const eventID = 'eventID';
        const path = 'groupchats/test/' + eventID;
        const collectionRef = collection(db, path);
        const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(1)); // Add limit(1) to retrieve only the newest message
      
        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docs.map((doc) => {
            setLastMessage(
              {
                _id: doc.id,
                createdAt: doc.data().createdAt,
                text: doc.data().text,
                user: doc.data().user,
              },
            );
          });
        });
      
        unsubscribe;
      }, []);

      useEffect(() => {
        if (!lastMessage) {
            return;
        } else {
            const last = lastMessage.text;
            const senderObject = lastMessage.user;
            const sender = senderObject.username;

            function sliceMessage(string) {
                if (string.length >= 35) {
                    slicedString = string.slice(0,35);
                    slicedString = slicedString + "...";
                    return slicedString;
                } else {
                    return string;
                }
            }
            let formatLastMessage = '';
            
            if (sender == myUsername) {
                formatLastMessage = "You: " + last;
            } else {
                formatLastMessage = sender + ": " + last;
            }
            formatLastMessage = sliceMessage(formatLastMessage);
            setDisplayLastMessage(formatLastMessage);
        }
      }, [lastMessage]);
      

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

            <Text style = {styles.chatStyle}> {displayLastMessage} </Text>

        </View>

    </View>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginBottom: 10,
        width: 330,
        alignContent: 'center',
        // borderColor: 'black',
        // borderWidth: 2,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
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
        fontFamily: 'Popins-Bold',
        fontSize: 16,
        textAlign: 'left',
    },
    chatStyle: {
        fontFamily: 'Popins',
        fontSize: 14,
        color: 'grey',
        textAlign: 'left',
        marginLeft: 0,
    }
})