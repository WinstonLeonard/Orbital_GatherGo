import React, {useState, useEffect, useRef } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import * as Location from 'expo-location';
import {Marker, Callout} from 'react-native-maps';
import { storage } from '../firebase/firebase-config';
import { authentication, db } from '../firebase/firebase-config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import MyMapMarker from '../shared/MyMapMarker';
import CustomButton from '../shared/button';
import FriendMapMarker from '../shared/FriendMapMarker';


export default function Nearby({navigation}) {
    const mapRef = React.createRef();
    const markerRef = React.createRef();
    const latitudeDelta = 0.01622;
    const longitudeDelta = 0.00821;
    const [region, setRegion] = useState({});
    const [location, setLocation] = useState({});
    const [friends, setFriends] = useState([]);
    const [data, setData] = useState([]);
    const friendMapMarkerRefs = useRef([]);

    useEffect(() => {
        (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
        })
        })();
    }, []);

    async function getFriends() {
        const docID = authentication.currentUser.uid;
        const docRef = doc(db, "users", docID);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();
        const friends = data.friendList;
        setFriends(friends);     
    }
    useEffect(() => {
        getFriends();
    }, [])

    useEffect(() => {
        const temp = [];
        for (let i = 0; i < friends.length; i++) {
            const friendUid = friends[i];
                        
            const object = {
                userID: friendUid,
                key: i,
            };
                        
            temp.push(object);
        }
        setData(temp);
      }, [friends])
    
    let counter = 0;

    const friendHandler = () => {
        const numOfFriends = friends.length;
        const index = counter % numOfFriends
        const friend = friends[index];
        friendMapMarkerRefs.current.forEach((ref) => {
            if (ref && ref.functionName) {
              ref.functionName(friend);
            }
        });
        counter = counter + 1;
    }  
    const myMarkerPressed = (e) => {
        const markerLatitude = (e.nativeEvent.coordinate.latitude);
        const markerLongitude = (e.nativeEvent.coordinate.longitude);

        setRegion({
            latitude: markerLatitude,
            longitude: markerLongitude,
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta,
        })

        mapRef.current.animateToRegion({
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        })
        markerRef.current.showCallout();
    }

    const myButtonHandler = () => {
        
        setRegion({
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        })

        mapRef.current.animateToRegion({
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        })
        markerRef.current.showCallout();
    }


    return (
        <View style={styles.container}>
            <MapView
                ref= {mapRef} 
                style={styles.map}
                region = {region}
                //onRegionChange={regionChangeHandler}
                >
                <Marker
                    coordinate={{latitude: region.latitude, longitude: region.longitude}}
                    title = 'You'
                    onPress = {myMarkerPressed}
                    ref = {markerRef}
                    >
                    <MyMapMarker></MyMapMarker>
                    <Callout onPress = {()=> console.log('fuck')}></Callout>
                </Marker>

                {data.map((item) => (
                    <FriendMapMarker
                    key={item.key}
                    userID={item.userID}
                    map={mapRef}
                    ref={(ref) => (friendMapMarkerRefs.current[item.key] = ref)}
                    />
                ))}

            </MapView>
            <View style = {styles.buttonsContainer}>
                <CustomButton text = 'My Location' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {100}
                            height = {40}
                            fontSize = {16}
                            onPress = {myButtonHandler}></CustomButton>
                
                <CustomButton text = 'Friends' 
                            buttonColor = '#2F2E2F' 
                            textColor = 'white'
                            cornerRadius= {10} 
                            width = {100}
                            height = {40}
                            fontSize = {16}
                            onPress = {friendHandler}></CustomButton>
                
            </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    imageStyle: {
        width: 20,
        height: 20,
    },
    buttonsContainer: {
        width: '70%',
        height: 50,
        position: 'absolute',
        bottom: 65,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
    }
  });

