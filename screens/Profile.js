import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import { authentication, db } from '../firebase/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons'; 
import { signOut } from "firebase/auth";
import { StatusBar } from "expo-status-bar";



export default function Profile({navigation}) {
    const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=87d91cbe-47e8-45fb-a25c-f69cfa3f9654');
    const [username, setUsername] = useState('');
    
    const editProfileHandler = () => {
        navigation.navigate('EditProfile');
    }

    const friendsHandler = () => {
        navigation.navigate('Friends');
    }

    const pastEventsHandler = () => {
        navigation.navigate('PastEvents');
    }

    const logoutHandler = () => {
        signOut(authentication).then(() => {
            //signed out
        }).catch((error) => {

        });
    }

    useEffect(() => {
        async function getUsername() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            setUsername(data.username);
               
        }
        getUsername();
      }, []);

      useFocusEffect(
        React.useCallback(() => {
          async function getProfilePic() {
            const storageRef = ref(storage, 'Profile Pictures');
            const fileName = authentication.currentUser.uid;
            const fileRef = ref(storageRef, fileName);
    
            getDownloadURL(fileRef).then((url) => {
              setImage(url);
            });
          }
          getProfilePic();
        }, [])
      );

    return (

        <View style = {styles.container}>
            <StatusBar style="auto"/>
            <View style = {styles.titleContainer}> 
                <Text style = {styles.title}> My Profile</Text>
            </View>

            <View style = {styles.profileContainer}>
                <View style = {styles.imageContainer}>
                    <Image source = {{uri: image}}
                            style = {styles.imageStyle}
                            resizeMode='contain'/>
                </View>

                <View style = {{justifyContent: 'space-around'}}>
                <Text style = {styles.name}> {username} </Text>
                </View>
            </View>

            <TouchableOpacity onPress = {editProfileHandler}>
            <View style = {styles.button}>
                <View style = {styles.iconContainer}>
                <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fperson%20icon.png?alt=media&token=f47fc314-b95f-4957-a2b4-3ede7adaed6a'}}
                       style = {styles.personIconStyle}
                       resizeMode='contain'/>
                </View>
                <Text style = {styles.buttonText}> Edit Profile </Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {friendsHandler}>
            <View style = {styles.button}>
            <View style = {styles.iconContainer}>
            <Image source = {require('../assets/pictures/user-friends.png')}
                       style = {styles.iconStyle}
                       resizeMode='contain'/>
            </View>
                <Text style = {styles.buttonText}> Friends </Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {pastEventsHandler}>
            <View style = {styles.button}>
            <View style = {styles.iconContainer}>
            <Image source = {require('../assets/pictures/history.png')}
                       style = {styles.iconStyle}
                       resizeMode='contain'/>
            </View>
                <Text style = {styles.buttonText}> View Past Events </Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {logoutHandler}>
            <View style = {styles.button}>
            <View style = {styles.iconContainer}>
            <Entypo name="log-out" size={32} color="black" />
            </View>
                <Text style = {styles.buttonText}> Logout </Text>
            </View>
            </TouchableOpacity>

        </View>


    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    titleContainer: {
        position: 'absolute',
        top: 60,
        left: 140,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontFamily: "Nunito-Sans-Bold",
        color: 'black',  
        fontWeight: 'bold',
    },
    name: {
        fontSize: 32,
        fontFamily: "Nunito-Sans-Bold", 
        color: 'black',
    },     
    imageContainer: {
        // backgroundColor: 'red',
        marginTop: 20,
        marginBottom: 20,
    },
    imageStyle: {
        width: 120,
        height: 120,
        borderRadius: 1000,
        borderWidth: 6,
        borderColor: 'black',
    },
    button: {
        marginBottom: 25,
        borderRadius: 20,
        width: 335,
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#EDF2FB',
        flexDirection: 'row',
    },
    buttonText: {
        color: 'black',
        marginLeft: -8,
        fontFamily: 'Nunito-Sans',
        fontSize: 24,
    },
    iconContainer: {
        //backgroundColor: 'red',
        width: 40,
        height: 40,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        width: 45,
        height: 45,
        borderColor: 'black',
    },
    personIconStyle: {
        width: 37,
        height: 37,
        borderColor: 'black',
    },
    profileContainer: {
        flexDirection: 'row',
        marginTop: 120,
        marginBottom: 30,
        // backgroundColor: 'red'
    },
})