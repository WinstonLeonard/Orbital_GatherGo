import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

export default function MoneyOwedBox({image, username, name, debt, userID}) {
    const styles = StyleSheet.create({
        friendContainer: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            marginLeft: 15,
            marginTop: 5,
            width: 320,
            alignItems: 'center',
            //backgroundColor: 'red',
            //borderColor: 'black',
            //borderWidth: 2,
        }, 
        pfpContainer: {
            //backgroundColor: 'red',
            width: 40,
            height: 40,
        },
        pfpStyle: {
            width: 40,
            height: 40,
            borderColor: 'black',
            borderWidth: 0,
            borderRadius: 1000, 
        },
        nameContainer: {
            //backgroundColor: 'red',
            textAlign: 'left',
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: 7,
        },
        usernameStyle: {
            fontFamily: 'Popins-Bold',
            fontSize: 16,
            textAlign: 'left',
        },
        nameStyle: {
            fontFamily: 'Popins',
            fontSize: 16,
            textAlign: 'left',
        },
        moneyContainer: {
            position: 'absolute',
            left: 240,
            backgroundColor: '#B1EBF8',
            width: 70,
            height: 40,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 8,
        },
        moneyStyle: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 16,
            textAlign: 'center',
        },
        paidContainer: {
            position: 'absolute',
            left: 240,
            backgroundColor: '#39A5BD',
            width: 70,
            height: 40,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 8,
        },
        paidStyle: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 16,
            textAlign: 'center',
            color: 'white'
        },
    })
    
    return (
        <View style = {styles.friendContainer}>

        <View style = {styles.pfpContainer}>
        <Image source = {{uri: image}}
                    style = {styles.pfpStyle}
                    resizeMode='contain' />
        </View>

        <View style = {styles.nameContainer}>
            <Text style = {styles.usernameStyle}> {username} </Text>

            <Text style = {styles.nameStyle}> {name} </Text>

        </View>
        {debt === 0 ? (
        <View style = {styles.paidContainer}>
            <Text style = {styles.paidStyle}>Paid</Text>
        </View>
        ) : (        
        <View style = {styles.moneyContainer}>
            <Text style = {styles.moneyStyle}>${debt} </Text>
        </View>)}


        </View>
    )
}

