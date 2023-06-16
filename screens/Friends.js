import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';

import FriendBox from '../shared/friendBox';

export default function Friends({navigation}) {

    const [myFriendList, setMyFriendList] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const addFriendHandler = () => {
        navigation.navigate('AddFriend');
    }

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
    
            setData(temp);
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

    return (
      <View style={styles.container}>
        
        <View style = {styles.headerContainer}>

            <Text style = {styles.title}> Friends </Text>
            <View style = {styles.iconContainer}>
                <TouchableOpacity onPress = {addFriendHandler}>
                <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fadd%20friend%20icon.png?alt=media&token=0748399e-90f2-464b-b415-26ac5dc2cdb0'}}
                    style = {styles.iconStyle}
                    resizeMode='contain' />
                </TouchableOpacity> 
            </View>
        </View>

        <FlatList
            data = {data}
            renderItem= {({item}) => (
                <FriendBox
                    image = {item.image}
                    username = {item.username}
                    name = {item.name}    
                />
            )}
            />


      </View>
    );
  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 40,
        fontFamily: 'Nunito-Sans-Bold',
    },
    headerContainer: {
        marginTop: 40,
        marginLeft: 20,
        marginBottom: 40,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        alignContentL: 'center',
        //backgroundColor: 'blue',
    },
    iconContainer: {
        //backgroundColor: 'red',
        width: 40,
        height: 40,
        margin: 10,
        marginLeft: 135,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        width: 45,
        height: 45,
        borderColor: 'black',
    },
    friendContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 10,
        width: 350,
        borderColor: 'black',
        borderWidth: 2,
    }, 
    pfpContainer: {
        //backgroundColor: 'red',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pfpStyle: {
        width: 60,
        height: 60,
        borderColor: 'black',
        borderWidth: 0,
        borderRadius: 1000, 
    },
    nameContainer: {
        //backgroundColor: 'red',
        marginLeft: 10,
    },
    usernameStyle: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 24,
    },
    nameStyle: {
        fontFamily: 'Nunito-Sans',
        fontSize: 18,
    }
});
