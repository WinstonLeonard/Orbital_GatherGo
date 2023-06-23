import React, {useEffect, useState} from 'react';
import { View, Button, Modal, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, query, addDoc, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';

export default function EventPopUp({ modalVisible, closeModal, eventID }) {

    const [eventName, setEventName] = useState('');
    const [imageUrl, setImageUrl] = useState('');


    const images = {
        categories: {
            'Sports' :"https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd",
            'Eat' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Feat%20icon.png?alt=media&token=ee7bf011-8772-45ef-8555-5ba95fbe0aca",
            'Study' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fstudy%20icon.png?alt=media&token=4af22023-a081-4303-a054-251eaedfe35e",
            'Others' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fothers_icon.png?alt=media&token=c59640d4-5f09-44fc-81a3-b4f72a00b241",
        }
    }

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

    return (
    <Modal visible={modalVisible} onRequestClose={closeModal} transparent = {true} animationType='fade'>
        <View style={styles.container}>
        <View style = {styles.modalContent}>
            <View style ={styles.headerContainer}>
                
                <View style = {styles.crossContainer}>
                <TouchableOpacity onPress = {closeModal}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fcross%20icon.png?alt=media&token=0647d0f5-50a2-41a8-8493-902bf5deece3'}}
                    style = {styles.crossStyle}
                    resizeMode = 'contain'/>
                </TouchableOpacity>
                </View>

                <View style = {styles.logoContainer}>
                <Image
                    source = {{uri: imageUrl}}
                    style = {styles.logoStyle}
                    resizeMode = 'contain'/>
                </View>

                <Text style = {styles.titleStyle}>{eventName}</Text>
            </View>

        </View>
        </View>
    </Modal>
    );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
  },
  modalContent: {
    width: 350, // Adjust the width as needed
    height: 700, // Adjust the height as needed
    backgroundColor: 'white', // Modal background color
    borderRadius: 15, // Rounded corners for the modal
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    //marginTop: 15,
    height: 200,
    width: 350,
    backgroundColor: '#39A5BD',
    borderRadius: 15,
    alignItems: 'center',
  },
  crossContainer: {
    margin: 10,
    alignSelf: 'flex-end',
    height: 25,
    width: 25,
  },
  crossStyle: {
    height: 25,
    width: 25,
  },
  logoContainer: {
    width: 130,
    height: 130,
    marginTop: -15,
    marginBottom: -5,
  },
  logoStyle: {
    height: 130,
    width: 130,
  },
  titleStyle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Popins-Bold',
  }
});
