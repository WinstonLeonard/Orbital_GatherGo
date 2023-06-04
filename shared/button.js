import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function CustomButton({text, buttonColor, textColor, onPress, cornerRadius, width, height, fontSize}) {
    const styles = StyleSheet.create({
        button: {
            marginTop: 15,
            borderRadius: cornerRadius,
            width: width,
            height: height,
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: buttonColor
        },
        buttonText: {
            color: textColor,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Nunito-Sans',
            fontSize: fontSize,
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

