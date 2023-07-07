import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';
import {Marker} from 'react-native-maps';
import { storage } from '../firebase/firebase-config';
import { authentication, db } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import MyMapMarker from '../shared/MyMapMarker';
import CustomButton from '../shared/button';



export default function Nearby({navigation}) {
    const mapRef = React.createRef();
    const latitudeDelta = 0.01622;
    const longitudeDelta = 0.00821;
    const [region, setRegion] = useState({});
    const [location, setLocation] = useState({});

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
    }

    const regionChangeHandler = (e) => {
        console.log('changed');
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
                    >
                    <MyMapMarker></MyMapMarker>       
                </Marker>
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
                            onPress = {() => console.log('pressed')}></CustomButton>
                
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

