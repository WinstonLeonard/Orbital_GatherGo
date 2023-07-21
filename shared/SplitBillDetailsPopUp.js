import React, {useEffect, useState} from 'react';
import { View, FlatList, Modal, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { ref, getDownloadURL  } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import MoneyOwedBox from './MoneyOwedBox';
import FriendBoxForPopUp from './FriendBoxForPopUp';

export default function SplitBillDetailsPopUp({ modalVisible, closeModal, splitBillID }) {

    const [eventName, setEventName] = useState('');
    const [imageUrl, setImageUrl] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=d19c79af-4d10-4400-825e-88578818fef9');
    const [hostUsername, setHostUsername] = useState('');
    const [hostName, setHostName] = useState('');
    const [hostPfp, setHostPfp] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=d19c79af-4d10-4400-825e-88578818fef9');
    const [billDescription, setBillDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [participantsData, setParticipantsData] = useState([]);
    const [bill, setBill] = useState({});
    const [billTotal, setBillTotal] = useState('');
    const [received, setReceived] = useState('');

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
        
            const docPromise = getDoc(doc(db, "splitbill", splitBillID));
        
            const [docSnapshot] = await Promise.all([docPromise]);
    
            const billData = docSnapshot.data();
            const eventName = billData.eventName;
            const eventCategory = billData.eventCategory;
            const eventHost = billData.hostID;
            const billDescription = billData.description;
            const eventDate = billData.eventDate;
            const bill = billData.bill;
            const billTotal = billData.billTotal;
            const received = billData.received;

            setEventName(eventName);
            setImageUrl(images.categories[eventCategory]);
            setBillDescription(billDescription);
            const formattedDate = formatDate(eventDate);
            setEventDate(formattedDate);
            setBill(bill);
            setBillTotal(billTotal);
            setReceived(received);
            fetchHostData(eventHost);

        };
        fetchEventData();
    }, []);

  useEffect(() => {
    const fetchData = async () => {
        const temp = [];

        for (const userID in bill) {
            const storageRef = ref(storage, 'Profile Pictures');
            const fileName = userID;
            const fileRef = ref(storageRef, fileName);

            const urlPromise = getDownloadURL(fileRef);
            const docPromise = getDoc(doc(db, "users", userID));

            const [url, docSnapshot] = await Promise.all([urlPromise, docPromise]);

            const friendData = docSnapshot.data();
            const friendUsername = friendData.username;
            const friendName = friendData.name;
            const friendDebt = bill[userID];
            
            const object = {
                username: friendUsername,
                name: friendName,
                image: url,
                debt: friendDebt,
                userID: userID,
            };
            
            temp.push(object);
        }

        setParticipantsData(temp);
    };

    fetchData();
}, [bill]);


    function formatDate(dateString) {
      const [day, month, year] = dateString.split('/').map(Number);
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-UK', options);
      return formattedDate;
      
    }

    async function fetchHostData(docID) {
        const docRef = doc(db, "users", docID);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();
        const pfp =  await getProfilePic(docID);
        setHostUsername(data.username);
        setHostName(data.name);
        setHostPfp(pfp);
    }

    async function getProfilePic(fileName) {
      const storageRef = ref(storage, 'Profile Pictures');
      const fileRef = ref(storageRef, fileName);

      const urlPromise = getDownloadURL(fileRef)
      const [url] = await Promise.all([urlPromise]);
      return url;
    }
    

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

            <ScrollView contentContainerStyle = {styles.scrollViewContainer}>

                <View style = {styles.textContainer}>
                  <Text style = {styles.textHeader}>Host</Text>
                </View>

                <FriendBoxForPopUp
                  image = {hostPfp}
                  username = {hostUsername}
                  name = {hostName}/>

                <View style = {styles.textContainer}>
                  <Text style = {styles.textHeader}>Description</Text>
                  <Text style = {styles.textBody}>{billDescription}</Text>
                </View>

                <View style = {styles.textContainer}>
                  <Text style = {styles.textHeader}>Date</Text>
                  <Text style = {styles.textBody}>{eventDate}</Text>
                </View>

                <View style = {styles.textContainer}>
                  <Text style = {styles.textHeader}>Bill</Text>
                </View>

                <FlatList
                  scrollEnabled = {false} 
                  data = {participantsData}
                  renderItem= {({item}) => (
                      <MoneyOwedBox
                          image = {item.image}
                          username = {item.username}
                          name = {item.name}    
                          debt = {item.debt}
                          userID = {item.userID}
                      />
                  )}/>

                <View style = {[styles.textContainer, {marginBottom: 10}]}>
                  <Text style = {styles.textHeader}>Total: ${billTotal}</Text>
                  <Text style = {[styles.textHeader, {color:'#878686'}]}>Received: ${received}</Text>
                </View>

            </ScrollView>
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
    alignItems: 'flex-start',
  },
  scrollViewContainer: {
    flexGrow: 1,
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
  },
  textContainer: {
    marginTop: 15,
    marginLeft: 10,
    width: 320,
    //backgroundColor: 'red',
  },
  textHeader: {
    color: 'black',
    fontFamily: 'Popins-Bold',
    fontSize: 16,
  },
  textBody: {
    color: 'black',
    fontFamily: 'Popins',
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 20,
  }
});
