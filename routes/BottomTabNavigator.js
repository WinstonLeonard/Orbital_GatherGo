import React, { useRef } from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Animated, Dimensions } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons'; 
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Events from '../screens/Events';
import CreateEvent from '../screens/CreateEvent';
import Inbox from '../screens/Inbox';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

function BottomTabNavigator({navigation}) {
    
    const pressHandler = () => navigation.navigate('CreateEvent')
    
    const tabOffsetValue = useRef(new Animated.Value(0)).current;
    return (
    <>
    <Tab.Navigator
        screenOptions = {{
            tabBarShowLabel: false,
        }}>
        <Tab.Screen name="HomeScreen" component={Home} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View style = {{top: 2}}>
                    <AntDesign name="home" size={30} color= {focused ? "#39A5BD" : "black"}/>
                </View>
            ),
        }} 
        listeners = {(navigation, route) => ({
            tabPress: e => {
                Animated.spring(tabOffsetValue, {
                    toValue: 0,
                    useNativeDriver: true
                }). start();
            }
        })}/>

        <Tab.Screen name="EventsScreen" component={Events} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View>
                    <SimpleLineIcons name="event" size={28} color= {focused ? "#39A5BD" : "black"} />
                </View>
            ),
        }} 
        listeners = {(navigation, route) => ({
            tabPress: e => {
                Animated.spring(tabOffsetValue, {
                    toValue: getWidth(),
                    useNativeDriver: true
                }). start();
            }
        })}/>

        <Tab.Screen name="CreateEventScreen" component={CreateEvent} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TouchableOpacity style  = {{
                    top: -25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...styles.shadow
                }} onPress = {pressHandler} > 
                    <View style = {{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundcColor: '#39A5BD'
                    }}>
                        <Image
                        source = {require('../assets/pictures/plus.png')}
                        resizeMode = "contain"
                        style = {{
                            width: 65,
                            height: 65,
                        }}
                        />
                    </View>
                </TouchableOpacity>
            )
        }}/>
        
        <Tab.Screen name="InboxScreen" component={Inbox} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View>
                   <Fontisto name="email" size={30} color= {focused ? "#39A5BD" : "black"} />
                </View>
            ),
        }}
        listeners = {(navigation, route) => ({
            tabPress: e => {
                Animated.spring(tabOffsetValue, {
                    toValue: getWidth() * 3,
                    useNativeDriver: true
                }). start();
            }
        })}/>

         <Tab.Screen name="ProfileScreen" component={Profile} options = {{
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <View>
                    <Ionicons name="person-outline" size={30} color= {focused ? "#39A5BD" : "black"} />
                </View>
            ),
        }}listeners = {(navigation, route) => ({
            tabPress: e => {
                Animated.spring(tabOffsetValue, {
                    toValue: getWidth() * 4,
                    useNativeDriver: true
                }). start();
            }
        })}/>
    </Tab.Navigator>

    <Animated.View style = {{
        width: getWidth(),
        height: 4,
        backgroundColor: '#39A5BD',
        ...Platform.select({
            android: {
                bottom: 50,
            },
            ios: {
                bottom: 80,
                position: 'aboslute',
                borderRadius: '50%',
            }
        }),
        transform: [
            {translateX: tabOffsetValue}
        ]
    }}>

    </Animated.View>
    </>
  );
}

function getWidth() {
    let width = Dimensions.get("window").width
    width = width
    return width / 5
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