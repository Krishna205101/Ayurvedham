import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../Screens/Authentication/Login";
import Register from "../Screens/Authentication/Register"

const Stack = createNativeStackNavigator();

export default function InformationStack() {
    return (
        <Stack.Navigator screenOptions = {{headerShown : false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    )
}