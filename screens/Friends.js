import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { useData } from '../shared/DataContext';
import NotifIcon from '../shared/NotifIcon';


import FriendBox from '../shared/friendBox';

export default function Friends({navigation}) {

    const [myFriendList, setMyFriendList] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {friendRequestCount} = useData();
    const {setFriendRequestCount} = useData();


    const addFriendHandler = () => {
        navigation.navigate('AddFriend');
    }

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const myDocID = authentication.currentUser.uid;
                const myDocRef = doc(db, "users", myDocID);
                const myDocSnap = await getDoc(myDocRef);
        
                const myData = myDocSnap.data();
                setMyFriendList(myData.friendList);
                setFriendRequestCount(myData.friendRequestList.length);
            }
        fetchData();
        console.log('friends');
    },[])
    );
    
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
          <View>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
    }

    return (
      <View style={styles.container}>
        <StatusBar style="auto"/>
        <View style = {styles.headerContainer}>

            <Text style = {styles.title}> Friends </Text>
            <View style = {styles.iconContainer}>
                <TouchableOpacity onPress = {addFriendHandler}>
                <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fadd%20friend%20icon.png?alt=media&token=0748399e-90f2-464b-b415-26ac5dc2cdb0'}}
                    style = {styles.iconStyle}
                    resizeMode='contain' />

                <NotifIcon number = {friendRequestCount} textTop = {-2} textLeft = {0} top = {28} left = {25}/>
                </TouchableOpacity> 
            </View>
        </View>
        <Text style = {styles.text}> Number of friends: {myFriendList.length}</Text>
        
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
        fontSize: 24,
        fontFamily: 'Nunito-Sans-Bold',
        flex: 1,
        textAlign: 'center',
        paddingLeft: 70,
        fontWeight: 'bold',
    },
    headerContainer: {
        marginTop: 40,
        marginBottom: 40,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        alignContentL: 'center',
        // backgroundColor: 'blue',
    },
    iconContainer: {
        width: 40,
        height: 40,
        margin: 10,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red',
    },
    iconStyle: {
        width: 35,
        height: 35,
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
    },
    text: {
        fontFamily: 'Nunito-Sans-Bold',
        alignSelf: 'flex-start',
        marginLeft: 30,
        fontSize: 20,
    },
});
