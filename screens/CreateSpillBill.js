import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import CustomButton from '../shared/button';
import { storage, authentication, db } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"; 
import { StatusBar } from "expo-status-bar";
import SplitBillBox from '../shared/SplitBillBox';
import uuid from 'uuid-random';

export default function CreateSplitBill({navigation, route}) {

    const [userValues, setUserValues] = useState({});
    
    const [participants, setParticipants] = useState([]);
    const [eventName, setEventName] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [description, setDescription] = useState('');
    const [inputHeight, setInputHeight] = useState(50); 

    useEffect(() => {
        async function fetchEventData() {
            const {eventID} = route.params;

            const docPromise = getDoc(doc(db, "events", eventID));
        
            const [docSnapshot] = await Promise.all([docPromise]);
    
            const eventData = docSnapshot.data();
            const eventName = eventData.name;
            const eventParticipants = eventData.participants;
            setEventName(eventName)
            setParticipants(eventParticipants);
          }
        fetchEventData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < participants.length; i++) {
                const friendUid = participants[i];
                const storageRef = ref(storage, 'Profile Pictures');
                const fileName = friendUid;
                const fileRef = ref(storageRef, fileName);
    
                const urlPromise = getDownloadURL(fileRef);
                const docPromise = getDoc(doc(db, "users", friendUid));
    
                const [url, docSnapshot] = await Promise.all([urlPromise, docPromise]);
    
                const friendData = docSnapshot.data();
                const friendUsername = friendData.username;
                const friendName = friendData.name;
                
                const object = {
                    username: friendUsername,
                    name: friendName,
                    image: url,
                    key: i,
                    userID: friendUid,
                };
                
                temp.push(object);
            }
            
            setData(temp);
            setIsLoading(false);
        };
    
        fetchData();
    }, [participants]);

    const next = async () => {

        const isAnyFieldEmpty = Object.values(userValues).some((value) => value === '');

        if (isAnyFieldEmpty || description === '') {
            Alert.alert('Please fill out all fields before proceeding.');
        } else {
            const hasInvalidNumber = Object.values(userValues).some((value) => isNaN(value));
  
            if (hasInvalidNumber) {
                Alert.alert('Please enter valid numbers for all participants before proceeding.');
            } else {
                const {eventID} = route.params;
                const generatedUUID = uuid();
                const splitBillID = generatedUUID;
                const collectionRef = collection(db, 'splitbill');
                const hostID = authentication.currentUser.uid;
                const newDocumentRef = doc(collectionRef, generatedUUID); 
                const myID = authentication.currentUser.uid;
                
                //getting event data
                const docPromise = getDoc(doc(db, "events", eventID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const eventData = docSnapshot.data();
                const eventName = eventData.name;
                const eventDate = eventData.date;
                const eventCategory = eventData.category;
                const billTotal = Object.values(userValues).reduce((total, moneyOwed) => total + parseFloat(moneyOwed || 0), 0);

                // creates Split Bill
                setDoc(newDocumentRef, {
                    eventID: eventID,
                    eventName: eventName,
                    eventDate: eventDate,
                    eventCategory: eventCategory,
                    hostID: hostID,
                    splitBillID: splitBillID,
                    bill: userValues,
                    description: description,
                    received: 0,
                    billTotal: billTotal,
                })
                .then(() => {
                    console.log('Split bill created successfully.');
                })
                .catch((error) => {
                    console.log('Error creating split bill:', error);
                });

                //add to users debt field and also find the total for the bill
                try {
                    for (const userID in userValues) {
                        const moneyOwed = userValues[userID] || 0;
                        console.log(userID);
                        console.log(moneyOwed);
                        const userRef = doc(db, 'users', userID);
                        
                        setDoc(userRef, { 
                            debt: {[splitBillID]: moneyOwed}, 
                        }, { merge: true });
                    }
                } catch(error) {
                    console.error('An error occurred:', error);
                }

                //add splitBillID to splitbillshosted of host
                const myUserPromise = getDoc(doc(db, 'users', myID));
                const [userDocSnapshot] = await Promise.all([myUserPromise]);
    
                const userData = userDocSnapshot.data();
                const currentSplitBills = userData.splitBillsHosted;
                const newSplitBills = [...currentSplitBills, splitBillID];
                const myRef = doc(db, 'users', myID)
                
                setDoc(myRef, { 
                    splitBillsHosted: newSplitBills,
                }, { merge: true });
            
            }
            navigation.navigate('Expenses');
        }
    }

    const handleInputChange = (userID, value) => {
        setUserValues((prevValues) => ({
          ...prevValues,
          [userID]: value,
        }));
      };

    const handleDescription = (newText) => {
        setDescription(newText);
      };
    
    const handleContentSizeChange = (event) => {
        const { contentSize } = event.nativeEvent;
        const newInputHeight = contentSize.height;
        setInputHeight(newInputHeight);
    };

    return (
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
            
            <StatusBar style="auto"/>

            <Text style = {styles.title}>Create Split Bill</Text>

            <View style = {{flexDirection: 'row'}}>
                <Text style = {styles.text}>Event name: </Text>
                <Text style = {[styles.text, {color: '#39A5BD'}, {marginLeft: 0}]}>{eventName}</Text>
            </View>
            
            <Text style = {[styles.text, {marginTop: 20}]}>Split bill description:</Text>

            <TextInput
                    multiline
                    style={[styles.inputDescription, { height: inputHeight + 8 }]}
                    placeholder='Write a description...'
                    value = {description}
                    onChangeText = {handleDescription}
                    onContentSizeChange={handleContentSizeChange}></TextInput>

            <Text style = {styles.text}>Participants</Text>

            <View style = {styles.participantsContainer}>
                <FlatList
                data = {data}
                renderItem= {({item}) => (
                    <SplitBillBox
                        image = {item.image}
                        username = {item.username}
                        name = {item.name}  
                        userID = {item.userID}
                        handleInputChange={handleInputChange}
                        value={userValues[item.userID] || ''}  
                    />
                )}
                />
            </View>
            
            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Create' 
                buttonColor = '#39A5BD' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {320}
                            height = {45}
                            fontSize= {18}
                            onPress = {next}
                            ></CustomButton>
            </View>

        </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
        //justifyContent: 'center', (if change scrollview to view)
        //paddingHorizontal: 35
        backgroundColor: 'white'
    },
    container: {
        flexGrow: 1,
        justifyContent: 'flex-end', //center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontFamily: "Nunito-Sans-Bold",
        textAlign: 'left',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 60,
        marginBottom: 30,
        alignSelf: 'center'
    },
    text: {
        fontSize: 18,
        fontFamily: 'Nunito-Sans-Bold',
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 30
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10
        // backgroundColor:'red',
    },
    participantsContainer: {
        alignItems: 'flex-start',
        height: 450,
        // backgroundColor: 'red'
    },
    inputDescription: {
        textAlign: 'left',
        fontFamily: "Nunito-Sans-Bold",
        backgroundColor: '#EDF2FB',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        width: 340,
        alignSelf: 'center'
    },
})