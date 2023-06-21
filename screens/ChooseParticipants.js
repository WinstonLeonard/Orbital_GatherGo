import React, { userState } from 'react';
import { View, Text } from 'react-native';

export default function ChooseParticipants({navigation, route}) {
    
    const {data} = route.params;
    const eventID = data;

    
    // const eventRef = doc(db, 'events', eventID);


    return (
        <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress = {() => alert('This is the "Events" screen')}
                style = {{ fontSize: 26, fontWeight: 'bold' }}>Events Screen</Text>

        </View>
    )
}