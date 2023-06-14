import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import { authentication, db } from '../firebase/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';


export default function Profile({navigation}) {
    const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=87d91cbe-47e8-45fb-a25c-f69cfa3f9654');
    const [username, setUsername] = useState('');
    
    const editProfileHandler = () => {
        navigation.navigate('EditProfile');
    }

    const friendsHandler = () => {
        navigation.navigate('Friends');
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

    useEffect(() => {
        async function getProfilePic() {
            const storageRef = ref(storage, 'Profile Pictures');
            const fileName = authentication.currentUser.uid;

            // const storageRef = ref(storage, 'Icons');
            // const fileName = 'reject.png'
            
            const fileRef = ref(storageRef, fileName);
    
            getDownloadURL(fileRef)
            .then((url) => {
                //console.log(url);
                setImage(url);
            })
        }
        getProfilePic();
      }, []);

      const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: false,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        if (!result.canceled) {
            //console.log(result.assets[0].uri);
            //setImage({ uri: result.assets[0].uri });
            setImage( result.assets[0].uri );
            uploadImageAsync(result.assets[0].uri);
        }
      };
    
    const metadata = {
        contentType: 'image/jpeg',
    };

    async function uploadImageAsync(image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, 'Profile Pictures');
        const fileName = authentication.currentUser.uid;
        const fileRef = ref(storageRef, fileName);

        uploadBytes(fileRef, blob, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
    }


    return (

        <View style = {styles.container}>

            <View style = {styles.titleContainer}> 
                <Text style = {styles.title}> My</Text>
                <Text style = {styles.title}> Profile</Text>
            </View>

            <TouchableOpacity onPress = {pickImage}> 
            <View style = {styles.imageContainer}>
                <Image source = {{uri: image}}
                        style = {styles.imageStyle}
                        resizeMode='contain'/>
            </View>
            </TouchableOpacity>

            <Text style = {styles.name}> {username} </Text>

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

            <TouchableOpacity>
            <View style = {styles.button}>
            <View style = {styles.iconContainer}>
            <Image source = {require('../assets/pictures/history.png')}
                       style = {styles.iconStyle}
                       resizeMode='contain'/>
            </View>
                <Text style = {styles.buttonText}> View Past Events </Text>
            </View>
            </TouchableOpacity>

        </View>


    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    titleContainer: {
        position: 'absolute',
        top: 65,
        left: 40,
    },
    title: {
        fontSize: 40,
        fontFamily: "Nunito-Sans-Bold",
        color: 'black',  
    },
    name: {
        fontSize: 40,
        fontFamily: "Nunito-Sans-Bold",
        marginBottom: 25,   
        color: 'black',
    },     
    imageContainer: {
        //backgroundColor: 'red',
        marginTop: 190,
        marginBottom: 20,
    },
    imageStyle: {
        width: 180,
        height: 180,
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
})