import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Formik } from 'formik'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import { Button } from 'react-native-elements'
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sqlite from 'expo-sqlite';
import * as GoogleSignIn from 'expo-google-sign-in';

const db = Sqlite.openDatabase('ProjectAyur.db')
export default function Backup(props) {

    const { colors } = useTheme()
    const [database, setDatabase] = useState({ User: [], Branches: [], Patient: [], Aushadam: [], Dose: [], Samayam: [], Anupanam: [], Roga: [], Laxanam: [], Vishesha: [], Prescription: [], PresRoga: [], PresLaxanam: [], Pathology: [], PresVishesha: [], Receipt: [] })

    const backUp = async () => {

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
                let temp = database
                temp.User = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Branches`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Branches = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Patient`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Patient = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Aushadham`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Aushadam = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Dose`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Dose = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Samayam`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Samayam = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Anupanam`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Anupanam = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Roga`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Roga = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Laxanam`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Laxanam = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Vishesha`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Vishesha = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Prescription`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Prescription = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM PresRoga`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.PresRoga = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM PresLaxanam`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.PresLaxanam = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Pathology`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.Pathology = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM PresVishesha`, [], (_, { rows: { _array } }) => {

                let temp = database
                temp.PresVishesha = _array
                setDatabase(temp)
            })

            tx.executeSql(`SELECT * FROM Receipt`, [], (_, { rows: { _array } }) => {
                let temp = database
                temp.Receipt = _array
                setDatabase(temp)
                FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}SQLite/base.txt`, JSON.stringify(database)).then(res => backingUp())
            })
        })
    }

    const backingUp = async () => {
        const value = await AsyncStorage.getItem("google")
        FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/base.txt`).then(res => {
            console.log(res)
            fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
                method: 'POST',
                body: {
                    uri: res.uri,
                },
                headers: {
                    Authorization: "Bearer " + value,
                    "Content-Type": 'text/plain'
                },
            }).then((response) => response.json())
                .then((res) => {
                    Alert.alert(res.id)
                })
        })
    }

    const deleteDatabase = () => {
        FileSystem.deleteAsync(`${FileSystem.documentDirectory}SQLite/ProjectAyur.db`).then(res => console.log(res))
        FileSystem.deleteAsync(`${FileSystem.documentDirectory}SQLite/ProjectAyur.db-journal`).then(res => console.log(res))
        AsyncStorage.removeItem('google')
        GoogleSignIn.signOutAsync()
    }

    return (
        <View style={[styles.main, { backgroundColor: colors.back }]}>
            <View style={styles.card}>
                <View style={{ margin: 5 }}>
                    <Button title="BackUp" buttonStyle={{ backgroundColor: "orange" }} icon={
                        <MaterialIcons style={{ paddingRight: "1%" }} name="backup" size={20} color="white" />
                    } onPress={backUp} />
                </View>
                <View style={{ margin: 5 }}>
                    <Button title="Delete" buttonStyle={{ backgroundColor: "red" }} icon={
                        <MaterialIcons style={{ paddingRight: "1%" }} name="delete" size={20} color="white" />
                    } onPress={() => Alert.alert("Are you sure?","Do you want delete all the data on the device realted to the Ayur",[{text : "OK",onPress : () => deleteDatabase()},{text : "CANCEL"}])} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        flexDirection: 'row',
    },
    button: {
        width: "20%",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        margin: "1%"
    }
})