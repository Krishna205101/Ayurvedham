import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker'
import { useTheme } from '@react-navigation/native'


const db = Sqlite.openDatabase("ProjectAyur.db")

export default function Medicine({ save, prescription, reset }) {

    const { colors } = useTheme()
    const [change, setChange] = useState(null)
    const [aushadhamData, setAushadhamData] = useState([])
    const [doseData, setDoseData] = useState([])
    const [anupanamData, setAnupanamData] = useState([])
    const [samayamData, setSamayamData] = useState([])
    const [aushadham, setAushadham] = useState({ Id: "", Aushadham: "Medicine" })
    const [dose, setDose] = useState({ Id: "", Dose: "Dose" })
    const [anupanam, setAnupanam] = useState({ Id: "", Anupanam: "Vehicle" })
    const [samayam, setSamayam] = useState({ Id: "", Samayam: "Time" })
    const [receipt, setReceipt] = useState([])

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Aushadham`, [], (_, { rows: { _array } }) => {
                setAushadhamData(_array);
                // console.log(_array)
            })

            tx.executeSql(`SELECT * FROM Dose`, [], (_, { rows: { _array } }) => {
                setDoseData(_array);
                // console.log(_array)
            })

            tx.executeSql(`SELECT * FROM Anupanam`, [], (_, { rows: { _array } }) => {
                setAnupanamData(_array);
                // console.log(_array)
            })

            tx.executeSql(`SELECT * FROM Samayam`, [], (_, { rows: { _array } }) => {
                setSamayamData(_array);
                // console.log(_array)
            })

            tx.executeSql(`SELECT * FROM Receipt`, [], (_, { rows: { _array } }) => {

            })
        })

        if (save) {
            db.transaction((tx) => {
                for (let i = 0; i < receipt.length; i++) {
                    tx.executeSql(`INSERT INTO Receipt (
                        Prescription,
                        Aushadham,
                        Dose,
                        Samayam,
                        Anupanam
                    )
                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    );`,
                        [prescription, receipt[i].Medicine[0], receipt[i].Dose[0], receipt[i].Time[0], receipt[i].Vehicle[0]],
                        // (data) => { console.log('Receipt saved'), setReceipt([]) }, (err) => console.log('Error in receipt')
                    )
                }
                setReceipt([])
            })
        }

        if (reset) {
            setReceipt([])
        }


    }, [save, prescription, change, reset])


    const add = () => {
        setReceipt((prev) => {
            return [
                ...prev,
                { "Number": 2 * prev.length + 1, "Medicine": [aushadham.Id, aushadham.Aushadham], "Dose": [dose.Id, dose.Dose], "Vehicle": [anupanam.Id, anupanam.Anupanam], "Time": [samayam.Id, samayam.Samayam] }
            ]
        })
    }

    const deleteItem = (key) => {
        setReceipt((prev) => {
            return prev.filter(item => item.Number != key)
        })
        // console.log(key)
    }

    return (
        <View style={styles.container}>
            <Text style={{ color: colors.txt, fontSize: colors.font, fontSize: colors.font + 5, fontWeight: "bold" }} onPress={() => setChange(!change)}>Treatment</Text>

            <View style={styles.select}>
                <View style={styles.row}>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ flex: 5, fontSize: colors.font }}>{aushadham.Aushadham}</Text>
                        <Picker style={{ color: colors.txt, fontSize: colors.font, flex: 1 }} onValueChange={(value) => setAushadham(value)}>
                            <Picker.Item style={{ fontSize: colors.font }} label="" style={styles.disabled}></Picker.Item>
                            {aushadhamData.map((item) => (
                                <Picker.Item style={{ fontSize: colors.font }} key={item.Id} label={item.Aushadham} value={item}></Picker.Item>
                            ))}
                        </Picker>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ flex: 5, fontSize: colors.font }}>{dose.Dose}</Text>
                        <Picker style={{ color: colors.txt, fontSize: colors.font, flex: 1 }} onValueChange={(value) => setDose(value)}>
                            <Picker.Item style={{ fontSize: colors.font }} label="" style={styles.disabled}></Picker.Item>
                            {doseData.map((item) => (
                                <Picker.Item style={{ fontSize: colors.font }} key={item.Id} label={item.Dose} value={item}></Picker.Item>
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ flex: 5, fontSize: colors.font }}>{samayam.Samayam}</Text>
                        <Picker style={{ color: colors.txt, fontSize: colors.font, flex: 1 }} onValueChange={(value) => setSamayam(value)}>
                            <Picker.Item style={{ fontSize: colors.font }} label="" style={styles.disabled}></Picker.Item>
                            {samayamData.map((item) => (
                                <Picker.Item style={{ fontSize: colors.font }} key={item.Id} label={item.Samayam} value={item}></Picker.Item>
                            ))}
                        </Picker>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ flex: 5, fontSize: colors.font }}>{anupanam.Anupanam}</Text>
                        <Picker style={{ color: colors.txt, fontSize: colors.font, flex: 1 }} onValueChange={(value) => setAnupanam(value)}>
                            <Picker.Item style={{ fontSize: colors.font }} label="" style={styles.disabled}></Picker.Item>
                            {anupanamData.map((item) => (
                                <Picker.Item style={{ fontSize: colors.font }} key={item.Id} label={item.Anupanam} value={item}></Picker.Item>
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>



            <View style={styles.button}>
                <Button title="add" color={colors.icon} onPress={() => add()} />
            </View>

            <View style={[styles.table, { borderColor: colors.txt }]}>
                <View style={[styles.tableHeader, { backgroundColor: colors.crd }]}>
                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font + 2 }]}>Medicine</Text>
                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font + 2 }]}>Dose</Text>
                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font + 2 }]}>Time</Text>
                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font + 2 }]}>Vehicle</Text>
                </View>
                <ScrollView nestedScrollEnabled={true}>
                    {receipt.map((item) => (
                        <TouchableOpacity style={[styles.tableData, { backgroundColor: 'green', borderColor: colors.txt }]} key={item.Number} onPress={() => deleteItem(item.Number)} >
                            <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>{item.Medicine[1]}</Text>
                            <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>{item.Dose[1]}</Text>
                            <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>{item.Time[1]}</Text>
                            <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>{item.Vehicle[1]}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    picker: {
        flex: 1,
        borderRadius: 5,
        elevation: 1,
        padding: '1%',
        shadowRadius: 3,
        shadowOpacity: 0.1,
        marginRight: '0.5%'
    },
    row: {
        flexDirection: 'row',
        padding: '0.1%',
        paddingTop: 10
    },
    tableHeader: {
        flexDirection: 'row',
    },
    heading: {
        flex: 1,
        borderWidth: 1,
        paddingLeft: '1%',
        fontStyle: 'normal',
        borderRightColor: 'white',
    },
    button: {
        alignItems: 'flex-end',
        padding: '0.5%'
    },
    table: {
        marginLeft: '1%',
        borderWidth: 1,
        marginRight: '1%',
        height: 200
    },
    tableData: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1
    },
    data: {
        flex: 1,
        paddingLeft: '1%',
        // borderRightColor: 'white',
        // borderWidth: 1
    },
    container: {
        margin: '2%',
        padding: 10
    },
    disabled: {
        borderWidth: 1,
        flex: 1,
        color: '#C1B8B9'
    }
})
