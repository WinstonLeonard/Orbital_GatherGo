import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import CustomButton from '../shared/button';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { authentication, db } from '../firebase/firebase-config';
import { collection, addDoc, doc, setDoc} from "firebase/firestore"; 


export default function Birthday({navigation}) {

    const next = () => {
      const docID = authentication.currentUser.uid;
      const userRef = doc(db, 'users', docID);

      setDoc(userRef, {
          birthday: stringDate,
      }, { merge: true });
      navigation.navigate('Gender')
  }

    const [date, setDate] = useState(new Date(2004, 3, 12));

    const[stringDate, setStringDate] = useState('12 April 2004');

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
      setStringDate(formatDate(currentDate));
    };
  
    const showMode = (currentMode) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: false,
      });
    };
  
    const showDatepicker = () => {
      showMode('date');
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-UK', options);
      };


    return(
        <KeyboardAvoidingView 
            style = {styles.keyboardAvoidContainer}
            enableOnAndroid = {true}
            keyboardVerticalOffset = {-400}
            behavior = "padding">
        <View style = {styles.container}>


            <Text style = {styles.header}> What's your birthday? </Text>

            <TouchableOpacity onPress={showDatepicker}>

            <View style = {styles.inputContainer}>

                <Text style = {styles.textInput}>
                    {formatDate(date)}
                </Text>

                <View style={styles.line} /> 
            
            </View>

            </TouchableOpacity>
           
            <CustomButton text = 'Pick a Date' 
                          buttonColor = '#39A5BD' 
                          textColor = 'white'
                          cornerRadius= {10} 
                          width = {330}
                          height = {45}
                          fontSize = {16}
                          onPress = {showDatepicker}></CustomButton>

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
    line: {
        
        width: 275,
        height: 3,
        backgroundColor: 'grey',
        elevation: 3, // Adjust the elevation value as needed
      },
      inputContainer: {
        width: 275,
        marginTop: 60,
        marginBottom: 420,
    },
    textInput: {
        fontFamily: 'Nunito-Sans-Bold',
        textAlign: 'center',    
        fontSize: 20,
        paddingVertical: 8,
      },
})