import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView  } from 'react-native';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import CustomButton from '../shared/button';
import { SelectList } from 'react-native-dropdown-select-list'
import moment from 'moment';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';



export default function EditProfile({navigation}) {
    const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Profile%20Pictures%2FLoading_icon.gif?alt=media&token=87d91cbe-47e8-45fb-a25c-f69cfa3f9654');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('')
    const [stringBirthday, setStringBirthday] = useState('');
    const [birthday, setBirthday] = useState([new Date()]);
    const [gender, setGender] = useState('');

    const choices = [
        {key:'1', value:'Male'},
        {key:'2', value:'Female'},
        {key:'3', value:'Prefer Not To Say'},
    ]

    const update = () => {
        console.log('update');
        console.log(name);
        console.log(gender);
        console.log(birthday[0]);
        console.log(stringBirthday);

        const docID = authentication.currentUser.uid;
        const userRef = doc(db, 'users', docID);

        uploadImageAsync(image);
        
        setDoc(userRef, {
            name: name,
        }, { merge: true });

        setDoc(userRef, {
            birthday: stringBirthday,
        }, { merge: true });

        setDoc(userRef, {
            gender: gender,
        }, { merge: true });

        navigation.pop();
    }

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

      useEffect(() => {
        async function getUsername() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            setUsername(data.username);
               
        }
        getUsername();
      }, []);

      useEffect(() => {
        async function getEmail() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            setEmail(data.email);              
        }
        getEmail();
      }, []);

      useEffect(() => {
        async function getName() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            setName(data.name);     
        }
        getName();
      }, []);


      useEffect(() => {
        async function getBirthday() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            const birthday = data.birthday;
            setStringBirthday(birthday);

            const date = moment(birthday, 'D MMMM YYYY').toDate();
            setBirthday([date]);
        }
        getBirthday();
      }, []);

      useEffect(() => {
        async function getGender() {
            const docID = authentication.currentUser.uid;
            const docRef = doc(db, "users", docID);
            const docSnap = await getDoc(docRef);

            const data = docSnap.data();
            setGender(data.gender);
        }
        getGender();
      }, []);


    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-UK', options);
    };


      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setBirthday([currentDate]);
        setStringBirthday(formatDate(currentDate));
      };
    
      const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: birthday[0],
          onChange,
          mode: currentMode,
          is24Hour: false,
        });
      };
    
      const showDatepicker = () => {
        showMode('date');
      };


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
            //uploadImageAsync(result.assets[0].uri);
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
    <KeyboardAvoidingView 
        style = {styles.keyboardAvoidContainer}
        enableOnAndroid = {true}
        keyboardVerticalOffset = {-600}
        behavior = "padding">
      <ScrollView contentContainerStyle = {styles.container}>
        <View style = {styles.twoColorContainer}>
            <ImageBackground source= {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsplit%20background.png?alt=media&token=9b5d486d-4e2c-43d6-b72f-cd4110d9dbea'}}
                             resizeMode = 'cover' 
                             style={styles.twoColorStyle}>
                <TouchableOpacity onPress = {pickImage}> 
                <View style = {styles.imageContainer}>
                    <Image source = {{uri: image}}
                            style = {styles.imageStyle}
                            resizeMode='contain'/>
                    <Text style = {styles.cpText}>Change Picture</Text>
                </View>
                </TouchableOpacity>
            </ImageBackground>
        </View>

        <View style = {styles.fieldContainer}>
            <Text style = {styles.smallHeader}>Username</Text>

            <View style = {styles.inputContainer}>
            <Text style = {styles.textInput}>{username}</Text>
            </View>
        </View>

        <View style = {styles.fieldContainer}>
            <Text style = {styles.smallHeader}>Email</Text>

            <View style = {styles.inputContainer}>
            <Text style = {styles.textInput}>{email}</Text>
            </View>
        </View>

        <View style = {styles.fieldContainer}>
            <Text style = {styles.smallHeader}>Name</Text>

            <View style = {styles.inputContainer}>
            <TextInput
                style={styles.textInput}
                placeholder="Enter your name..."
                value={name}
                onChangeText={text => setName(text)}/>    
            </View>
        </View>

        <View style = {styles.fieldContainer}>
            <Text style = {styles.smallHeader}>Birthday</Text>

            <TouchableOpacity onPress = {showDatepicker}>
            <View style = {styles.inputContainer}>
            <Text style = {styles.textInput}>
                    {(stringBirthday)}
                </Text>    
            </View>
            </TouchableOpacity>
        </View>

        <View style = {styles.fieldContainer}>
            <Text style = {styles.smallHeader}>Gender</Text>

            {/* <View style = {styles.inputContainer}> */}
            <SelectList
                arrowicon={
                    <Text> </Text>
                }
                inputStyles = {styles.selectListInput}
                boxStyles= {styles.selectListBox}
                maxHeight = {130}
                search = {false} 
                setSelected={(val) => setGender(val)} 
                data={choices}
                placeholder= {gender}
                alignItems= 'center'
                save="value"/>
            {/* </View> */}
        </View>

        <CustomButton text = 'Update' 
                          buttonColor = 'black' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {285}
                          height = {40}
                          fontSize = {16}
                          onPress = {update}></CustomButton>

        </ScrollView>
        </KeyboardAvoidingView>
    );

}


const styles = StyleSheet.create({
    keyboardAvoidContainer: {
        flex: 1,
    },
    container: {
      flexGrow: 1,
      alignItems: 'center',
      //justifyContent: 'center',
      paddingBottom: 40,
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
        marginBottom: 100,
        fontFamily: 'Nunito-Sans',
        fontSize: 16,
    },
    twoColorContainer: {
        alignSelf: 'flex-start',
        width: 390,
        height: 200,
        marginBottom: 5,
        //backgroundColor: 'red',
    },
    twoColorStyle: {
        width: 390,
        height: 200,
    },
    fieldContainer: {
        alignItems: 'flex-start',
        width: 330,
        marginBottom: 15,
        //height: 80,
        //backgroundColor: 'red',
    }, 
    smallHeader: {
        fontFamily: 'Popins-Medium',
        color: '#5F5F5F',
        textAlign: 'left'
    },
    inputContainer: {
        width: 330,
        height: 40,
        borderWidth: 1,
        borderColor: '#A9A9A9',
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    textInput: {
        fontFamily: 'Popins',
        fontSize: 14,
        color: 'black',
        width: 330,
        marginLeft: 5, 
    },
    selectListInput: {
        fontFamily: 'Popins',
        fontSize: 14,
        marginLeft: -13,
        marginTop: - 3,
        maxHeight: 20,
      },
      selectListBox: {
        width: 330,
        height: 40,
        borderColor: 'A9A9A9',
        //alignItems: 'flex-start',
        justifyContent: 'flex-start',
        fontFamily: 'Popins',
      },
  });