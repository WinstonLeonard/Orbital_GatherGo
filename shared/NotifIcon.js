import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import { authentication, db } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';



export default function NotifIcon({number, top, left, textTop, textLeft}) {

    const styles = StyleSheet.create({
        notifStyle: {
            flex: 1,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            textAlignVertical: 'center',
            position: 'absolute',
            top: top,
            left: left,
        },
        textStyle: {
            fontFamily: 'Helvetica-Bold',
            top: textTop,
            // left: textLeft,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: 'white',
            letterSpacing: -1
        }
    })

    if (number === 0) {
        return null;
    } else {
        return (
            <ImageBackground
                source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fred%20circle.png?alt=media&token=123c028a-474c-4d90-9cf2-3ee574c8d8a4'}}
                style = {styles.notifStyle}
                resizeMode='contain'
            >
                <Text style = {styles.textStyle}>{number}</Text>

            </ImageBackground>
    )
    }
}

