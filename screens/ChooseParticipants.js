import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';


export default function ChooseParticipants({navigation, route}) {
    
    //loading friendlist
    const [myFriendList, setMyFriendList] = useState([]);
    const [friendData, setFriendData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
    
            const myData = myDocSnap.data();
            setMyFriendList(myData.friendList);
        }
        fetchData();
    },[]);
    
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < myFriendList.length; i++) {
                const friendUid = myFriendList[i];

                const docPromise = getDoc(doc(db, "users", friendUid));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const friendData = docSnapshot.data();
                const friendUsername = friendData.username;
                const friendName = friendData.name;
                
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
    }, [myFriendList]);

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }

    //adding to invitedList
    const {data} = route.params;
    const eventID = data;
    const eventRef = doc(db, 'events', eventID);

    
    return (
        <KeyboardAvoidingView
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-400}
        behavior = "padding">
    
            <ScrollView
                contentContainerStyle = {styles.container}>

            
            <View style = {styles.inputContainer}> 
                <Text style = {styles.title}>Choose Participants</Text>
                
                <MultipleSelectList
                    arrowicon={
                        <Text> </Text>
                    }
                    inputStyles = {styles.placeholder}
                    boxStyles= {styles.selectListBox}
                    search = {true} 
                    //setSelected={(val) => setCategory(val)} 
                    data={friendData}
                    placeholder='Choose Participates' 
                    fontFamily='Nunito-Sans-Bold'
                    alignItems= 'center'
                    save="value"/>

            </View>

            <View style = {styles.buttonContainer}>
            <CustomButton text = 'Send Invitation' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {320}
                            height = {45}
                            fontSize= {18}
                            onPress = {console.log('data')}
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
        fontSize: 30,
        marginTop: 80,
        marginBottom: 25,
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
})