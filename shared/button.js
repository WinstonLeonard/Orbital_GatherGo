import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function CustomButton({text, onPress}) {
    return (
        <TouchableOpacity
            onPress = {onPress}>
            <View style = {styles.button}>
                <Text style = {styles.buttonText}> {text} </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 15,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 50,
        backgroundColor: '#4DAAB3'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 16,
    }
})
