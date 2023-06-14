import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import FriendRequestBox from '../shared/friendRequestBox';
import { reauthenticateWithCredential } from 'firebase/auth';



export default function AddFriend({navigation}) {
    const [name, setName] = useState('');
    const [myFriendRequestList, setMyFriendRequestList] = useState([]);
    const [data, setData] = useState([]);

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
                const acceptHandler = () => {
                    console.log(friendUsername + ' Accepted');
                }
                const rejectHandler = () => {
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
                    return;
                }

                setDoc(friendRef, {
                    friendRequestList: [...friendFriendRequestList, myDocID],
                }, { merge: true });

                Alert.alert('Request Sent!', 'A Friend Request has been sent to ' + friendUsername, 
                [{text: 'Understood.'}])

                //console.log(friendFriendRequestList);
                console.log('Found documents:', friend);
            } else {
                // Handle case when no documents are found
                Alert.alert('Error!', 'That username does not exist.', 
                [{text: 'Understood.'}])
                return;
            }
        } catch (error) {
            // Handle errors
            console.error('Error searching for documents:', error);
        }
      };


    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>


            <Text style = {styles.header}> Add friends by their username </Text>

            <View style = {styles.inputContainer}>

            <TextInput
                style={styles.textInput}
                placeholder="Enter your friend's username..."
                value={name}
                onChangeText={text => setName(text)}>
                
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
            
            {/* <FriendRequestBox
                image = 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'
                username = 'Chronal'
                name = 'Winston'
            /> */}

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
