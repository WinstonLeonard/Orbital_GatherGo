import React, {useEffect, useState} from 'react';
import { View, FlatList, Modal, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { collection, query, addDoc, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import FriendBoxForPopUp from './FriendBoxForPopUp';
import CustomButton from './button';

export default function DeleteBillPopUp({ modalVisible, closeModal, billID, deleteFunction }) {
    
const [billHost, setBillHost] = useState('');
const [billPeople, setBillPeople] = useState([]);
  
  const deleteHandler = () => {
    //deleteFunction(eventID, eventHost, eventParticipants, pendingInvites);
    deleteFunction(billID, billHost, billPeople);
    closeModal();
  }

  useEffect(() => {
    async function fetchBillData() {

      const docPromise = getDoc(doc(db, "splitbill", billID));
  
      const [docSnapshot] = await Promise.all([docPromise]);

      const eventData = docSnapshot.data();
      const billHost = eventData.hostID;
      const bill = eventData.bill
      const billPeople = Object.keys(bill);
      setBillHost(billHost);
      setBillPeople(billPeople);

    };
    fetchBillData();
}, []);

    return (
        <Modal visible={modalVisible} onRequestClose={closeModal} transparent = {true} animationType='fade'>
            <View style={styles.container}>
            <View style = {styles.modalContent}>

                <View style = {styles.crossContainer}>
                <TouchableOpacity onPress = {closeModal}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fcross%20icon%20v3.png?alt=media&token=29c7e5ac-d5b1-4262-9e2b-42eb0669ce73'}}
                    style = {styles.crossStyle}
                    resizeMode = 'contain'/>
                </TouchableOpacity>
                </View>

                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fcross%20icon%20v2.png?alt=media&token=58f76d2d-3bc7-4221-b1d9-42b84435737e'}}
                    style = {styles.logoStyle}
                    resizeMode = 'contain'/>
                    
                <Text style = {styles.titleStyle}>Are you sure ?</Text>

            <View style = {styles.textContainer}>
              <Text style = {styles.textBody}>Do you really want to delete this bill?
              Deleting this event will delete the debts for everyone inside this bill. 
              This process cannot be undone.</Text>
            </View>

            <View style = {styles.buttonsContainer}>

            <CustomButton text = 'Cancel' 
                          buttonColor = '#b3b3b3' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {130}
                          height = {45}
                          fontSize = {16}
                          onPress = {closeModal}></CustomButton>
            
            <CustomButton text = 'Delete' 
                          buttonColor = '#dd3541' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {130}
                          height = {45}
                          fontSize = {16}
                          onPress = {deleteHandler}></CustomButton>
            </View>


            </View>
            </View>
        </Modal>
    )
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
      height: 400, // Adjust the height as needed
      backgroundColor: 'white', // Modal background color
      borderRadius: 15, // Rounded corners for the modal
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
    headerContainer: {
      //marginTop: 15,
      height: 200,
      width: 350,
      //backgroundColor: 'blue',
      borderRadius: 15,
      alignItems: 'center',
    },
    crossContainer: {
      marginTop: 10,
      marginRight: 10,
      alignSelf: 'flex-end',
      height: 15,
      width: 350,
      //backgroundColor: 'red',
    },
    crossStyle: {
      height: 15,
      width: 15,
      alignSelf: 'flex-end',
    },
    logoContainer: {
      width: 100,
      height: 100,
      //backgroundColor: 'blue',
    },
    logoStyle: {
      height: 100,
      width: 100,
      //backgroundColor: 'red',
    },
    titleStyle: {
      color: 'white',
      fontSize: 28,
      fontFamily: 'Popins-Bold',
      color: 'black',
      //backgroundColor: 'blue',
      margin: 30,
    },
    textContainer: {
      width: 320,
      //backgroundColor: 'red',
    },
    textBody: {
      color: 'grey',
      fontFamily: 'Helvetica',
      fontSize: 16,
      textAlign: 'center',
      //backgroundColor: 'red',
    },
    buttonsContainer: {
      width: 320,
      flexDirection: 'row',
      //backgroundColor: 'blue',
      alignContent: 'center',
      justifyContent: 'space-evenly',
      marginTop: 10,
    }
});