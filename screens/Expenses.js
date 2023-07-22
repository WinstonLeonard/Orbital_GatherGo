import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import SplitBillPopUp from '../shared/SplitBillPopUp';
import { authentication, db } from '../firebase/firebase-config'
import { updateDoc, collection, where, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import HostedSplitBillsBox from '../shared/HostedSplitBillsBox';
import { StatusBar } from 'expo-status-bar';

export default function Expenses({navigation}) {
    
    const [modalVisible, setModalVisible] = useState(false);
    const [mySplitBills, setMySplitBills] = useState([]);
    const [mySplitBillsObject, setMySplitBillsObject] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredBills, setFilteredBills] = useState([]);
    const [searchBill, setSearchBill] = useState('');

    const [data, setData] = useState([]);

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
            setData(temp);
            setIsSearchActive(false);
        };
        fetchData();
    }, [mySplitBills]);


    const openModal = () => {
          setModalVisible(true);
    }
    
    const closeModal = () => {
        setModalVisible(false);
    }

    const search = () => {
        setIsSearchActive(true);
        const filteredBills = mySplitBillsObject.filter((object) => object.name.includes(searchBill));
        setFilteredBills(filteredBills);
    }

    useEffect(() => {
        if (isSearchActive) {
            setData(filteredBills);
        } else {
            setData(mySplitBillsObject);
        }
    }, [isSearchActive, filteredBills, mySplitBills]);

    useEffect(() => {
        if (searchBill === '') {
            setData(mySplitBillsObject);
            setIsSearchActive(false);
        }
    }, [searchBill]);

    const debtHandler = () => {
        navigation.navigate('Debt');
    }

    function deleteBill(billID, billHost, billPeople) {
        //delete the bill from the user's (host's) splitBillsHosted array in firestore
        async function deleteBillFromHost() {
            const docRef = doc(db, "users", billHost);
            const docSnap = await getDoc(docRef);
        
            const data = docSnap.data();
            const hostSplitBillsHosted = data.splitBillsHosted;
            const updatedHostSplitBillHosted = hostSplitBillsHosted.filter(bill => bill != billID);
            console.log(hostSplitBillsHosted);
            console.log(updatedHostSplitBillHosted);

            setDoc(docRef, {
                splitBillsHosted: updatedHostSplitBillHosted,
            }, { merge: true });
            
            setMySplitBills(updatedHostSplitBillHosted);
        }
        //for all users who owe money for the deleted bill, delete the bill from each of the user's debt field in firestore

        async function deleteBillFromAllOwers() {
            for (let i = 0; i < billPeople.length; i++) {
                const person = billPeople[i];
                const docRef = doc(db, "users", person);
                const docSnap = await getDoc(docRef);

                const data = docSnap.data();
                const debt = data.debt;

                delete debt[billID];

                console.log(debt);
                
                updateDoc(docRef, {
                    debt: debt,
                }, { merge: true });

            }
        }
        //delete the bill itself from the 'splitbill' firestore collection
        async function deleteBillItself() {
            const docRef = doc(collection(db, "splitbill"), billID);
            deleteDoc(docRef)
            .then(() => {
                console.log(billID+ " successfully deleted!");
            })
        }


        deleteBillFromHost();
        deleteBillFromAllOwers();
        deleteBillItself();
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
                <TextInput placeholder= 'Search' style = {styles.textInput} value = {searchBill} onChangeText={text => setSearchBill(text)}/>
                <TouchableOpacity onPress = {search}>
                    <FontAwesome name="search" size={24} color="black" style = {styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.billssContainer}> 
                {data.length === 0 ? (
                <Text style={styles.noBillsText}>No Split Bills</Text>
                ) : (
                <FlatList
                    data={
                    data
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
                        deleteFunction = {deleteBill}
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