import * as React from 'react';
import { View, Text } from 'react-native';
import GroupChat from '../shared/groupChat';

export default function TestGroupChat({navigation}) {
    return (
        <GroupChat
            navigation = {navigation}
        ></GroupChat>

    )
}