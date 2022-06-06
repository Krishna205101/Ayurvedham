import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientForm from '../Components/PatientForm';
import Print from '../Components/ProfilePrint';
import Prescription from '../Components/PreviousPrescription';

const Stack = createNativeStackNavigator();

export default function createAppContainer() {
    return (
        <Stack.Navigator screenOptions = {{headerShown : false}}>
            <Stack.Screen name="PatientForm" component={PatientForm} />
            <Stack.Screen name="Print" component={Print} />
            <Stack.Screen name="Prescription" component={Prescription} />
        </Stack.Navigator>
    )
}