import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';

export default function EventRequestBox({ name, category, location, date, time, acceptHandler, rejectHandler}) {
    // const images = {
    //     categories: {
    //         'Sports' : require('../assets/pictures/sports_icon'),
    //         'Eat' : require('../assets/pcitures/eat_icon.png'),
    //         'Study' : require('../assets/pcitures/study_icon.png'),
    //         'Others' : require('../assets/pcitures/others_icon.png')
    //     }
    // }

    const images = {
        categories: {
            'Sports' :"https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd",
            'Eat' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Feat%20icon.png?alt=media&token=8436af79-4fb4-4e2e-8673-03bfcf311f25",
            'Study' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fstudy%20icon.png?alt=media&token=bcb2ccbe-9c13-48ae-a344-b2e328b6762e",
            'Others' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fothers_icon.png?alt=media&token=c59640d4-5f09-44fc-81a3-b4f72a00b241",
        }
    }


    const styles = StyleSheet.create({
        friendContainer: {
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
            borderWidth: 0,
            // borderRadius: 1000, 
        },
        nameContainer: {
            //backgroundColor: 'red',
            textAlign: 'left',
            justifyContent: 'center',
            marginLeft: 10,
        },
        usernameStyle: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 24,
            textAlign: 'left',
        },
        nameStyle: {
            fontFamily: 'Nunito-Sans',
            fontSize: 16,
            textAlign: 'left',
            marginLeft: 5,
        },
        buttonContainer: {
            //backgroundColor: 'red',
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            left: 220,
            top: 10,
        },
        buttonStyle: {
            width: 50,
            height: 50,
            borderColor: 'black',
            borderWidth: 0,
            borderRadius: 1000,
            marginLeft: 10, 
        },
    
    })
    
    return (
        <View style = {styles.friendContainer}>

        <View style = {styles.pfpContainer}>
        <Image source = {{uri: images.categories[category]}}
                    style = {styles.pfpStyle}
                    resizeMode='contain' />
        </View>

        <View style = {styles.nameContainer}>
            <Text style = {styles.usernameStyle}> {name} </Text>

            <Text style = {styles.nameStyle}> {category} </Text>
            <Text style = {styles.nameStyle}> {location} </Text>
            <Text style = {styles.nameStyle}> {date} </Text>
            <Text style = {styles.nameStyle}> {time} </Text>
        </View>

        <View style = {styles.buttonContainer}>

        <TouchableOpacity onPress = {acceptHandler}>
        <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Faccept.png?alt=media&token=f9725c52-26e8-44b3-b2a5-62428c785e65'}}
               style  = {styles.buttonStyle}
               resizeMode= 'contain'/>
        </TouchableOpacity>

        <TouchableOpacity onPress = {rejectHandler}>
        <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Freject.png?alt=media&token=e017d54d-c65f-4e12-97d6-4301f0b92b76'}}
               style  = {styles.buttonStyle}
               resizeMode= 'contain'/>
        </TouchableOpacity>

        </View>

        </View>
    )
}

