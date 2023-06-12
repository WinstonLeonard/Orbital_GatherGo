import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { collection, doc, getDoc } from 'firebase/firestore';
import CustomButton from '../shared/button';


export default function  Home({navigation}) {

    const image = require("../assets/pictures/HomescreenBackground.png")
    const [username, setUsername] = useState('')

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

    // const handleLogout = () => {
    //     authentication.signOut()
    //     .then(() => {
    //         navigation.replace('NewLogin')
    //     })
    //     .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.log(errorMessage)
    //         // ..
    //       })
    // }

    return (
        <ImageBackground source={image} resizeMode = 'cover' style={styles.image}>
            <View style = {styles.container}> 
                    <Text style = {styles.title}> Hello, </Text>
                    <Text style = {styles.title}> {username} </Text>
            </View>

            <View style = {styles.signInOptions}>
                <TouchableOpacity
                        onPress={() => console.log("Button pressed")}
                    >
                    <Image
                    source={require('../assets/pictures/nearby.png')}
                    style={styles.icons}
                    />
                </TouchableOpacity> 

                <TouchableOpacity
                        onPress={() => console.log("Button pressed")}
                    >
                    <Image
                    source={require('../assets/pictures/expenses.png')}
                    style={styles.icons}
                    />
                </TouchableOpacity> 
            </View>

            <View style = {styles.UpcomingEvents}> 
                    <Text style = {styles.title}> Up-coming Events: </Text>
            </View>

            <TouchableOpacity style = {styles.users} onPress={() => console.log("Button pressed")}>
                <Text style = {styles.dummy}>    Evan's Birthday🎉</Text>
                <Text style = {styles.dummy}>   📍Bread Street Kitchen                 12.00 pm</Text>
                <Text style = {styles.dummy}>    🗓️ 5 August, 2023</Text>
            </TouchableOpacity> 
        </ImageBackground>
    )

}


const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginBottom: 50,
        width: '80%'
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 28,
    },
    image: {
        flex: 1,
        alignItems: 'center',
    },
    signInOptions: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-evenly' , // Add equal spacing between buttons
        width: '100%', // Take full width of the container      
    },
    icons: {
        width: 170,
        height: 170,
        resizeMode: 'cover',
    },
    UpcomingEvents: {
        marginTop: 170,
        marginBottom: 15,
        width: '80%'
    },
    users: {
        width: 310,
        height: 140,
        backgroundColor: '#AEE9F6',
        borderRadius: 15
    },
    dummy: {
        marginTop: 20
    }
})