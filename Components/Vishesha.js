import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions, Button, ScrollView, TouchableOpacity } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native'
import { Colors } from 'react-native/Libraries/NewAppScreen';

const db = Sqlite.openDatabase("ProjectAyur.db")

export default function Form({ title, save, prescription, reset }) {

    const { colors } = useTheme()

    const [dropdownData, setDropdownData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [selectedData, setSelectedData] = useState([])
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [search, setSearch] = useState("")
    const [icon, setIcon] = useState("up")
    const [length, setLength] = useState(null)

    useEffect(() => {
        // console.log(prescription)
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Vishesha`, [], (_, { rows: { _array } }) => {
                setDropdownData(_array);
                setFilteredData(_array);
            })
        })
        // console.log(selectedData);


        // setSelectedData([])
        if (save) {
            // console.log(selectedData);
            // console.log(save);
            // console.log(prescription)
            // console.log(title)
            db.transaction((tx) => {
                for (let i = 0; i < selectedData.length; i++) {
                    // console.log(selectedData[i].Id)
                    tx.executeSql(`INSERT INTO PresVishesha (
                        Prescription,
                        Vishesha
                    )
                    VALUES (?,?);`, [prescription, selectedData[i].Id],
                        // (data) => { console.log(`we made it Vishesha`) }, (err) => console.log(`We have encounter an Error in Vishesha`)
                    )
                }
                setSelectedData([])
            })
        }

        if (reset) {
            setSelectedData([])
        }


    }, [save, length, dropdownVisible, reset])


    const addSelect = (item) => {

        let data = selectedData.filter(prev => prev.Id !== item.Id)

        setSelectedData((prev) => {
            return [
                { Name: item.Name, Id: item.Id },
                ...data
            ]
        })
        // setFilteredData((prev) => {
        //     return prev.filter(data => data.Id != item.Id)
        // })
        setDropdownVisible(false)
        setIcon("up")
        setSearch('')

    }

    const deleteSelect = (item) => {
        console.log(item)
        setSelectedData((prev) => {
            return prev.filter(data => data.Id != item.Id)
        })
    }



    const searchFunction = (val) => {
        setIcon("down")
        setDropdownVisible(true)
        if (val) {
            const newData = dropdownData.filter(function (item) {
                const itemData = item.Name
                    ? item.Name.toUpperCase()
                    : ''.toUpperCase();
                const textData = val.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
            setSearch(val);
        } else {
            setFilteredData(dropdownData);
            setSearch(val);
        }
    };

    const change = () => {
        setDropdownVisible(!dropdownVisible)
        if (icon == "up") {
            setIcon("down")
        }
        else {
            setIcon("up")
        }
    }

    const insert = (Id) => {
        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO Vishesha VALUES(?,?)`, [Id, search], (data => setSearch("")))
        })
        setLength(dropdownData.length + 1)
    }

    const addItem = () => {
        // console.log(title.charAt(0))
        // console.log(dropdownData.length)
        if (search) {
            // console.log(search.length)
            if (dropdownData != 0) {
                insert(`SI0` + `${parseInt(dropdownData[dropdownData.length - 1].Id.slice(2)) + 1}`)
                insert
            }
            else {
                insert(`SI01`)
            }
        }
    }


    return (
        <View style={styles.main}>
            <Text style={{ color: colors.txt, fontSize: colors.font + 5, fontWeight: "bold" }}>Special Instructions</Text>
            <View style={styles.header}>
                <View style={styles.select}>
                    <TextInput style={[styles.text, { fontSize: colors.font }]} placeholder="Search" value={search} onChangeText={(val) => searchFunction(val)} />
                    <AntDesign style={styles.icon} name={icon} size={20} onPress={() => change()} />
                </View>
                <View style={{ paddingLeft: 15 }}>
                    <Button title="add" color={colors.icon} onPress={() => addItem()} />
                </View>

            </View>
            <View style={styles.body}>
                {dropdownVisible ? <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
                    {filteredData.map((item) => {
                        return (
                            <TouchableOpacity key={item.Id} style={[styles.dropDown,{backgroundColor : "#E5AB97"}]} onPress={() => addSelect(item)}>
                                <View style={styles.name}>
                                    <Text style={{ fontSize: colors.font }}>{item.Name}</Text>
                                </View>
                                <View style={styles.close}>
                                    <AntDesign name="checkcircle" size={colors.font + 5} />
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                    : <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
                        {selectedData.map((item) => {
                            return (
                                <TouchableOpacity key={item.Id} style={[styles.dropDown,{backgroundColor : "#9ACE76"}]}>
                                    <View style={styles.name}>
                                        <Text style={{ fontSize: colors.font }}>{item.Name}</Text>
                                    </View>
                                    <View style={styles.close}>
                                        <AntDesign name="closecircle" onPress={() => deleteSelect(item)} size={colors.font + 5} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                }
            </View>
        </View>
    )
};


const styles = StyleSheet.create({
    main: {
        margin: '2%',
        padding: 10
    },
    header: {
        flexDirection: 'row',
    },
    select: {
        flex: 1,
        flexDirection: 'row',
        elevation: 10,
        backgroundColor: 'white',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        justifyContent: 'flex-end',
    },
    text: {
        flex: 1
    },
    icon: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: '#DDDDDD',
    },
    body: {
        height: 200,
        borderColor: 'black',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: "#DDDDDD"
    },
    dropDown: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 1,
        borderRadius: 1,
        flexDirection: 'row',
        elevation: 10,
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    scroll: {
        width: '100%',
        height: 200,
        borderRadius: 1
    },
    name: {
        flex: 1,
    },
    close: {
        flex: 1,
        alignItems: 'flex-end'
    },
    icon: {
        alignSelf: "center",
        paddingRight: 5
    }
})