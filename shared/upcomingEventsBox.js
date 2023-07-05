import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Image, ScrollView } from 'react-native';
import EventPopUp from './EventPopup';
import DeleteMyEventPopUp from './DeleteMyEventPopUp';

export default function UpcomingEventsBox({ name, category, location, date, time, eventID, deleteFunction}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteEventModalVisible, setDeleteEventModalVisible] = useState(false);

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
    
    const openDeleteEventModal = () => {
        setDeleteEventModalVisible(true);
    }

    const closeDeleteEventModal = () => {
        setDeleteEventModalVisible(false);
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
    })
    
    if (modalVisible) {
        return (
            <TouchableOpacity onPress = {openModal}>
            <EventPopUp modalVisible={modalVisible} closeModal={closeModal} eventID = {eventID} />
            <DeleteMyEventPopUp modalVisible={deleteEventModalVisible} closeModal = {closeDeleteEventModal} eventID={eventID} deleteFunction = {deleteFunction} />
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
                <TouchableOpacity onPress = {editHandler}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fedit%20icon%20v2.png?alt=media&token=b372cd7f-e32e-426d-a7c6-607fb1723940'}}
                    style = {styles.editStyle}
                    resizeMode = 'contain'
                    />
                </TouchableOpacity>
    
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
            <DeleteMyEventPopUp modalVisible={deleteEventModalVisible} closeModal = {closeDeleteEventModal} eventID={eventID} deleteFunction = {deleteFunction} />
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
                <TouchableOpacity onPress = {editHandler}>
                <Image
                    source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fedit%20icon%20v2.png?alt=media&token=b372cd7f-e32e-426d-a7c6-607fb1723940'}}
                    style = {styles.editStyle}
                    resizeMode = 'contain'
                    />
                </TouchableOpacity>
    
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

