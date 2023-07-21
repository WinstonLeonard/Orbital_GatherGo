import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import SplitBillPopUp from '../shared/SplitBillPopUp';
import { authentication, db } from '../firebase/firebase-config'
import { collection, query, where, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import HostedSplitBillsBox from '../shared/HostedSplitBillsBox';
import { StatusBar } from 'expo-status-bar';

export default function Expenses({navigation}) {
    
    const [modalVisible, setModalVisible] = useState(false);
    const [mySplitBills, setMySplitBills] = useState([]);
    const [mySplitBillsObject, setMySplitBillsObject] = useState([]);

    //retrieve data
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const myDocID = authentication.currentUser.uid;
                const myDocRef = doc(db, "users", myDocID);
                const myDocSnap = await getDoc(myDocRef);
        
                const myData = myDocSnap.data();
                const mySplitBills = myData.splitBillsHosted;

                setMySplitBills(mySplitBills);
            }
            fetchData();
        },[])
    );

    //making object for flatlist
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
            for (let i = 0; i < mySplitBills.length; i++) {
                const splitBillID = mySplitBills[i];

                const docPromise = getDoc(doc(db, "splitbill", splitBillID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const billData = docSnapshot.data();
                const eventName = billData.eventName;
                const eventDate = billData.eventDate;
                const eventCategory = billData.eventCategory;

                const object = {
                    name : eventName,
                    date : eventDate,
                    category : eventCategory,
                    splitBillID : splitBillID,
                };

                temp.push(object);
            }
            setMySplitBillsObject(temp);
        };
        fetchData();
    }, [mySplitBills]);


    const openModal = () => {
          setModalVisible(true);
    }
    
    const closeModal = () => {
        setModalVisible(false);
    }

    const test = () => {
        console.log(mySplitBillsObject)
    }

    const debtHandler = () => {
        navigation.navigate('Debt');
    }
    
    return (
        <View style = {styles.container}>
            <StatusBar style="auto"/>
            <SplitBillPopUp modalVisible={modalVisible} closeModal={closeModal} navigation={navigation}/>
            <View style = {styles.headerContainer}> 
                <Text style = {styles.headerText}>Split Bills</Text>
                <View style = {styles.walletContainer}>
                    <TouchableOpacity onPress = {debtHandler}>
                        <Ionicons style = {styles.wallet} name="wallet" size={36} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {styles.input}>
                <TextInput placeholder= 'Search' style = {styles.textInput} />
                <TouchableOpacity onPress = {test}>
                    <FontAwesome name="search" size={24} color="black" style = {styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.billssContainer}> 
                {mySplitBillsObject.length === 0 ? (
                <Text style={styles.noBillsText}>No Split Bills</Text>
                ) : (
                <FlatList
                    data={
                    mySplitBillsObject
                    .sort((a, b) => {
                        function formatDate(stringDate) {
                            const dateString = stringDate;
                            const [day, month, year] = dateString.split('/');
                            const dateObject = new Date(year, month - 1, day);
                            return dateObject;
                        }
                        const dateA = formatDate(a.date);
                        const dateB = formatDate(b.date);

                        if (dateA < dateB) {
                            return -1
                        } else if (dateB > dateA) {
                            return 1;
                        } else if (dateA == dateB) {
                            return 0;
                        }
                        })}
                    renderItem={({item}) => (
                    <HostedSplitBillsBox
                        name={item.name}
                        date={item.date}
                        category={item.category}
                        splitBillID={item.splitBillID}
                    />    
                    )}
                />
                )}
            </View>

            <View style={styles.acontainer}>
                <TouchableOpacity style={styles.button} onPress = {openModal}>
                    <Entypo name="plus" size={30} color="white" style = {styles.icon} /> 
                </TouchableOpacity>
            </View>

         </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        marginLeft: 35,
        marginRight: 35,
        marginTop: 53,
        alignItems: 'center',
        marginBottom: 20,
        // justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Nunito-Sans-Bold',
        flex: 1,
        textAlign: 'center',
        paddingLeft: 45,
        fontWeight: 'bold',

    },
    walletContainer: {
        // backgroundColor: 'red',
        width: 45,
        height: 45,
    },
    wallet: {
        // alignSelf: 'center'
        marginLeft: 7,
        marginTop: 5
    },
    envelopStyle: {
        width: 45,
        height: 45,
    },
    input: {
        alignItems: 'center',
        backgroundColor: '#EDF2FB',
        width: 330,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        color: 'red',
        fontFamily: "Nunito-Sans-Bold",
      },
    icon: {
        marginLeft: 20,
    },
    acontainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%'
    },
    button: {
        backgroundColor: '#39A5BD',
        width: '100%',
        padding: 10,
        height: 50,
    },
    icon: {
        alignSelf: 'center'
    },
    noBillsText: {
        fontFamily: "Nunito-Sans-Bold",
        alignSelf: 'center',
        color: '#2F2E2F',
        fontSize: 18,
        marginTop: 40,
        color: 'grey'
        //textAlign: 'center',
    },
    billssContainer: {
        width: '100%',
        height: 580,
        // backgroundColor: 'red',
    }
})