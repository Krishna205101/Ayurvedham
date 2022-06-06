import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, Button, Dimensions, ActivityIndicator, TouchableOpacity,ScrollView } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { Formik } from 'formik';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from '@react-navigation/native';


const db = Sqlite.openDatabase("ProjectAyur.db");

export default function Vishesha() {

    const { colors } = useTheme()

    const [VisheshaData, setVisheshaData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedData, setSelectedData] = useState([])
    const [selected, setSelected] = useState(false)
    const [index, setIndex] = useState(0)
    const width = Dimensions.get('window').width
    const [id, setId] = useState('SI01')
    const [change, setChange] = useState(null)
    const [filteredVisheshaData, setFilteredVisheshaData] = useState([])
    const [search, setSearch] = useState('')

    //Pagination
    const [pageNumbers, setPageNumbers] = useState(0)
    const [isloading, setIsloading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const pageItems = 10
    const indexOfLastItem = currentPage * pageItems
    const indexOfFirstItem = indexOfLastItem - pageItems
    const currentPosts = filteredVisheshaData.slice(indexOfFirstItem, indexOfLastItem)

    useEffect(() => {

        setIsloading(true)
        setPageNumbers([])

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Vishesha `, [], (_, { rows: { _array } }) => {
                setPageNumbers([])
                setVisheshaData(_array);
                setFilteredVisheshaData(_array);
                setIsloading(false)
                setPageNumbers(Math.ceil(_array.length / pageItems))
            })
        })

        setChange(null)


    }, [change])

    const handleDelete = (rowMap, rowKey) => {
        db.transaction((tx) => {
            tx.executeSql(`DELETE FROM PresVishesha WHERE Vishesha=?`, [rowKey],
                // (data) => console.log('data' + data), (err) => console.log('error' + err)
            )
        })

        db.transaction((tx) => {
            tx.executeSql(`DELETE FROM Vishesha WHERE ID=?`, [rowKey],
                // (data) => console.log('data' + data), (err) => console.log('error' + err)
            )
        })
        setChange(rowKey)
    }

    const handleEdit = (data, rowMap, rowKey) => {
        setSelectedData(data.item)
        setIndex(VisheshaData.findIndex((item) => item.Id == rowKey))
    }

    const searchData = (val) => {
        if (val) {
            const newData = VisheshaData.filter(function (item) {
                const itemData = item.Name
                    ? item.Name.toUpperCase()
                    : ''.toUpperCase();
                const textData = val.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredVisheshaData(newData);
            setSearch(val);
        } else {
            setFilteredVisheshaData(VisheshaData);
            setSearch(val);
        }
    };

    const addUser = () => {
        setModalVisible(true);
        setSelected(false);
        setSelectedData([]);
        if (VisheshaData != 0) {
            setId("SI0" + `${parseInt(VisheshaData[VisheshaData.length - 1].Id.slice(2)) + 1}`)
        }
    }


    return (
        <View style={[styles.container, { backgroundColor: colors.back }]}>

            <View style={styles.list}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.txt,fontSize : colors.font+5 }]}>Special Instructions Screen</Text>
                    <AntDesign name="pluscircle" size={colors.font+10} color={colors.icon} onPress={() => {
                        addUser()
                    }} style={styles.add} />
                </View>

                <TextInput style={styles.search} placeholder="search" onChangeText={(val) => searchData(val)} />

                <View style={{ height: 450 }}>
                    <View style={[styles.item, { backgroundColor: colors.icon }]}>
                        <Text style={[styles.id, { color: colors.txt,fontSize : colors.font }]}>Id</Text>
                        <Text style={[styles.name, { color: colors.txt,fontSize : colors.font }]}>Name</Text>
                    </View>
                    {isloading ?
                        <ActivityIndicator size="large" color={colors.txt} />
                        : <SwipeListView
                            keyExtractor={(item) => item.Id}
                            data={currentPosts}
                            renderItem={(data) => {
                                return (
                                    <View style={[styles.item, { backgroundColor: colors.crd }]}>
                                        <Text style={[styles.id, { color: colors.txt,fontSize : colors.font }]}>{data.item.Id}</Text>
                                        <Text style={[styles.name, { color: colors.txt,fontSize : colors.font }]}>{data.item.Name}</Text>
                                    </View>
                                )
                            }}
                            renderHiddenItem={(data, rowMap) => {
                                return (
                                    <View style={styles.hidden}>
                                        <TouchableOpacity style={styles.delete} onPress={() => handleDelete(rowMap, data.item.Id)}>
                                            <Entypo name="trash" size={18}></Entypo>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.edit} onPress={() => { setModalVisible(true), handleEdit(data, rowMap, data.item.Id), setSelected(true) }}>
                                            <Entypo name="edit" size={18}></Entypo>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            leftOpenValue={width / 2}
                            previewRowKey={"SI01"}
                            previewOpenValue={width / 2}
                            previewOpenDelay={1500}
                            rightOpenValue={width / 2}
                        />}

                    <View style={styles.pagination}>
                    <Text style={{ padding: 15,color: colors.txt,fontSize : colors.font }}>Pages</Text>
                    {currentPage > 1 && <AntDesign name="leftsquareo" size={colors.font+3} onPress={() => { setCurrentPage(currentPage - 1) }} style={{ padding: 6 }} color={colors.txt} />}
                    <Text style={{ color: colors.txt,fontSize : colors.font }}>{currentPage}</Text>
                    {currentPage < pageNumbers && <AntDesign name="rightsquareo" size={colors.font+3} onPress={() => setCurrentPage(currentPage + 1)} style={{ padding: 6 }} color={colors.txt} />}
                </View>
                </View>
            </View>



            <Modal animationType="slide" visible={modalVisible} style={styles.modal} onRequestClose={() => { setModalVisible(false), setSelected(false), setSelectedData([]) }}>
                <View style={{ flex: 1, backgroundColor: colors.back }}>
                    <Formik
                        initialValues={{ Id: selected ? selectedData.Id : id, Name: selectedData.Name }}
                        onSubmit={(values) => {
                            if (selected) {
                                db.transaction((tx) => {
                                    tx.executeSql(`UPDATE Vishesha SET Name=? WHERE Id=?`, [values.Name, values.Id],
                                        // (data) => console.log('we made it', data), (err) => console.log('We have encounter an Error', err)
                                    )
                                })
                                setChange(values.Id)
                            }
                            else {
                                db.transaction((tx) => {
                                    tx.executeSql(`INSERT INTO Vishesha (
                                    Id,
                                    Name
                                )
                                VALUES (?,?);`, [values.Id, values.Name],
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
                                    <View style={styles.field}>
                                        <Text style={[styles.heading, { color: colors.txt,fontSize : colors.font }]}>Vishesha Id</Text>
                                        <Text style={[styles.input, { color: colors.txt,fontSize : colors.font }]}>{props.values.Id}</Text>
                                    </View>
                                    <View style={[styles.field,{justifyContent : "center",alignItems : "center"}]}>
                                        <Text style={[styles.heading, { color: colors.txt,fontSize : colors.font }]}>Vishesha Name</Text>
                                        <TextInput style={[styles.input, { backgroundColor: "white" }]} placeholder="Vishesha Name" onChangeText={props.handleChange('Name')} value={props.values.Name} />
                                    </View>
                                    <Button title="submit" color={colors.icon} onPress={props.handleSubmit} />
                                </View>
                            </View>
                        )}

                    </Formik>
                </View>
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
        paddingLeft: '80%'
    },
    field: {
        flexDirection: 'row',
        padding: 10
    },
    item: {
        padding: 15,
        backgroundColor: 'brown',
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
        padding: 8,
        alignItems: 'center',
        height: '100%',
    },
    button: {
        height: '100%'
    },
    delete: {
        backgroundColor: 'red',
        height: '90%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    edit: {
        backgroundColor: '#C8C8C7',
        height: '90%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        flex: 1,
        textAlign: 'left'
    },
    input: {
        flex: 1,
        textAlign: 'left',
        height: 40,
        borderRadius: 10
    },
    form: {
        margin: '5%'
    },
    closeForm: {
        textAlign: 'right',
        paddingTop: 20,
        paddingRight: 30
    },
    pagination: {
        flexDirection: 'row',
        paddingRight: "5%",
        justifyContent: "flex-end",
        paddingBottom: "2%",
        alignItems : "center"
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