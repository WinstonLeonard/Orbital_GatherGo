import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons'; 
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Events from '../screens/Events';
import NewEvent from '../screens/NewEvent';
import Inbox from '../screens/Inbox';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const NewEventButton = ({children, onPress}) => (
    <TouchableOpacity style  = {{
        top: -25,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow
    }}
    onPress = {onPress}
    >
        <View style = {{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundcColor: '39A5BD'
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

function BottomTabNavigator() {
  return (
    <Tab.Navigator
        screenOptions = {{
            tabBarShowLabel: false,
        }}>
        <Tab.Screen name="HomeScreen" component={Home} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View style = {{top: 2}}>
                    <AntDesign name="home" size={30} color="black"/>
                </View>
            ),
        }}/>
        <Tab.Screen name="EventsScreen" component={Events} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View>
                    <SimpleLineIcons name="event" size={28} color="black" />
                </View>
            ),
        }} />
        <Tab.Screen name="NewEventScreen" component={NewEvent} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source = {require('../assets/pictures/plus.png')}
                resizeMode = "contain"
                style = {{
                    width: 65,
                    height: 65,
                }}
                />
            ),
            tabBarButton: (props) => (
                <NewEventButton {...props} />
            )
        }}/>
        <Tab.Screen name="InboxScreen" component={Inbox} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View>
                   <Fontisto name="email" size={30} color="black" />
                </View>
            ),
        }}/>
         <Tab.Screen name="ProfileScreen" component={Profile} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View>
                    <Ionicons name="person-outline" size={30} color="black" />
                </View>
            ),
        }}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColro: '#2F2E2F',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})

export default BottomTabNavigator;