import React, {useState} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import EventRequestPopUp from './EventRequestPopUp';

export default function EventRequestBox({ name, category, location, date, time, eventID, acceptHandler, rejectHandler}) {
    const [modalVisible, setModalVisible] = useState(false);

    const images = {
        categories: {
            'Sports' :"https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd",
            'Eat' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Feat%20icon.png?alt=media&token=ee7bf011-8772-45ef-8555-5ba95fbe0aca",
            'Study' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fstudy%20icon.png?alt=media&token=4af22023-a081-4303-a054-251eaedfe35e",
            'Others' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fothers_icon.png?alt=media&token=c59640d4-5f09-44fc-81a3-b4f72a00b241",
        }
    }

    const openModal = () => {
        if (eventID == 'GLOBAL') {
          setModalVisible(false);
        } else {
          console.log('modal openned');
          setModalVisible(true);
        }
      }
    
      const closeModal = () => {
        console.log('modal closed');
        setModalVisible(false);
      }

      const newAcceptHandler = () => {
        console.log('newAccept');
        acceptHandler();
        closeModal();
      }

      const newRejectHandler = () => {
        console.log('newReject');
        rejectHandler();
        closeModal();
      }


    const styles = StyleSheet.create({
        friendContainer: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            marginLeft: 10,
            marginTop: 10,
            width: 370,
            height: 110,
            alignContent: 'center',
            backgroundColor: '#DEF5FF',
            borderRadius: 10,
            // borderColor: 'black',
            // borderWidth: 2,
        }, 
        pfpContainer: {
            // backgroundColor: 'red',
            marginTop: 15,
            marginLeft: 10,
            width: 70,
            height: 80,
        },
        pfpStyle: {
            width: 70,
            height: 70,
            borderColor: 'black',
            borderWidth: 0,
        },
        nameContainer: {
            //backgroundColor: 'red',
            textAlign: 'left',
            justifyContent: 'center',
            marginLeft: 10,
        },
        usernameStyle: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 18,
            textAlign: 'left',
        },
        nameStyle: {
            fontFamily: 'Nunito-Sans',
            fontSize: 14,
            textAlign: 'left',
        },
        buttonContainer: {
            //backgroundColor: 'red',
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            left: 240,
            top: 25,
        },
        buttonStyle: {
            width: 50,
            height: 50,
            borderColor: 'black',
            borderWidth: 0,
            borderRadius: 1000,
            marginLeft: 10, 
        },
    
    })
    
    return (
        <TouchableOpacity onPress = {openModal}>
        <EventRequestPopUp modalVisible={modalVisible} closeModal={closeModal} eventID = {eventID} acceptHandler = {newAcceptHandler} rejectHandler = {newRejectHandler}/>
        <View style = {styles.friendContainer}>

        <View style = {styles.pfpContainer}>
        <Image source = {{uri: images.categories[category]}}
                    style = {styles.pfpStyle}
                    resizeMode='contain' />
        </View>

        <View style = {styles.nameContainer}>
            <Text style = {styles.usernameStyle}> {name} </Text>
            <Text style = {styles.nameStyle}> {location} </Text>
            <Text style = {styles.nameStyle}> {date} </Text>
            <Text style = {styles.nameStyle}> {time} </Text>
        </View>

        <View style = {styles.buttonContainer}>

        <TouchableOpacity onPress = {acceptHandler}>
        <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Faccept.png?alt=media&token=f9725c52-26e8-44b3-b2a5-62428c785e65'}}
               style  = {styles.buttonStyle}
               resizeMode= 'contain'/>
        </TouchableOpacity>

        <TouchableOpacity onPress = {rejectHandler}>
        <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Freject.png?alt=media&token=e017d54d-c65f-4e12-97d6-4301f0b92b76'}}
               style  = {styles.buttonStyle}
               resizeMode= 'contain'/>
        </TouchableOpacity>

        </View>

        </View>
        </TouchableOpacity>
    )
}

