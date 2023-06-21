import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Image, TouchableOpacity, Keyboard } from 'react-native';
import { collection, query, addDoc, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, getDownloadURL  } from "firebase/storage";
import { Avatar, Bubble, SystemMessage, Message, MessageText, Time } from 'react-native-gifted-chat';
import moment from 'moment';

export default function GroupChat({eventID, navigation}) {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [pfpUrl, setPfpUrl] = useState('');

  const backHandler = () => {
    navigation.pop();
  }

  const getPfp = async() => {
      const storageRef = ref(storage, 'Profile Pictures');
      const fileName = authentication.currentUser.uid;
      const fileRef = ref(storageRef, fileName);

      const urlPromise = getDownloadURL(fileRef);
      const [url] = await Promise.all([urlPromise]);
      setPfpUrl(url);
  }

  const getUsername = async () => {
      const path = authentication.currentUser.uid;
      const docPromise = getDoc(doc(db, "users", path));
      const [docSnapshot] = await Promise.all([docPromise]);
      const data = docSnapshot.data();
      const username = data.username;
      setUsername(username);
  }

  useEffect(() => {
      getPfp();
      getUsername();
  }, []);
    
  const renderSystemMessage = (props) => (
      <SystemMessage
        {...props}
        containerStyle={{ backgroundColor: 'pink' }}
        wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
        textStyle={{ color: 'crimson', fontWeight: '900' }}
      />
  );

  const renderMessage = (props) => (
      <Message
        {...props}
        // renderDay={() => <Text>Date</Text>}
        containerStyle={{
          left: { backgroundColor: 'lime' },
          right: { backgroundColor: 'gold' },
        }}
      />
  );

  const renderMessageText = (props) => (
        <MessageText
          {...props}
          // containerStyle={{
          //   left: { backgroundColor: 'yellow' },
          //   right: { backgroundColor: 'purple' },
          // }}
          textStyle={{
            left: { color: 'black' },
            right: { color: 'white' },
          }}
          linkStyle={{
            left: { color: 'orange' },
            right: { color: 'orange' },
          }}
          customTextStyle={{ fontSize: 14, lineHeight: 15, fontFamily: 'Helvetica' }}
        />
    );

    const renderCustomView = ({ currentMessage }) => {
      if (currentMessage.user._id !== authentication.currentUser.email) {
        return (
          <View style={{
            minHeight: 20,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            marginLeft: 9,
            marginRight: 7,
          }}>
            <Text style={{
              fontFamily: 'Helvetica-Bold',
              fontSize: 14,
            }}>
              {currentMessage.user.username}
            </Text>
          </View>
        );
      }
      return null;
    }

    const renderTime = ({currentMessage}) => {
      const createdAt = (currentMessage.createdAt);
      const timestamp = createdAt.toDate();

      const hours = timestamp.getHours();
      const minutes = timestamp.getMinutes();
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;   

      if (currentMessage.user._id !== authentication.currentUser.email) {
        return (
        <View style={{alignSelf: 'flex-end', marginRight: 5, marginLeft: 9, marginBottom: 5}}>
          <Text style={{ color: 'grey', fontSize: 12, justifyContent: 'flex-end' }}>
            {time}
          </Text>
        </View>
        );
      } else {
        return (
          <View style={{alignItems: 'flex-end', marginRight: 5, marginLeft: 5, marginBottom: 5 }}>
            <Text style={{ color: 'white', fontSize: 12, justifyContent: 'flex-end' }}>
              {time}
            </Text>
          </View>
          );
      }
    }

    const renderDay = (props) => {
      const { currentMessage, previousMessage } = props;
    
      if (currentMessage && currentMessage.createdAt && previousMessage && previousMessage.createdAt) {
        const currentTimestamp = currentMessage.createdAt.toDate();
        const previousTimestamp = previousMessage.createdAt.toDate();
        const currentDay = moment(currentTimestamp).format('YYYY-MM-DD');
        const previousDay = moment(previousTimestamp).format('YYYY-MM-DD');
    
        if (currentDay !== previousDay) {
          return (
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>
                {moment(currentTimestamp).format('MMM DD, YYYY')}
              </Text>
            </View>
          );
        }
      } else if (currentMessage && currentMessage.createdAt) {
        // Render the date for the first message
        const currentTimestamp = currentMessage.createdAt.toDate();
        return (
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>
              {moment(currentTimestamp).format('MMM DD, YYYY')}
            </Text>
          </View>
        );
      }
    
      return null; // Return null for other messages within the same day
    };
        

    useLayoutEffect(() => {
        const eventID = 'eventID';
        const path = 'groupchats/test/' + eventID;
        const collectionRef = collection(db, path);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            setMessages(snapshot.docs.map(doc=> ({
                _id: doc.id,
                createdAt: doc.data().createdAt,
                text: doc.data().text,
                user: doc.data().user
            })))
        });
        return unsubscribe;    
    }, []);  

    const onSend = useCallback((messages = []) => {
      const message = messages[0];
      const { _id, text, user } = message;
      const createdAt = new Date(); // Use the current date and time
      const timestamp = Timestamp.fromDate(createdAt);

      // Create a new message object with the valid `createdAt` property
      const newMessage = {
        _id,
        text,
        user,
        createdAt: timestamp,
      };
    
      // Update the messages state
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
    
      // Add the message to the Firestore collection
      const eventID = 'eventID';
      const path = 'groupchats/test/' + eventID;
      addDoc(collection(db, path), newMessage);
    }, []);
    

    return (
      <View style={styles.container}>
        <View style = {styles.headerContainer}>
          
          <TouchableOpacity onPress = {backHandler}>
          <View style = {styles.backContainer}>
          <Image
            source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fback%20icon.png?alt=media&token=b8666160-3975-41f7-a11b-ce8920233555'}}
            style = {styles.backIconStyle}
            resizeMode = 'contain'/>
          </View>
          </TouchableOpacity>

          <View style = {styles.pfpContainer}>
          <Image
            source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Fsports%20icon.png?alt=media&token=674f46a5-331b-44b6-b3a4-37c659ac83cd'}}
            style = {styles.pfpStyle}
            resizeMode = 'contain'/>
          </View>

          <View style = {styles.infoContainer}>
            <TouchableOpacity>
            <Image
              source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/fir-auth-c7176.appspot.com/o/Icons%2Finfo%20icon.png?alt=media&token=ee48a39d-834f-472b-80b7-df69bf13c7e8'}}
              style = {styles.infoStyle}
              resizeMode = 'contain'
              />
            </TouchableOpacity>
          </View>

          <Text style = {styles.headerTitle}>Event Name</Text>
        </View>
        <GiftedChat 
            messages = {messages}
            onSend = {messages => onSend(messages)}
            user = {{
                _id: authentication.currentUser.email,
                avatar: pfpUrl,
                username: username
            }}
            bottomOffset={0}
            messagesContainerStyle = {{
                backgroundColor: 'white'
            }}
            renderMessageText = {renderMessageText}
            renderCustomView = {renderCustomView}
            renderTime = {renderTime}
            renderDay = {renderDay}
            //renderMessage = {renderMessage}
            //renderSystemMessage={renderSystemMessage} 
            />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: 'white',
    width: 400,
    height: 80,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Android-specific property for elevation
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 23,
    fontFamily: 'Nunito-Sans-Bold',
    marginTop: 25,
  },
  backContainer: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 25,
  },
  backIconStyle: {
    width: 28,
    height: 28,
    alignSelf: 'flex-start',
  },
  pfpContainer: {
    width: 35,
    height: 35,
    marginRight: 5,
    marginTop: 25,
},
pfpStyle: {
    width: 35,
    height: 35,
    borderColor: 'black',
    borderWidth: 1.8,
    borderRadius: 1000, 
},
infoContainer: {
  position: 'absolute',
  left: 330,
  top: 35,
},
infoStyle: {
  width: 35,
  height: 35,
},
  dayContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
});