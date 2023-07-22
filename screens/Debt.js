import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { authentication, db } from '../firebase/firebase-config'
import { updateDoc, collection, query, where, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import DebtBox from '../shared/DebtBox';
import { StatusBar } from 'expo-status-bar';
import { storage } from '../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";

export default function Debt({navigation}) {

    const [debt, setDebt] = useState([]);
    const [debtObject, setDebtObject] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredDebt, setFilteredDebt] = useState([]);
    const [searchDebt, setSearchDebt] = useState('');
    const [data, setData] = useState([]);

    //retrieve data
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const myDocID = authentication.currentUser.uid;
                const myDocRef = doc(db, "users", myDocID);
                const myDocSnap = await getDoc(myDocRef);
        
                const myData = myDocSnap.data();
                const mySplitBills = myData.debt;

                setDebt(mySplitBills);
            }
            fetchData();
        },[])
    );


    //making object for flatlist
    useEffect(() => {
        const fetchData = async () => {
            const temp = [];
            for (const splitBillID in debt) {
                const docPromise = getDoc(doc(db, "splitbill", splitBillID));
    
                const [docSnapshot] = await Promise.all([docPromise]);
    
                const billData = docSnapshot.data();
                const hostID = billData.hostID;
                const eventName = billData.eventName;
                
                const storageRef = ref(storage, 'Profile Pictures');
                const fileName = hostID;
                const fileRef = ref(storageRef, fileName);

                const urlPromise = getDownloadURL(fileRef);
                const hostPromise = getDoc(doc(db, "users", hostID));
                
                const [url, hostSnapshot] = await Promise.all([urlPromise, hostPromise]);
                const hostData = hostSnapshot.data();
                const hostName = hostData.name;


                const object = {
                    eventName : eventName,
                    hostName : hostName,
                    hostID : hostID,
                    image: url,
                    moneyOwed: debt[splitBillID],
                    splitBillID : splitBillID,
                };

                temp.push(object);
            }
            setDebtObject(temp);
            setData(temp);
            setIsSearchActive(false);
        };
        fetchData();
    }, [debt]);

    const search = () => {
        setIsSearchActive(true);
        const filteredDebts = debtObject.filter((object) => object.hostName.includes(searchDebt));
        setFilteredDebt(filteredDebts);
    }

    useEffect(() => {
        if (isSearchActive) {
            setData(filteredDebt);
        } else {
            setData(debtObject);
        }
    }, [isSearchActive, filteredDebt, debt]);

    useEffect(() => {
        if (searchDebt === '') {
            setData(debtObject);
            setIsSearchActive(false);
        }
    }, [searchDebt]);

    const paidHandler = async (splitBillID) => {
        const myDocID = authentication.currentUser.uid;
        const myDocRef = doc(db, "users", myDocID);
        const myDocSnap = await getDoc(myDocRef);
        
        const myData = myDocSnap.data();
        const mySplitBills = myData.debt;
        
        // Remove the split bill ID from mySplitBills
        delete mySplitBills[splitBillID];

        // Update the debt field in Firestore using updateDoc
        updateDoc(myDocRef, { debt: mySplitBills })
            .then(() => {
            console.log("Debt field updated successfully.");
            })
            .catch((error) => {
            console.error("Error updating debt field:", error);
            });
        
        //add to the bill's received and sets your debt in the split bill to 0 
        const docPromise = getDoc(doc(db, "splitbill", splitBillID));
        const [docSnapshot] = await Promise.all([docPromise]);

        const billData = docSnapshot.data();
        const bill = billData.bill;
        const received = parseInt(billData.received);
        
        const myID = authentication.currentUser.uid;
        const newReceived = received + parseInt(bill[myID]);
        bill[myID] = 0;

        const docRef = doc(db, "splitbill", splitBillID);
        updateDoc(docRef, { bill: bill, received: newReceived })
            .then(() => {
            console.log("Bill and received fields updated successfully.");
            })
            .catch((error) => {
            console.error("Error updating bill and received fields:", error);
            });

        setDebt(mySplitBills);
    }
    
    return (
        <View style = {styles.container}>
            <StatusBar style="auto"/>
            <View style = {styles.headerContainer}> 
                <Text style = {styles.headerText}>Debt</Text>
            </View>

            <View style = {styles.input}>
                <TextInput placeholder= 'Search' style = {styles.textInput} value = {searchDebt} onChangeText={text => setSearchDebt(text)}/>
                <TouchableOpacity onPress = {search}>
                    <FontAwesome name="search" size={24} color="black" style = {styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.billssContainer}> 
                {data.length === 0 ? (
                <Text style={styles.noBillsText}>No Debt</Text>
                ) : (
                <FlatList
                    data={data}
                    renderItem={({item}) => (
                    <DebtBox
                        eventName = {item.eventName}
                        hostName = {item.hostName}
                        paidHandler = {paidHandler}
                        image = {item.image}
                        moneyOwed = {item.moneyOwed}
                        splitBillID = {item.splitBillID}
                    />    
                    )}
                />
                )}
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
        marginLeft: -10,
        marginRight: 35,
        marginTop: 53,
        alignItems: 'center',
        marginBottom: 20,
        // justifyContent: 'center',
        // backgroundColor: 'red',
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