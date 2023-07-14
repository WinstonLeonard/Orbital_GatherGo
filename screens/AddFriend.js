import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator  } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import FriendRequestBox from '../shared/friendRequestBox';
import { reauthenticateWithCredential } from 'firebase/auth';
import { StatusBar } from "expo-status-bar";



export default function AddFriend({navigation}) {
    const [name, setName] = useState('');
    const [myFriendRequestList, setMyFriendRequestList] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        async function fetchData() {
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);
    
            const myData = myDocSnap.data();
            setMyFriendRequestList(myData.friendRequestList);
        }
        fetchData();
    },[]);    

    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
    
            for (let i = 0; i < myFriendRequestList.length; i++) {
                const friendUid = myFriendRequestList[i];
                const storageRef = ref(storage, 'Profile Pictures');
                const fileName = friendUid;
                const fileRef = ref(storageRef, fileName);
    
                const urlPromise = getDownloadURL(fileRef);
                const docPromise = getDoc(doc(db, "users", friendUid));
    
                const [url, docSnapshot] = await Promise.all([urlPromise, docPromise]);
    
                const myData = docSnapshot.data();
                const friendUsername = myData.username;
                const friendName = myData.name;
                const acceptHandler = async () => {
                    const myDocID = authentication.currentUser.uid;
                    const myDocPromise = getDoc(doc(db, "users", myDocID));
                    const friendDocPromise = getDoc(doc(db, "users", friendUid));
                    const [myDocSnapshot, friendDocSnapshot] = await Promise.all([myDocPromise, friendDocPromise]);

                    const myData = myDocSnapshot.data();
                    const friendData = friendDocSnapshot.data();
                    
                    const myCurrentFriendRequestList = myData.friendRequestList;
                    const myFriendList = myData.friendList;
                    const friendFriendList = friendData.friendList;

                    const myNewFriendRequestList = myCurrentFriendRequestList.filter(item => item != friendUid);
                    const myNewFriendList = [...myFriendList, friendUid];
                    const friendNewFriendList = [...friendFriendList, myDocID];

                    const friendRef = doc(db, 'users', friendUid);
                    const myRef = doc(db, 'users', myDocID);
                    
                    setDoc(myRef, {
                        friendRequestList: myNewFriendRequestList,
                        friendList: myNewFriendList,
                    }, { merge: true });

                    setDoc(friendRef, {
                        friendList: friendNewFriendList,
                    }, { merge: true });

                    setMyFriendRequestList(myNewFriendRequestList);
                    console.log(friendUsername + ' Accepted');
                }
                const rejectHandler = async () => {
                    const myDocID = authentication.currentUser.uid;
                    const myDocPromise = getDoc(doc(db, "users", myDocID));
                    const [myDocSnapshot] = await Promise.all([myDocPromise]);

                    const myData = myDocSnapshot.data();
                    
                    const myCurrentFriendRequestList = myData.friendRequestList;
                    const myNewFriendRequestList = myCurrentFriendRequestList.filter(item => item != friendUid);

                    const myRef = doc(db, 'users', myDocID);
                    setDoc(myRef, {
                        friendRequestList: myNewFriendRequestList,
                    }, { merge: true });

                    setMyFriendRequestList(myNewFriendRequestList);
                    console.log(friendUsername + ' Rejected');
                }
            
                
                const object = {
                    username: friendUsername,
                    name: friendName,
                    image: url,
                    key: i,
                    acceptHandler: acceptHandler,
                    rejectHandler: rejectHandler
                };
                
                temp.push(object);
            }
    
            setData(temp);
            setIsLoading(false);
        };
    
        fetchData();
    }, [myFriendRequestList]);


    const add = () => {
        //console.log(name);
        // Example usage
        searchDocuments('users', 'username', name);
    }

    const searchDocuments = async (collectionPath, field, value) => {
        try {
            const myDocID = authentication.currentUser.uid;
            const myDocRef = doc(db, "users", myDocID);
            const myDocSnap = await getDoc(myDocRef);

            const myData = myDocSnap.data();
            const myUsername = myData.username;

            const q = query(collection(db, collectionPath), where(field, '==', value));
            const querySnapshot = await getDocs(q);

            if (name == myUsername) {
                Alert.alert('Error!', 'You cannot add yourself.', 
                [{text: 'Understood.'}])
                setInputValue('');
                return;
            }
        
            if (!querySnapshot.empty) {
                const documents = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
                const friend = documents[0];
                
                const friendUid = friend.uid;
                const friendUsername = friend.username;
                const friendFriendList = friend.friendList;
                const friendFriendRequestList = friend.friendRequestList;
                const friendRef = doc(db, 'users', friendUid);

                if (friendFriendRequestList.includes(myDocID)) {
                    Alert.alert('Error!', 'A Friend Request has already been sent to ' + friendUsername + 
                    '. Wait until your friend accepts your friend request.', 
                    [{text: 'Understood.'}]);
                    setInputValue('');
                    return;
                }

                if (friendFriendList.includes(myDocID)) {
                    Alert.alert('Error!', friendUsername + ' is already your friend.', 
                    [{text: 'Understood.'}]);
                    setInputValue('');
                    return;
                }

                setDoc(friendRef, {
                    friendRequestList: [...friendFriendRequestList, myDocID],
                }, { merge: true });

                Alert.alert('Request Sent!', 'A Friend Request has been sent to ' + friendUsername, 
                [{text: 'Understood.'}])
                setInputValue('');

                //console.log(friendFriendRequestList);
                //console.log('Found documents:', friend);
            } else {
                // Handle case when no documents are found
                Alert.alert('Error!', 'That username does not exist.', 
                [{text: 'Understood.'}])
                setInputValue('');
                return;
            }
        } catch (error) {
            // Handle errors
            console.error('Error searching for documents:', error);
        }
      };


    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <StatusBar style="auto"/>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }


    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>
        <StatusBar style="auto"/>


            <Text style = {styles.header}> Add friends by their username </Text>

            <View style = {styles.inputContainer}>

            <TextInput
                style={styles.textInput}
                placeholder="Enter your friend's username..."
                value={inputValue}
                onChangeText={text => {setName(text)
                                       setInputValue(text)}}>
                
            </TextInput>
            <View style={styles.line} /> 
            
            </View>

            <CustomButton text = 'Add' 
                          buttonColor = '#39A5BD' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {add}></CustomButton>
            
            <View style = {styles.secondHeaderContainer}>
                <Text style = {styles.secondHeader}>Incoming Friend Requests</Text>
            </View>

            <FlatList
            data = {data}
            renderItem= {({item}) => (
                <FriendRequestBox
                    image = {item.image}
                    username = {item.username}
                    name = {item.name}
                    acceptHandler= {item.acceptHandler}
                    rejectHandler= {item.rejectHandler}    
                />
            )}/>

            

        </View>
        </KeyboardAvoidingView>
    )
  
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        fontFamily: "Nunito-Sans-Bold",
        fontSize: 20,
        marginTop: 70,
        marginBottom: 45,
    },
    inputContainer: {
        width: 275,
        marginBottom: 40,
    },
    textInput: {
        fontFamily: 'Nunito-Sans',
        textAlign: 'center',    
        fontSize: 16,
        paddingVertical: 8,
      },
    line: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'grey',
        elevation: 3, // Adjust the elevation value as needed
    },
    secondHeaderContainer: {
        marginTop: 110,
        marginBottom: 30,
        textAlign: 'center',
    },
    secondHeader: {
        fontFamily: "Nunito-Sans-Bold",
        fontSize: 20,
    },
})
