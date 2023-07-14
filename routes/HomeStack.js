import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from "@react-navigation/native";
import Home from '../screens/Home.js';
import Welcome from '../screens/Welcome.js';
import NewLogin from '../screens/NewLogin.js';
import SignUp from '../screens/SignUp.js';
import BottomTabNavigator from './BottomTabNavigator.js';
import NamePage from '../screens/NamePage.js';
import UsernamePage from '../screens/UsernamePage.js';
import Birthday from '../screens/Birthday.js';
import Gender from '../screens/Gender.js';
import Uploadpfp from '../screens/Uploadpfp.js';
import CreateEvent from '../screens/CreateEvent.js';
import EditProfile from '../screens/EditProfile.js';
import Friends from '../screens/Friends.js';
import AddFriend from '../screens/AddFriend.js';
import ChooseParticipants from '../screens/ChooseParticipants.js';
import TestGroupChat from '../screens/testGroupchat.js';
import EventInvitations from '../screens/eventInvitations.js';
import EditEvent from '../screens/EditEvent.js';
import UpdateParticipants from '../screens/UpdateParticipants.js';
import Nearby from '../screens/Nearby.js';

const Stack = createNativeStackNavigator();

export default function HomeStack () {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name = "Welcome"
                component = {Welcome}
                options = {{headerShown: false}}></Stack.Screen>

            <Stack.Screen
                name = "NewLogin"
                component = {NewLogin}
                options = {{headerShown: false}}></Stack.Screen>

            <Stack.Screen
                name = "SignUp"
                component = {SignUp}
                options = {{headerShown: false}}></Stack.Screen>

            <Stack.Screen
                name = "NamePage"
                component = {NamePage}
                options = {{headerShown: false}}></Stack.Screen>

            <Stack.Screen
                name = "Birthday"
                component = {Birthday}
                options = {{headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "Gender"
                component = {Gender}
                options = {{headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "UsernamePage"
                component = {UsernamePage}
                options = {{headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "Uploadpfp"
                component = {Uploadpfp}
                options = {{headerShown: false}}></Stack.Screen>

            <Stack.Screen
                name = "Home"
                component = {BottomTabNavigator}
                options = {{headerShown: false}}></Stack.Screen>
                
            <Stack.Screen
                name = "CreateEvent"
                component = {CreateEvent}
                options = {{headerShown: false}}></Stack.Screen>

            <Stack.Screen
                name = "ChooseParticipants"
                component = {ChooseParticipants}
                options = {{headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "EditProfile"
                component = {EditProfile}
                options = {{
                    title: 'Edit Profile',
                    headerTitleAlign: 'center',
                    headerShown: true,
                    headerShadowVisible: false,
                    //headerTransparent: true,
                    headerTitleStyle: {
                        fontFamily: 'Nunito-Sans-Bold',
                        color: 'white'
                    },
                    headerStyle: {
                        backgroundColor: '#39A5BD',
                    }
                }}></Stack.Screen>

            <Stack.Screen
                name = "Friends"
                component = {Friends}
                options = {{
                    headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "AddFriend"
                component = {AddFriend}
                options = {{
                    headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "EventInvitations"
                component = {EventInvitations}
                options = {{
                    headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "TestGroupChat"
                component = {TestGroupChat}
                options = {{
                    headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "EditEvent"
                component = {EditEvent}
                options = {{
                    headerShown: false}}></Stack.Screen>
            
            <Stack.Screen
                name = "UpdateParticipants"
                component = {UpdateParticipants}
                options = {{
                headerShown: false}}></Stack.Screen>

           <Stack.Screen     
                name = "Nearby"
                component = {Nearby}
                options = {{
                headerShown: false}}></Stack.Screen>

        </Stack.Navigator>

    )
}