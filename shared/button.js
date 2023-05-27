import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function CustomButton({text, buttonColor, textColor, onPress, cornerRadius}) {
    const styles = StyleSheet.create({
        button: {
            marginTop: 15,
            borderRadius: cornerRadius,
            width: 155,
            height: 60,
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: buttonColor
        },
        buttonText: {
            color: textColor,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Nunito-Sans',
            fontSize: 18,
        }
    })
    
    return (
        <TouchableOpacity
            onPress = {onPress}>
            <View style = {styles.button}>
                <Text style = {styles.buttonText}> {text} </Text>
            </View>
        </TouchableOpacity>
    )
}

