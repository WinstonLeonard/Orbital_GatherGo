import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import * as ImagePicker from 'expo-image-picker';
import { authentication, db } from '../firebase/firebase-config';
import { LogBox } from 'react-native';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { storage } from '../firebase/firebase-config';
import { StatusBar } from "expo-status-bar";



export default function Uploadpfp({navigation}) {
    LogBox.ignoreLogs(['Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead']);
    const [image, setImage] = useState(require('../assets/pictures/uploadPfp.jpg'));

    const skipNext= () => {
        uploadImageFromLocalAsync();
        navigation.reset({
          index: 0, // Index of the screen to reset to
          routes: [{ name: 'NewLogin' }], // Array of screen objects to set as the new stack
        });

        Alert.alert('Account Created', 'Thank you for creating a GatherGo account. Please sign in using your newly created account', 
        [{text: 'Understood.'}])

    }
    
    const next = () => {
        uploadImageAsync(image);
        navigation.reset({
          index: 0, // Index of the screen to reset to
          routes: [{ name: 'NewLogin' }], // Array of screen objects to set as the new stack
        });

        Alert.alert('Account Created', 'Thank you for creating a GatherGo account. Please sign in using your newly created account', 
        [{text: 'Understood.'}])
    }

    const metadata = {
        contentType: 'image/jpeg',
      };

    async function uploadImageFromLocalAsync() {
        const storageRef = ref(storage, 'Profile Pictures');
        const fileRef = ref(storageRef, 'uploadPfp.jpg');

        getDownloadURL(fileRef)
        .then((url) => {
            uploadImageAsync({uri: url});

        })
        .catch((error) => {
          // Handle any errors
        });
    }

    async function uploadImageAsync(image) {
        if (!image.uri) {
            Alert.alert('ERROR!', 'You have not uploaded a profile picture.', 
            [{text: 'Understood.'}])
            return;
        }
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, 'Profile Pictures');
        const fileName = authentication.currentUser.uid;
        const fileRef = ref(storageRef, fileName);

        uploadBytes(fileRef, blob, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: false,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        if (!result.canceled) {
            setImage({ uri: result.assets[0].uri });
        }
      };
  

    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>
        <StatusBar style="auto"/>

            <Text style = {styles.header}> Upload a profile picture </Text>


            <View style = {styles.imageContainer}>
            <TouchableOpacity onPress = {pickImage}>
            <Image source = {image}
                    style = {styles.imageStyle}
                    resizeMode='contain'
                   ></Image>
            </TouchableOpacity> 
            </View>

            <CustomButton text = 'Skip for now' 
                          buttonColor = '#39A5BD' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {skipNext}></CustomButton>

            <CustomButton text = 'Next' 
                          buttonColor = '#2F2E2F' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {next}></CustomButton>


        </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: 'white',
      },
    header: {
        fontFamily: "Nunito-Sans-Bold",
        fontSize: 24,
        paddingTop: 100,

    },
    imageContainer: {
        marginTop: 125,
        //backgroundColor: 'red',
        marginBottom: 130,
    },
    imageStyle: {
        width: 250,
        height: 250,
        borderRadius: 1000,
        borderColor: 'black',
    },
      buttonContainer: {
        position: 'absolute',
        bottom: 70,
      },
      secondImageContainer: {
        margin: 10,
        backgroundColor: 'red',
      },
      secondImage: {
        width: 40,
        height: 40,
      }
})