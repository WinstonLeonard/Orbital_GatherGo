import * as React from 'react';
import { View, Text } from 'react-native';
import GroupChat from '../shared/groupChat';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";


export default function TestGroupChat({navigation}) {
    const route = useRoute();
    const { eventID } = route.params;

    return (
        <GroupChat
            navigation = {navigation}
            eventID={eventID}
        ></GroupChat>

    )
}