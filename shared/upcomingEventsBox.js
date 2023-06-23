import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

export default function UpcomingEventsBox({ name, category, location, date, time, acceptHandler, rejectHandler}) {

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
            alignSelf: 'flex-start',
            marginLeft: 10,
            marginTop: 10,
            width: 370,
            height: 110,
            alignContent: 'center',
            backgroundColor: '#DEF5FF',
            borderRadius: 10,
            // borderColor: 'black',
            // borderWidth: 2,
        }, 
        pfpContainer: {
            // backgroundColor: 'red',
            marginTop: 15,
            marginLeft: 10,
            width: 70,
            height: 80,
        },
        pfpStyle: {
            width: 70,
            height: 70,
            borderColor: 'black',
            borderWidth: 0,
        },
        nameContainer: {
            //backgroundColor: 'red',
            textAlign: 'left',
            justifyContent: 'center',
            marginLeft: 10,
        },
        usernameStyle: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 18,
            textAlign: 'left',
        },
        nameStyle: {
            fontFamily: 'Nunito-Sans',
            fontSize: 14,
            textAlign: 'left',
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
            <Text style = {styles.nameStyle}> {location} </Text>
            <Text style = {styles.nameStyle}> {date} </Text>
            <Text style = {styles.nameStyle}> {time} </Text>
        </View>

        </View>
    )
}

