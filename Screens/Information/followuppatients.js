import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, Button, Dimensions, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import * as Linking from 'expo-linking'
import { AntDesign, Ionicons, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import DatePicker from '@react-native-community/datetimepicker'
import { useTheme } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker';


const db = Sqlite.openDatabase("ProjectAyur.db");

export default function FollowUpPatients({ navigation }) {

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const [date, setDate] = useState(new Date())
    const [dateValue, setDateValue] = useState(month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear())
    const [picker, setPicker] = useState(false)

    const [patientData, setPatientData] = useState([])
    const [screen, setScreen] = useState(Dimensions.get('window').width)
    const [filteredPatientData, setFilteredPatientData] = useState([])
    const [search, setSearch] = useState('')
    const { colors } = useTheme();
    const [pageNumbers, setPageNumbers] = useState(0)
    const [isloading, setIsloading] = useState(true)
    const [searchBy, setSearchBy] = useState("Name")

    const [currentPage, setCurrentPage] = useState(1)
    const pageItems = 10

    const indexOfLastItem = currentPage * pageItems
    const indexOfFirstItem = indexOfLastItem - pageItems
    const currentPosts = filteredPatientData.slice(indexOfFirstItem, indexOfLastItem)




    useEffect(() => {

        setIsloading(true)
        setPageNumbers([])

        db.transaction((tx) => {

            if (date.getDate() < 10) {
                tx.executeSql(`SELECT * FROM Patient WHERE FollowUpDate LIKE '%${month[date.getMonth()] + " 0" + date.getDate() + " " + date.getFullYear()}%'`, [], (_, { rows: { _array } }) => {
                    setPatientData(_array);
                    setFilteredPatientData(_array)
                    setIsloading(false)
                    setPageNumbers(Math.ceil(_array.length / pageItems))
                    setPageNumbers(Math.ceil(_array.length / pageItems))
                })
                // setDateValue()
            }
            else {
                tx.executeSql(`SELECT * FROM Patient WHERE FollowUpDate LIKE '%${dateValue}%'`, [], (_, { rows: { _array } }) => {
                    setPatientData(_array);
                    setFilteredPatientData(_array)
                    setIsloading(false)
                    setPageNumbers(Math.ceil(_array.length / pageItems))
                    setPageNumbers(Math.ceil(_array.length / pageItems))
                })
            }

        })

        Dimensions.addEventListener('change', () => {
            const dim = Dimensions.get("window")
            if (dim.width > dim.height) {
                setScreen(dim.width)
            }
            else {
                setScreen(dim.height)
            }
        });

    }, [])

    const makeCall = (rowKey) => {
        Linking.openURL(`tel:${rowKey}`)
    }

    const sendMessage = (rowKey) => {
        Linking.openURL(`sms:${rowKey}`)
    }

    const sendWhatsapp = (rowKey) => {
        Linking.openURL(`whatsapp://send?text='Hii'&phone=+91${rowKey}`)
    }

    const searchData = (val) => {
        if (val) {
            if (searchBy == "Name") {
                const newData = patientData.filter(function (item) {
                    const itemData = item.Name
                        ? item.Name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = val.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                setFilteredPatientData(newData);
                setSearch(val);
            }
            else if (searchBy == "Address") {
                const newData = patientData.filter(function (item) {
                    const itemData = item.Name
                        ? item.Address.toUpperCase()
                        : ''.toUpperCase();
                    const textData = val.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                setFilteredPatientData(newData);
                setSearch(val);
            }
            else if (searchBy == "Contact") {
                const newData = patientData.filter(function (item) {
                    const itemData = item.Name
                        ? item.Contact
                        : ''.toUpperCase();
                    const textData = val.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                setFilteredPatientData(newData);
                setSearch(val);
            }
            else if (searchBy == "Doctor") {
                const newData = patientData.filter(function (item) {
                    const itemData = item.Name
                        ? item.Doctor.toUpperCase()
                        : ''.toUpperCase();
                    const textData = val.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                setFilteredPatientData(newData);
                setSearch(val);
            }
        } else {
            setFilteredPatientData(patientData);
            setSearch(val);
        }
    };

    const set = (val) => {

        // console.log(val)
        // console.log(date.getDate())

        setPicker(false)
        if (val.type == "set") {
            let d = val.nativeEvent.timestamp
            // console.log(d.getDate())
            let visitedDate = "";
            if (d.getDate() < 10) {
                visitedDate = (month[d.getMonth()] + " 0" + d.getDate() + " " + d.getFullYear())
            }
            else {
                visitedDate = (month[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear())
            }
            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Patient WHERE FollowUpDate LIKE '%${visitedDate}%'`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    setPatientData(_array);
                    setFilteredPatientData(_array)
                })
            })
            setDate(d)
        }

    }


    return (
        <View style={[styles.container, { backgroundColor: colors.back }]}>

            <View style={styles.list}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.txt, fontSize: colors.font + 5 }]}>FollowUp Patients List</Text>
                    <AntDesign style={styles.add} name="calendar" size={colors.font + 8} color={colors.txt} onPress={() => setPicker(true)}></AntDesign>
                    {/* <AntDesign name="addfile" size={24} color="black" onPress={() => navigation.navigate('Details')}></AntDesign> */}
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <View style={{ backgroundColor: "white", flexDirection: "row", alignItems: "center", width: '50%', borderRadius: 10, marginRight: 5 }}>
                        <EvilIcons name="search" size={colors.font} color="black" />
                        <TextInput style={{ fontSize: colors.font, flex: 5 }} placeholder="search" onChangeText={(val) => searchData(val)} />
                        <Picker style={{ flex: 1 }} onValueChange={(val) => { setSearchBy(val) }}>
                            <Picker.Item style={{ color: "#BEB6B6" }} label="Search By" value="Name"></Picker.Item>
                            <Picker.Item label="Name" value="Name"></Picker.Item>
                            <Picker.Item label="Address" value="Address" ></Picker.Item>
                            <Picker.Item label="Contact" value="Contact"></Picker.Item>
                            <Picker.Item label="Doctor" value="Doctor"></Picker.Item>
                        </Picker>
                    </View>
                </View>

                <View>
                    <View style={[styles.item, { backgroundColor: colors.crd }]}>
                        <Text style={[styles.id, { color: colors.txt, fontSize: colors.font }]}>Id</Text>
                        <Text style={[styles.name, { color: colors.txt, fontSize: colors.font }]}>Name</Text>
                        <Text style={[styles.gender, { color: colors.txt, fontSize: colors.font }]}>Gender</Text>
                        <Text style={[styles.contact, { color: colors.txt, fontSize: colors.font }]}>Contact</Text>
                    </View>
                    {
                        isloading ? <ActivityIndicator size="large" color={colors.txt} />
                            :
                            <SwipeListView style={styles.swipe}
                                keyExtractor={(item) => item.Id}
                                data={currentPosts}
                                renderItem={(data) => {
                                    return (
                                        <ScrollView style={styles.view}>
                                            <TouchableOpacity style={[styles.item, { backgroundColor: colors.crd }]} onPress={() => navigation.navigate('Details', { Id: data.item.Id })}>
                                                <Text style={[styles.id, { color: colors.txt, fontSize: colors.font }]}>{data.item.Id}</Text>
                                                <Text style={[styles.name, { color: colors.txt, fontSize: colors.font }]}>{data.item.Name}</Text>
                                                <Text style={[styles.gender, { color: colors.txt, fontSize: colors.font }]}>{data.item.Gender}</Text>
                                                <Text style={[styles.contact, { color: colors.txt, fontSize: colors.font }]}>{data.item.Contact}</Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    )
                                }}
                                renderHiddenItem={(data, rowMap) => {
                                    return (
                                        <View style={styles.hidden}>
                                            {/* <Button style={styles.button} title="delete"></Button> */}
                                            <Ionicons style={styles.edit} name="call" size={40} color="blue" onPress={() => makeCall(data.item.Contact)} />
                                            <MaterialIcons style={styles.edit} name="textsms" size={40} color="blue" onPress={() => sendMessage(data.item.Contact)} />
                                            <Ionicons style={styles.edit} name="logo-whatsapp" size={40} color="green" onPress={() => sendWhatsapp(data.item.Contact)} />
                                        </View>
                                    )
                                }}
                                leftOpenValue={screen / 3}
                                previewOpenValue={screen / 3}
                                previewOpenDelay={1500}
                                rightOpenValue={screen / 3}
                            />
                    }
                </View>
                <View style={styles.pagination}>
                    <Text style={{ padding: 15, color: colors.txt, fontSize: colors.font }}>Pages</Text>
                    {currentPage > 1 && <AntDesign name="leftsquareo" size={25} onPress={() => { setCurrentPage(currentPage - 1) }} style={{ padding: 6 }} color={colors.txt} />}
                    <Text style={{ fontSize: 25, color: colors.txt, fontSize: colors.font }}>{currentPage}</Text>
                    {currentPage < pageNumbers && <AntDesign name="rightsquareo" size={25} onPress={() => setCurrentPage(currentPage + 1)} style={{ padding: 6 }} color={colors.txt} />}
                </View>
                {picker && <DatePicker mode="date" value={date} onChange={(val) => { set(val) }}></DatePicker>}
            </View>



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        elevation: 10,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        padding: 15,
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        textAlign: 'left',
        fontSize: 20
    },
    add: {
        flex: 1,
        textAlign: 'right'
    },
    search: {
        paddingLeft: '80%',
    },
    view: {
        paddingBottom: 1
    },
    field: {
        flexDirection: 'row',
        padding: 10
    },
    item: {
        padding: 15,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        textAlign: 'left'
    },
    id: {
        flex: 1,
        textAlign: 'left'
    },
    gender: {
        flex: 1,
        textAlign: 'left'
    },
    contact: {
        flex: 1,
        textAlign: 'left'
    },
    hidden: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        height: '100%',
    },
    button: {
        height: '100%'
    },
    edit: {
        backgroundColor: '#C8C8C7',
        fontSize: 18,
        height: '100%',
        width: '8%',
        textAlign: 'center',
        textAlignVertical: 'center',
        elevation: 5,
        borderRadius: 100,
        margin: 2
    },
    pagination: {
        flexDirection: 'row',
        paddingRight: "5%",
        justifyContent: "flex-end",
        paddingBottom: "3%",
        alignItems: "center"
    },
    card: {
        padding: 15,
        margin: 5,
        flexDirection: 'row',
    },
    list: {
        flex: 1,
        marginBottom: '22%'
    }
})