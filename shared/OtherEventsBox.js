import React, {useState} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import EventPopUp from './EventPopup';
import DeleteOtherEventPopUp from './DeleteOtherEventPopUp';

export default function OtherEventsBox({ name, category, location, date, time, eventID, deleteFunction}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteEventModalVisible, setDeleteEventModalVisible] = useState(false);

    const openDeleteEventModal = () => {
        setDeleteEventModalVisible(true);
    }

    const closeDeleteEventModal = () => {
        setDeleteEventModalVisible(false);
    }

    const openModal = () => {
        if (eventID == 'GLOBAL') {
          setModalVisible(false);
        } else {
          setModalVisible(true);
        }
      }
    
    const closeModal = () => {
        setModalVisible(false);
    }
    
    const editHandler = () => {
        console.log('edit');
    }

    const images = {
        categories: {
            'Sports' :"https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd",
            'Eat' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Feat%20icon.png?alt=media&token=ee7bf011-8772-45ef-8555-5ba95fbe0aca",
            'Study' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fstudy%20icon.png?alt=media&token=4af22023-a081-4303-a054-251eaedfe35e",
            'Others' : "https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fothers_icon.png?alt=media&token=c59640d4-5f09-44fc-81a3-b4f72a00b241",
        }
    }


    const styles = StyleSheet.create({
        friendContainer: {
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 10,
            width: 330,
            height: 110,
            alignContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
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
            width: 175,
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
        deleteContainer: {
            width: 43,
            alignSelf: 'center',
            marginLeft: 10,
            //backgroundColor: 'blue',
        },
        deleteStyle: {
            width: 43,
            height: 43,
        },
        editStyle: {
            width: 43,
            height: 43,
            marginBottom: 5,
        },
        firstLine: {
            fontFamily: 'Nunito-Sans-Bold',
            fontSize: 18,
            lineHeight: 20,
            marginLeft: 3,
            marginTop: 2,
        },
    })
    
    if (modalVisible) {
        return (
            <TouchableOpacity onPress = {openModal}>
            <DeleteOtherEventPopUp modalVisible={deleteEventModalVisible} closeModal = {closeDeleteEventModal} eventID={eventID} deleteFunction = {deleteFunction} />
            <EventPopUp modalVisible={modalVisible} closeModal={closeModal} eventID = {eventID} />
            <View style = {styles.friendContainer}>
    
            <View style = {styles.pfpContainer}>
            <Image source = {{uri: images.categories[category]}}
                        style = {styles.pfpStyle}
                        resizeMode='contain' />
            </View>
    
            <View style = {styles.nameContainer}>
                {name.split('\n').map((line, index) => (
                <Text key={index} style={index === 0 ? styles.firstLine : styles.usernameStyle}>
                    {line}
                </Text>
                ))}
                <Text style = {styles.nameStyle}> {location} </Text>
                <Text style = {styles.nameStyle}> {date} </Text>
                <Text style = {styles.nameStyle}> {time} </Text>
            </View>
    
            <View style = {styles.deleteContainer}>
                <TouchableOpacity onPress = {openDeleteEventModal}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fdelete%20icon.png?alt=media&token=ddededdd-6a60-45db-b3b6-fa40c59b4019'}}
                    style = {styles.deleteStyle}
                    resizeMode = 'contain'
                    />
                </TouchableOpacity>
            </View>
    
            </View>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity onPress = {openModal}>
            <DeleteOtherEventPopUp modalVisible={deleteEventModalVisible} closeModal = {closeDeleteEventModal} eventID={eventID} deleteFunction = {deleteFunction}/>
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
    
            <View style = {styles.deleteContainer}>
                <TouchableOpacity onPress = {openDeleteEventModal}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fdelete%20icon.png?alt=media&token=ddededdd-6a60-45db-b3b6-fa40c59b4019'}}
                    style = {styles.deleteStyle}
                    resizeMode = 'contain'
                    />
                </TouchableOpacity>
            </View>
    
            </View>
            </TouchableOpacity>
        )
    }
    
}

