import * as React from 'react';
import { View, Text } from 'react-native';
import GroupChat from '../shared/groupChat';

export default function Inbox({navigation}) {
    return (
        <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress = {() => navigation.navigate('TestGroupChat')}
                style = {{ fontSize: 26, fontWeight: 'bold' }}>Inbox Screen</Text>
        </View>
        // <GroupChat></GroupChat>

    )
}