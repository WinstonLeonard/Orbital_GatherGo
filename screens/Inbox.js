import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import GroupChatContainer from '../shared/GroupChatContainer';
import GroupChat from '../shared/groupChat';

export default function Inbox({navigation}) {
    const incomingInvitationHandler = () => {
        navigation.navigate('EventInvitations');
    }

    return (

        <View style = {styles.container}>
            
            <View style = {styles.headerContainer}> 
                <Text style = {styles.headerText}>Inbox</Text>
                <View style = {styles.envelopContainer}>
                    <TouchableOpacity onPress = {incomingInvitationHandler}>
                    <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fenvelope.png?alt=media&token=16c56aa8-83ec-4734-8136-9e6800f1a2d2'}}
                            style  = {styles.envelopStyle}
                            resizeMode= 'contain'/>
                    </TouchableOpacity>
                </View>
            </View>
            
            <GroupChatContainer></GroupChatContainer>

            {/* <View>
                <Text onPress = {() => navigation.navigate('TestGroupChat')}
                    style = {{ fontSize: 26, fontWeight: 'bold' }}>GroupChat</Text>
            </View> */}

         </View>   
        

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'flex-start',
    },
    headerContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 35,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 40,
        fontFamily: 'Nunito-Sans-Bold',
        marginLeft: 35,
    },
    envelopContainer: {
        //backgroundColor: 'red',
        width: 50,
        height: 50,
        position: 'absolute',
        left: 305,
    },
    envelopStyle: {
        width: 50,
        height: 50,
    },
})