import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Information from "../Screens/Information/Information";
import Visitedpatient from "../Screens/Information/visitedpatient";
import Followuppatients from "../Screens/Information/followuppatients";
import TotalAmount from "../Screens/Information/totalAmount";
import Details from '../Screens/Master/Details';

const Stack = createNativeStackNavigator();

export default function InformationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InformationScreen" component={Information} />
            <Stack.Screen name="Visited" component={Visitedpatient} />
            <Stack.Screen name="Followup" component={Followuppatients} />
            <Stack.Screen name="Total" component={TotalAmount} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    )
}