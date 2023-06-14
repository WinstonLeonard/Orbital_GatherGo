import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getDoc } from 'firebase/firestore';
import CustomButton from '../shared/button';


export default function EditProfile({navigation}) {
    const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=87d91cbe-47e8-45fb-a25c-f69cfa3f9654');
    
    useEffect(() => {
        async function getProfilePic() {
            const storageRef = ref(storage, 'Profile Pictures');
            const fileName = authentication.currentUser.uid;
            const fileRef = ref(storageRef, fileName);
            getDownloadURL(fileRef)
            .then((url) => {
                setImage(url);
            })
        }
        getProfilePic();
      }, []);


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
            //console.log(result.assets[0].uri);
            //setImage({ uri: result.assets[0].uri });
            setImage( result.assets[0].uri );
            uploadImageAsync(result.assets[0].uri);
        }
    };
    
    const metadata = {
        contentType: 'image/jpeg',
    };

    async function uploadImageAsync(image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, 'Profile Pictures');
        const fileName = authentication.currentUser.uid;
        const fileRef = ref(storageRef, fileName);

        uploadBytes(fileRef, blob, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }
    
    return (
      <View style = {styles.container}>
            <TouchableOpacity onPress = {pickImage}> 
            <View style = {styles.imageContainer}>
                <Image source = {{uri: image}}
                        style = {styles.imageStyle}
                        resizeMode='contain'/>
                <Text style = {styles.cpText}>Change Picture</Text>
            </View>
            </TouchableOpacity>

        </View>
    );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      //justifyContent: 'center',
      backgroundColor: 'white',
    },
    imageContainer: {
        //backgroundColor: 'red',
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    imageStyle: {
        width: 140,
        height: 140,
        borderRadius: 1000,
        borderWidth: 4,
        borderColor: 'white',
    },
    cpText: {
        marginTop: 5,
        fontFamily: 'Nunito-Sans',
        fontSize: 16,
    },
    twoColorContainer: {
        backgroundColor: 'red',
    }
  });