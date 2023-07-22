import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Image, ScrollView, TextInput } from 'react-native';
import { authentication, db } from '../firebase/firebase-config'
import { updateDoc, doc, getDoc } from "firebase/firestore";

export default function DebtBox({ eventName, hostName, paidHandler, image, moneyOwed, splitBillID}) {

    const [currentMoneyOwed, setCurrentMoneyOwed] = useState('');

    useEffect(() => {
        setCurrentMoneyOwed(moneyOwed);
    }, []);

    const images = {
        categories: {
            'Sports' :"https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd",
            'Eat' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Feat%20icon.png?alt=media&token=ee7bf011-8772-45ef-8555-5ba95fbe0aca",
            'Study' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fstudy%20icon.png?alt=media&token=4af22023-a081-4303-a054-251eaedfe35e",
            'Others' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fothers_icon.png?alt=media&token=c59640d4-5f09-44fc-81a3-b4f72a00b241",
        }
    }

    const styles = StyleSheet.create({
        friendContainer: {
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 10,
            width: 330,
            height: 90,
            alignContent: 'center',
            backgroundColor: '#DEF5FF',
            borderRadius: 15,
            // borderColor: 'black',
            // borderWidth: 2,
        }, 
        pfpContainer: {
            // backgroundColor: 'red',
            width: 55,
            height: 55,
            marginTop: 17.5,
            marginLeft: 10,
        },
        pfpStyle: {
            width: 55,
            height: 55,
            borderColor: 'black',
            borderWidth: 0,
            borderRadius: 1000, 
        },
        nameContainer: {
            // backgroundColor: 'red',
            textAlign: 'left',
            justifyContent: 'center',
            width: 150,
            marginLeft: 10,
        },
        usernameStyle: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 20,
            textAlign: 'left',
        },
        nameStyle: {
            fontFamily: 'Nunito-Sans',
            fontSize: 16,
            textAlign: 'left',
        },
        deleteContainer: {
            width: 43,
            alignSelf: 'center',
            marginLeft: 55,
        },
        deleteStyle: {
            width: 43,
            height: 43,
        },
        editStyle: {
            width: 40,
            height: 40,
            marginBottom: 5,
        },
        input: {
            backgroundColor: '#B1EBF8',
            width: 50,
            height: 45,
            marginTop: 22.5,
            left: 225,
            borderRadius: 10,
            position: 'absolute',
            textAlign: 'center',
            fontFamily: "Nunito-Sans-Bold",
            paddingHorizontal: 8,
            paddingVertical: 12,
        },
    })
    
    const markAsPaid = () => {
        paidHandler(splitBillID);
    }
        return (
            <View style = {styles.friendContainer}>
    
            <View style = {styles.pfpContainer}>
            <Image source = {{uri: image}}
                    style = {styles.pfpStyle}
                    resizeMode='contain' />
            </View>
    
            <View style = {styles.nameContainer}>
                <Text style = {styles.usernameStyle}> {hostName} </Text>
                <Text style = {styles.nameStyle}> {eventName} </Text>
            </View>
            
            <Text style = {styles.input} >{currentMoneyOwed}</Text>

            <View style = {styles.deleteContainer}>
                <TouchableOpacity onPress = {markAsPaid}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Faccept.png?alt=media&token=f9725c52-26e8-44b3-b2a5-62428c785e65'}}
                    style = {styles.editStyle}
                    resizeMode = 'contain'
                    />
                </TouchableOpacity>
            </View>
    
            </View>
        )
}

