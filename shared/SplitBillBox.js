import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, TextInput } from 'react-native';

export default function SplitBillBox({image, username, name, userID, handleInputChange, value}) {
    const styles = StyleSheet.create({
        friendContainer: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            marginLeft: 20,
            marginTop: 10,
            width: 350,
            height: 80,
            alignContent: 'center',
            backgroundColor: '#DEF5FF',
            borderRadius: 10,
            // borderColor: 'black',
            // borderWidth: 2,
        }, 
        pfpContainer: {
            // backgroundColor: 'red',
            width: 55,
            height: 55,
            marginLeft: 12,
            marginTop: 12,
        },
        pfpStyle: {
            width: 55,
            height: 55,
            borderColor: 'black',
            borderWidth: 0,
            borderRadius: 1000, 
        },
        nameContainer: {
            //backgroundColor: 'red',
            textAlign: 'left',
            justifyContent: 'center',
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
            marginLeft: 2,
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
        input: {
            backgroundColor: '#B1EBF8',
            width: 80,
            height: 50,
            marginTop: 15,
            left: 255,
            borderRadius: 10,
            position: 'absolute',
            textAlign: 'left',
            fontFamily: "Nunito-Sans-Bold",
            paddingHorizontal: 10,
            paddingVertical: 10,
        },
    })
     
    const onInputChange = (text) => {
        handleInputChange(userID, text);
      };

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

        <TextInput 
            style = {styles.input}
            onChangeText={onInputChange}
            value={value}
            placeholder="$"/>

        </View>
    )
}

