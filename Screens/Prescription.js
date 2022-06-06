import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Alert } from 'react-native';
import PatientForm from '../Components/PatientForm';
import * as Sqlite from 'expo-sqlite'
import { useTheme } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Form from '../routes/FormStack'

const db = Sqlite.openDatabase('ProjectAyur.db')

export default function Prescription({ navigation }) {

    const { colors } = useTheme()

    const [update, setUpdate] = useState(true)

    const isFocused = useIsFocused();

    useEffect(() => {

        // console.log("prescription")
        setUpdate(!update)

    }, [isFocused])

    return (
        <View style={{ backgroundColor: colors.back }}>
            <PatientForm navigation={update} />
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        }
    }
)