import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import FriendBox from '../shared/friendBox';

export default function Friends({navigation}) {

    const addFriendHandler = () => {
        navigation.navigate('AddFriend');
    }

    const [friendList, setFriendList] = useState([
        {username: 'Chronal', name: 'Winston', key: 1, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'Chronixel', name: 'Jason', key: 2, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'C', name: 'C', key: 3, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'D', name: 'D', key: 4, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'E', name: 'E', key: 5, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'F', name: 'F', key: 6, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'G', name: 'G', key: 7, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'H', name: 'H', key: 8, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'H', name: 'H', key: 9, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
        {username: 'H', name: 'H', key: 10, image:'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2Fsi2hdFR0vUXybZXA2S8pRHCit3F3?alt=media&token=01f7330f-ec9c-4ce9-9d11-97f073e65d64'},
    ])

    return (
      <View style={styles.container}>
        
        <View style = {styles.headerContainer}>

            <Text style = {styles.title}> Friends </Text>
            <View style = {styles.iconContainer}>
                <TouchableOpacity onPress = {addFriendHandler}>
                <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fadd%20friend%20icon.png?alt=media&token=0748399e-90f2-464b-b415-26ac5dc2cdb0'}}
                    style = {styles.iconStyle}
                    resizeMode='contain' />
                </TouchableOpacity> 
            </View>
        </View>

        <FlatList
            data = {friendList}
            renderItem= {({item}) => (
                <FriendBox
                    image = {item.image}
                    username = {item.username}
                    name = {item.name}    
                />
            )}
            
            />


      </View>
    );
  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 40,
        fontFamily: 'Nunito-Sans-Bold',
    },
    headerContainer: {
        marginTop: 40,
        marginLeft: 20,
        marginBottom: 40,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        alignContentL: 'center',
        //backgroundColor: 'blue',
    },
    iconContainer: {
        //backgroundColor: 'red',
        width: 40,
        height: 40,
        margin: 10,
        marginLeft: 135,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        width: 45,
        height: 45,
        borderColor: 'black',
    },
    friendContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 10,
        width: 350,
        borderColor: 'black',
        borderWidth: 2,
    }, 
    pfpContainer: {
        //backgroundColor: 'red',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pfpStyle: {
        width: 60,
        height: 60,
        borderColor: 'black',
        borderWidth: 0,
        borderRadius: 1000, 
    },
    nameContainer: {
        //backgroundColor: 'red',
        marginLeft: 10,
    },
    usernameStyle: {
        fontFamily: 'Nunito-Sans-Bold',
        fontSize: 24,
    },
    nameStyle: {
        fontFamily: 'Nunito-Sans',
        fontSize: 18,
    }
});
