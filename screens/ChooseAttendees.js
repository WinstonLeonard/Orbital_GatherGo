import React, { userState } from 'react';
import { View, Text } from 'react-native';

export default function ChooseAttendees({navigation}) {
    return (
        <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress = {() => alert('This is the "Events" screen')}
                style = {{ fontSize: 26, fontWeight: 'bold' }}>Events Screen</Text>
        </View>
    )
}