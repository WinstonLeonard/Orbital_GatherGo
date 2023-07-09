import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { ref as firebaseRef, uploadBytes, getDownloadURL  } from "firebase/storage";
import { collection, doc, getDoc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { storage } from '../firebase/firebase-config';
import {Marker} from 'react-native-maps';



export default React.forwardRef(function FriendMapMarker({userID, map}, ref) {

    const [userImage, setUserImage] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=d19c79af-4d10-4400-825e-88578818fef9')
    const [latitude, setLatitude] = useState(33.812511);
    const [longitude, setLongitude] = useState(-117.918976);
    const [username, setUsername] = useState('');
    const [lastOnline, setLastOnline] = useState('');
    const latitudeDelta = 0.01622;
    const longitudeDelta = 0.00821;
    const markerRef = useRef(null);

    //console.log(ref);
    React.useImperativeHandle(ref, () => ({
        functionName,
    }));

    const functionName = (friendName) => {
        //console.log(userID + something);
        if (friendName == userID) {
            map.current.animateToRegion({
                longitudeDelta: longitudeDelta,
                latitudeDelta: latitudeDelta,
                latitude: latitude,
                longitude: longitude,
            })
            markerRef.current.showCallout();
        }
    };

    useEffect(() => {
        async function getProfilePic() {
            const storageRef = firebaseRef(storage, 'Profile Pictures');
            const fileName = userID;
            const fileRef = firebaseRef(storageRef, fileName);
    
            getDownloadURL(fileRef).then((url) => {
              setUserImage(url);
            });
          }
        getProfilePic();
    }, []);

    useEffect(() => {
        //console.log('location');
        async function getLocationAndLastOnline() {
            const docID = userID;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);
    
            const data = docSnap.data();
            const location = data.location;
            const username= data.username;
            const lastOnline = data.lastOnline;
            const currentTime = new Date();
            const timeDifference = lastOnline.toDate() - currentTime.getTime();
            const hoursDifference = (Math.abs(Math.round(timeDifference / (1000 * 60 * 60)))).toString();
            console.log(hoursDifference);

            setLatitude(location.latitude);
            setLongitude(location.longitude);
            setUsername(username);
            setLastOnline(hoursDifference);
            //console.log(lastOnline);
        }
        getLocationAndLastOnline();
    }, []);

    //console.log(functionRef);

    //console.log(functionRef + '2');


    const markerPressed = (e) => {
        const markerLatitude = (e.nativeEvent.coordinate.latitude);
        const markerLongitude = (e.nativeEvent.coordinate.longitude);

        map.current.animateToRegion({
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta,
            latitude: markerLatitude,
            longitude: markerLongitude,
        })
        //friendHandler(userID)
    }

    return (
        <Marker 
            coordinate={{latitude: latitude, longitude: longitude}}
            title = {username}
            description= {'Last seen here ' + lastOnline.toString() + ' hours ago'} 
            onPress = {markerPressed}
            ref = {markerRef}
            >
            <View style = {styles.container}>
                <ImageBackground
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Ffriend%20map%20marker.png?alt=media&token=8f73daea-59a8-4496-a5cd-37e276a5cefc'}}
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
        </Marker>

    )
})

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