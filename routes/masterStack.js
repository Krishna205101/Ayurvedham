import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientStack from './PatientStack';
import Aushadham from '../Screens/Master/Aushadham Master';
import Anupanam from '../Screens/Master/anupanam';
import Laxanam from '../Screens/Master/laxanam';
import Master from '../Screens/Master/master';
import Dose from '../Screens/Master/Dose';
import Roga from '../Screens/Master/roga';
import Samayam from '../Screens/Master/samayam';
import Samprapti from '../Screens/Master/samprapti';
import VisheshaSoochana from '../Screens/Master/visheshasoochana';

// const screens = {
//     Master: {
//         screen: Master
//     },
//     Patient: {
//         screen: Patient
//     },
//     Aushadham: {
//         screen: Aushadham
//     },
//     Anupanam :{
//         screen : Anupanam
//     },
//     Laxanam :{
//         screen : Laxanam
//     },
//     Dose :{
//         screen : Dose
//     },
//     Roga :{
//         screen : Roga
//     },
//     Samayam :{
//         screen : Samayam
//     },
//     Samprapti :{
//         screen : Samprapti
//     },
//     VisheshaSoochana :{
//         screen : VisheshaSoochana
//     },
// }

const Stack = createNativeStackNavigator();

export default function createAppContainer() {
    return (
        <Stack.Navigator screenOptions = {{headerShown : false}}>
            <Stack.Screen name="MasterScreen" component={Master}/>
            <Stack.Screen name="Patient" component={PatientStack} />
            <Stack.Screen name="Medicine" component={Aushadham} />
            <Stack.Screen name="Vehicle" component={Anupanam} />
            <Stack.Screen name="Signs & Symptoms" component={Laxanam} />
            <Stack.Screen name="Dose" component={Dose} />
            <Stack.Screen name="Main Complaint" component={Roga} />
            <Stack.Screen name="Time" component={Samayam} />
            <Stack.Screen name="Pathology" component={Samprapti} />
            <Stack.Screen name="Special Instructions" component={VisheshaSoochana} />
        </Stack.Navigator>
    )
}