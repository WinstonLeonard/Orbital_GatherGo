import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { storage } from '../firebase/firebase-config';


export default function MyMapMarker() {
    const [userImage, setUserImage] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=d19c79af-4d10-4400-825e-88578818fef9')
    
    useEffect(() => {
        async function getProfilePic() {
            const storageRef = ref(storage, 'Profile Pictures');
            const fileName = authentication.currentUser.uid;
            const fileRef = ref(storageRef, fileName);
    
            getDownloadURL(fileRef).then((url) => {
              setUserImage(url);
            });
          }
        getProfilePic();
    }, []);
    return (
        <View style = {styles.container}>
            <ImageBackground
                source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fmy%20map%20marker%20v2.png?alt=media&token=40bfbf85-275f-4565-a89a-fde41a6ab5bd'}}
                style = {styles.imageStyle}
                resizeMode = 'cover'>

                <View style = {styles.circle}>
                    <Image
                        source = {{uri: userImage}}
                        style = {styles.pfpStyle}
                        resizeMode= 'contain'
                        />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: 55,
        //backgroundColor: 'black',
        justifyContent: 'center',
    },
    circle: {
        width: 35,
        height: 35,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 1000,
        position: 'absolute',
        left: 10,
        top: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 55,
        height: 55,
    },
    pfpStyle: {
        width: 35,
        height: 35,
        borderRadius: 1000,
    }
})