import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, KeyboardAvoidingView, ScrollView, FlatList } from 'react-native';
import { authentication, db, storage } from '../firebase/firebase-config';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../shared/button';
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL  } from "firebase/storage";
import FriendBoxForPopUp from '../shared/FriendBoxForPopUp';

export default function UpdateParticipants({navigation, route}) {
    
    //loading friendlist
    const {eventID} = route.params;
    const [myFriendList, setMyFriendList] = useState([]);
    const [friendData, setFriendData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [invitationList, setInvitationList] = useState([]);
    const [alreadyInvited, setAlreadyInvited] = useState([]);
    const [notYetInvited, setNotYetInvited] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        async function fetchData() {
            //getting friends list
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
    
            const myData = myDocSnap.data();
            setMyFriendList(myData.friendList);
            
            //getting already invited
            const docPromise = getDoc(doc(db, "events", eventID));

            const [docSnapshot] = await Promise.all([docPromise]);

            const eventData = docSnapshot.data();
            setAlreadyInvited(eventData.invitationList);

            //filtering not yet invited
            const notInvited = myFriendList.filter((friendUid) => !alreadyInvited.includes(friendUid));
            setNotYetInvited(notInvited);
        }
        fetchData();
    },[]);

    useEffect(() => {
        const fetchData = async () => {
            const temp = [];

            for (let i = 0; i < notYetInvited.length; i++) {
                const friendUid = notYetInvited[i];

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
    }, [notYetInvited]);

    //displaying already invited
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < alreadyInvited.length; i++) {
                const friendUid = alreadyInvited[i];
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
                };
                
                temp.push(object);
            }
    
            setParticipants(temp);
        };
    
        fetchData();
    }, [alreadyInvited]);

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }

    const update = async () => {
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

        const currentInvitedlist = [...alreadyInvited, invitationList];
        console.log(alreadyInvited);

        const eventRef = doc(db, 'events', eventID);
        setDoc(eventRef, {
            invitationList: currentInvitedlist,
        }, { merge: true });

        navigation.navigate("EditEvent");
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
                <Text style = {styles.title}>Update Participants</Text>
                
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

                <Text style = {styles.text}>Already Invited</Text>
                <View style={styles.line} /> 
                
                <FlatList
                  scrollEnabled = {false} 
                  data = {participants}
                  renderItem= {({item}) => (
                      <FriendBoxForPopUp
                          image = {item.image}
                          username = {item.username}
                          name = {item.name}    
                      />
                  )}/>

            </View>

            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Update' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {320}
                            height = {45}
                            fontSize= {18}
                            onPress = {update}
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
    text: {
        fontFamily: "Nunito-Sans-Bold",
        textAlign: 'left',
        color: '#2F2E2F',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 60,
        marginBottom: 10,
        marginLeft: 5,
        alignSelf: 'flex-start'
    },
    line: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        marginBottom: 10,
        backgroundColor: '#39A5BD',
        elevation: 3, // Adjust the elevation value as needed
    },
})