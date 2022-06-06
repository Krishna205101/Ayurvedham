import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, Button, Dimensions, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { Formik } from 'formik';
import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';


const db = Sqlite.openDatabase("ProjectAyur.db");

const Schema = yup.object({
    Name: yup.string().required(),
    Contact: yup.string().required()
})

export default function Patient({ navigation }) {

    const [patientData, setPatientData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedData, setSelectedData] = useState([])
    const [selected, setSelected] = useState(false)
    const [index, setIndex] = useState(0)
    const [screen, setScreen] = useState(Dimensions.get('window').width)
    const [id, setId] = useState('TM01')
    const [change, setChange] = useState(null)
    const [filteredPatientData, setFilteredPatientData] = useState([])
    const [search, setSearch] = useState('')
    const [prescriptions, setPrescriptions] = useState([])
    const { colors } = useTheme();
    const [pageNumbers, setPageNumbers] = useState(0)
    const [isloading, setIsloading] = useState(true)
    const visitedDate = new Date()
    const [searchBy, setSearchBy] = useState("Name")

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const pageItems = 10
    const indexOfLastItem = currentPage * pageItems
    const indexOfFirstItem = indexOfLastItem - pageItems
    const currentPosts = filteredPatientData.slice(indexOfFirstItem, indexOfLastItem)

    useEffect(async () => {

        setIsloading(true)
        setPageNumbers([])
        let code = JSON.parse(await AsyncStorage.getItem("Branch"))

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM PATIENT WHERE Branch=?`, [code.Branch], (_, { rows: { _array } }) => {
                setPatientData(_array);
                setFilteredPatientData(_array)
                setIsloading(false)
                setPageNumbers(Math.ceil(_array.length / pageItems))
                setPageNumbers(Math.ceil(_array.length / pageItems))
            })
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

    }, [change, navigation,colors.change])

    const handleDelete = (rowMap, rowKey) => {

        db.transaction((tx) => {
            tx.executeSql(`SELECT PrescriptionId from Prescription WHERE PatientId=?`, [rowKey], (_, { rows: { _array } }) => {
                setPrescriptions(_array)
            })
        })

        db.transaction((tx) => {
            for (let i = 0; i < prescriptions.length; i++) {
                tx.executeSql(`DELETE FROM PresRoga WHERE Prescription=?`, [prescriptions[i].PrescriptionId]);
                tx.executeSql(`DELETE FROM PresLaxanam WHERE Prescription=?`, [prescriptions[i].PrescriptionId]);
                tx.executeSql(`DELETE FROM Pathology WHERE Prescription=?`, [prescriptions[i].PrescriptionId]);
                tx.executeSql(`DELETE FROM PresVishesha WHERE Prescription=?`, [prescriptions[i].PrescriptionId]);
                tx.executeSql(`DELETE FROM Receipt WHERE Prescription=?`, [prescriptions[i].PrescriptionId]);
            }
            tx.executeSql(`DELETE FROM Prescription WHERE PatientId=?`, [rowKey])
        })

        db.transaction((tx) => {
            tx.executeSql(`DELETE FROM Patient WHERE ID=?`, [rowKey], (data) => {
                Alert.alert('Success', 'Patient Information Deleted', [{ text: 'OK', onPress: () => { console.log(rowKey), setChange(rowKey) } }])
            })
        })

        // console.log(change)

    }

    const handleEdit = (data, rowMap, rowKey) => {
        setSelectedData(data.item)
        setIndex(patientData.findIndex((item) => item.Id == rowKey))
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

    const addUser = () => {
        setModalVisible(true);
        setSelected(false);
        setSelectedData([]);
        if (patientData != 0) {
            setId("TM0" + `${parseInt(patientData[patientData.length - 1].Id.slice(3)) + 1}`)
        }
    }


    return (
        <View style={[styles.container, { backgroundColor: colors.back }]}>

            <View style={styles.list}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.txt, fontSize: colors.font + 5 }]}>Patient Screen</Text>
                    {/* <AntDesign name="adduser" size={colors.font + 10} color={colors.icon} onPress={() => { addUser() }} style={styles.add} /> */}
                    {/* <AntDesign name="addfile" size={24} color="black" onPress={() => navigation.navigate('Details')}></AntDesign> */}
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <View style={{ backgroundColor: "white", flexDirection: "row", alignItems: "center", width: '50%', borderRadius: 10, marginRight: 5 }}>
                        <EvilIcons name="search" size={colors.font} color="black" />
                        <TextInput style={{ fontSize: colors.font, flex: 5 }} placeholder="search" onChangeText={(val) => searchData(val)} />
                        <Picker style={{ flex: 1 }} onValueChange={(val) => { console.log(val), setSearchBy(val) }}>
                            <Picker.Item style={{ color: "#BEB6B6" }} label="Search By" value="Name"></Picker.Item>
                            <Picker.Item label="Name" value="Name"></Picker.Item>
                            <Picker.Item label="Address" value="Address" ></Picker.Item>
                            <Picker.Item label="Contact" value="Contact"></Picker.Item>
                            <Picker.Item label="Doctor" value="Doctor"></Picker.Item>
                        </Picker>
                    </View>
                </View>

                <View style={{ height: 450 }}>
                    <View style={[styles.item, { backgroundColor: colors.icon }]}>
                        <Text style={[styles.id, { color: colors.txt, fontSize: colors.font }]}>Id</Text>
                        <Text style={[styles.name, { color: colors.txt, fontSize: colors.font }]}>Name</Text>
                        <Text style={[styles.gender, { color: colors.txt, fontSize: colors.font }]}>Address</Text>
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
                                                <Text style={[styles.gender, { color: colors.txt, fontSize: colors.font }]}>{data.item.Address}</Text>
                                                <Text style={[styles.contact, { color: colors.txt, fontSize: colors.font }]}>{data.item.Contact}</Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    )
                                }}
                                renderHiddenItem={(data, rowMap) => {
                                    return (
                                        <View style={styles.hidden}>
                                            {/* <Button style={styles.button} title="delete"></Button> */}
                                            <TouchableOpacity style={styles.delete} onPress={() => handleDelete(rowMap, data.item.Id)}>
                                                <Entypo name="trash" size={18}></Entypo>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.edit} onPress={() => { setModalVisible(true), handleEdit(data, rowMap, data.item.Id), setSelected(true) }}>
                                                <Entypo name="edit" size={18}></Entypo>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                                leftOpenValue={screen / 2}
                                previewRowKey={"TM01"}
                                previewOpenValue={screen / 2}
                                previewOpenDelay={1500}
                                rightOpenValue={screen / 2}
                            />
                    }
                </View>
                <View style={styles.pagination}>
                    <Text style={{ padding: 15, color: colors.txt, fontSize: colors.font, fontSize: colors.font }}>Pages</Text>
                    {currentPage > 1 && <AntDesign name="leftsquareo" size={colors.font + 3} onPress={() => { setCurrentPage(currentPage - 1) }} style={{ padding: 6 }} color={colors.txt} />}
                    <Text style={{ fontSize: colors.font, color: colors.txt, fontSize: colors.font + 2 }}>{currentPage}</Text>
                    {currentPage < pageNumbers && <AntDesign name="rightsquareo" size={colors.font + 3} onPress={() => setCurrentPage(currentPage + 1)} style={{ padding: 6 }} color={colors.txt} />}
                </View>
            </View>



            <Modal animationType="slide" visible={modalVisible} onRequestClose={() => { setModalVisible(false), setSelected(false), setSelectedData([]) }}>
                <ScrollView style={{ flex: 1, backgroundColor: colors.back }}>
                    <Formik
                        initialValues={{ Id: selected ? selectedData.Id : id, Name: selectedData.Name, Age: selectedData.Age, Gender: selected ? selectedData.Gender : "Male", Address: selectedData.Address, Contact: selectedData.Contact }}
                        validationSchema={Schema}
                        onSubmit={(values) => {
                            // console.log(values)
                            if (selected) {
                                db.transaction((tx) => {
                                    tx.executeSql(`UPDATE Patient SET Name=?,Age=?,Gender=?,Address=?,Contact=? WHERE Id=?`, [values.Name, values.Age, values.Gender, values.Address, values.Contact, values.Id],
                                        // (data) => console.log('we made it', data), (err) => console.log('We have encounter an Error', err)
                                    )
                                })
                                setChange(values.Id)
                            }
                            else {
                                db.transaction((tx) => {
                                    tx.executeSql(`INSERT INTO Patient (
                                    Id,
                                    Name,
                                    Age,
                                    Gender,
                                    Address,
                                    Contact,
                                    VisitedDate
                                )
                                VALUES (?,?,?,?,?,?,'${visitedDate}');`, [values.Id, values.Name, values.Age, values.Gender, values.Address, values.Contact],
                                        // (data) => console.log('we made it', data), (err) => console.log('We have encounter an Error', err)
                                    )
                                })
                            }
                            setModalVisible(false)
                            setChange(values.Id)
                        }}>
                        {(props) => (
                            <View>
                                <AntDesign style={styles.closeForm} name="closecircle" size={40} color={colors.icon} onPress={() => { setModalVisible(false), setSelected(false), setSelectedData([]) }} />
                                <View style={styles.form}>
                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Id</Text>
                                        <View style={{ flex: 1, justifyContent: "center" }}>
                                            <Text style={[styles.input, { color: colors.txt, fontSize: colors.font }]}>{props.values.Id}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.field}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Name</Text>
                                        <TextInput style={[styles.input, { backgroundColor: 'white', fontSize: colors.font }]} placeholder="Patient Name" onChangeText={props.handleChange('Name')} value={props.values.Name} />
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Name && props.errors.Name}</Text>
                                    <View style={styles.field}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Age</Text>
                                        <TextInput style={[styles.input, { backgroundColor: 'white', fontSize: colors.font }]} placeholder="Age" keyboardType="numeric" onChangeText={props.handleChange('Age')} value={props.values.Age} />
                                    </View >
                                    <View style={styles.field}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Gender</Text>
                                        <Picker style={[styles.input, { color: colors.txt, fontSize: colors.font }]} selectedValue={props.values.Gender}
                                            onValueChange={props.handleChange('Gender')}
                                        >
                                            <Picker.Item label="Male" value="Male" style={{ fontSize: colors.font }} />
                                            <Picker.Item label="Female" value="Female" style={{ fontSize: colors.font }} />
                                        </Picker>
                                    </View>
                                    <View style={styles.field}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Address</Text>
                                        <TextInput style={[styles.input, { backgroundColor: 'white', fontSize: colors.font }]} placeholder="Address" onChangeText={props.handleChange('Address')} value={props.values.Address} />
                                    </View>
                                    <View style={styles.field}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Contact</Text>
                                        <TextInput style={[styles.input, { backgroundColor: 'white', fontSize: colors.font }]} placeholder="Contact" onChangeText={props.handleChange('Contact')} value={props.values.Contact} />
                                    </View>
                                    <Button title="submit" color={colors.icon} onPress={props.handleSubmit} />
                                </View>
                            </View>
                        )}

                    </Formik>
                </ScrollView>
            </Modal>

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
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    item: {
        padding: 10,
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
    delete: {
        backgroundColor: 'red',
        alignItems: "center",
        justifyContent: "center",
        height: '90%',
        width: '15%',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    edit: {
        backgroundColor: '#C8C8C7',
        alignItems: "center",
        justifyContent: "center",
        height: '90%',
        width: '15%'
    },
    heading: {
        flex: 1,
        textAlign: 'left'
    },
    input: {
        flex: 1,
        textAlign: 'left',
        borderRadius: 10,
        height: 50
    },
    form: {
        margin: '5%'
    },
    closeForm: {
        textAlign: 'right',
        paddingTop: 50,
        paddingRight: 30
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