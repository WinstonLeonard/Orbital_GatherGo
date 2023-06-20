import Reactm, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import { View, Text, KeyboardAvoidingView, SafeAreaView, Platform, Keyboard } from 'react-native';
import { collection, query, addDoc, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { authentication, db } from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config';
import { ref, getDownloadURL  } from "firebase/storage";
import { Avatar, Bubble, SystemMessage, Message, MessageText, Time } from 'react-native-gifted-chat';



export default function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [pfpUrl, setPfpUrl] = useState('');


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
      console.log(createdAt);
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
      const currentMessage = props.currentMessage;
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
          
      const currentcreatedAt = currentMessage.createdAt;
      const currenttimestamp = currentcreatedAt.toDate();
      const currentdate = currenttimestamp.getDate();
      const currentmonthIndex = currenttimestamp.getMonth();
      const currentyear = currenttimestamp.getFullYear();
  
      const currentmonth = monthNames[currentmonthIndex];
      const currentDate = currentdate + " " + currentmonth + " " + currentyear;
  
      if (messages.length >= 2) {
        const lastMessage = messages[1];
        
        const lastcreatedAt = lastMessage.createdAt;
        const lasttimestamp = lastcreatedAt.toDate();
        const lastdate = lasttimestamp.getDate();
        const lastmonthIndex = lasttimestamp.getMonth();
        const lastyear = lasttimestamp.getFullYear();
        const lastmonth = monthNames[lastmonthIndex];
        const lastDate = lastdate + " " + lastmonth + " " + lastyear;
        if (currentDate !== lastDate) {
          return (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: 'grey' }}>{currentDate}</Text>
            </View>
          );
        } else {
          return (
            <View style={{ alignItems: 'center', marginTop: 3 }}>
            </View>
          );
        }
      } else {
        return (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'grey' }}> {currentDate}</Text>
        </View>
        )
      } 
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

    // const onSend = useCallback((messages = []) => {

    //     setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    //     const {_id, createdAt, text, user} = messages[0];
    //     const eventID = 'eventID';
    //     const path = 'groupchats/test/' + eventID;
    //     addDoc(collection(db, path), {
    //         _id,
    //         createdAt,
    //         text,
    //         user
    //     });
    // }, []);

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
      <View style={{ flex: 1 }}>
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