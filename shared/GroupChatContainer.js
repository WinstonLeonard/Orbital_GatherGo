import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

export default function GroupChatContainer({eventID}) {
    const [eventName, setEventName] = useState('')
    const [imageUrl, setImageUrl] = useState('');
    const [lastMessage, setLastMessage] = useState('');

    return(
    <View style = {styles.groupContainer}>

    <View style = {styles.pfpContainer}>
    <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd'}}
                style = {styles.pfpStyle}
                resizeMode='contain' />
    </View>

    <View style = {styles.nameContainer}>
        <Text style = {styles.nameStyle}> Evan's birthday </Text>

        <Text style = {styles.chatStyle}> Omg </Text>

    </View>

    </View>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 10,
        width: 350,
        alignContent: 'center',
        //borderColor: 'black',
        //borderWidth: 2,
    }, 
    pfpContainer: {
        //backgroundColor: 'red',
        width: 60,
        height: 60,
    },
    pfpStyle: {
        width: 60,
        height: 60,
        borderColor: 'black',
        borderWidth: 2.5,
        borderRadius: 1000, 
    },
    nameContainer: {
        //backgroundColor: 'red',
        textAlign: 'left',
        justifyContent: 'center',
        marginLeft: 10,
    },
    nameStyle: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 24,
        textAlign: 'left',
    },
    chatStyle: {
        fontFamily: 'Nunito-Sans',
        fontSize: 16,
        textAlign: 'left',
        marginLeft: 5,
    }
})