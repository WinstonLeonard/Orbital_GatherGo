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
                name = "Home"
                component = {BottomTabNavigator}
                options = {{
                    title: 'Home Page',
                    headerShown: false}}></Stack.Screen>

        </Stack.Navigator>

    )
}