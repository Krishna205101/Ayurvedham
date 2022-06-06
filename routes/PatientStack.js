import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Patient from '../Screens/Master/Patient Master';
import Details from '../Screens/Master/Details';

const Stack = createNativeStackNavigator();

export default function createAppContainer() {
    return (
        <Stack.Navigator screenOptions = {{headerShown : false}}>
            <Stack.Screen name="Patients" component={Patient} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    )
}