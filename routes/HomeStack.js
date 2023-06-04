import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from "@react-navigation/native";
import Home from '../screens/Home.js';
import Login from '../screens/Login.js';
import Welcome from '../screens/Welcome.js';
import NewLogin from '../screens/NewLogin.js';
import SignUp from '../screens/SignUp.js';

const Stack = createNativeStackNavigator();

export default function HomeStack () {
    return (
        <NavigationContainer>
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
                    header
                    name = "Login"
                    component = {Login}
                    options = {{title: 'Login Page',
                                headerShown: false}}></Stack.Screen>
                <Stack.Screen
                    name = "Home"
                    component = {Home}
                    options = {{
                        title: 'Home Page',
                        headerShown: false}}></Stack.Screen>

            </Stack.Navigator>

        </NavigationContainer>
    )
}