import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Button, Dimensions, Alert, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Formik } from 'formik';
import DatePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import Medicine from './Medicine';
import { Picker } from '@react-native-picker/picker';
import * as Sqlite from 'expo-sqlite'
import { useTheme } from '@react-navigation/native'
import Pathology from './Pathology'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Vishesha from './Vishesha';
import Laxanam from './Laxanam';
import Form from './Form';
import { CheckBox } from 'react-native-elements';

const db = Sqlite.openDatabase("ProjectAyur.db")
const screen = Dimensions.get("screen").width > 425

export default function PatientForm({ navigation }) {

    const { colors } = useTheme()


    const [visited, setVisited] = useState(new Date());
    const [dateValue, setDateValue] = useState(visited.getDate() + '/' + (visited.getMonth() + 1) + '/' + visited.getFullYear());
    const [picker, setPicker] = useState(false);
    const [followUp, setFollowUp] = useState(false)
    const [followUpPicker, setFollowUpPicker] = useState(false)
    const [followUpDate, setFollowUpDate] = useState(null)
    const [followUpValue, setFollowUpValue] = useState(null)


    const [patientData, setPatientData] = useState([]);
    const [save, setSave] = useState(false)
    const [id, setId] = useState('PM01');
    const [patient, setPatient] = useState({ Id: '', Name: '', Age: '', Contact: '', Address: '', Gender: 'Male', Branch: '' })
    const [match, setMatch] = useState('NO')
    const [patientId, setPatientId] = useState("")
    const [reset, setReset] = useState(false)
    const [activity, setActivity] = useState(false)
    const [field, setField] = useState("")
    const [branch, setBranch] = useState({})
    const [doctor, setDoctor] = useState([])

    useEffect(async () => {

        let code = JSON.parse(await AsyncStorage.getItem("Branch"))
        setBranch(code)


        db.transaction((tx) => {
            let c = code
            tx.executeSql(`SELECT * FROM Patient WHERE Branch=?`, [c.Branch], (_, { rows: { _array } }) => {
                setPatientData(_array)
                if (_array != 0) {
                    setPatient({ Id: `${code.Code}0` + `${parseInt(_array[_array.length - 1].Id.slice(3)) + 1}`, Name: '', Age: '', Contact: '', Address: '', Gender: 'Male', Branch: code.Branch })
                    setPatientId(`${code.Code}0` + `${parseInt(_array[_array.length - 1].Id.slice(3)) + 1}`)
                }
                else {
                    setPatient({ ...patient, Id: `${code.Code}01`, Branch: code.Branch })
                    setPatientId(`${code.Code}01`)
                }
            })

            tx.executeSql(`SELECT DISTINCT Doctor FROM Patient WHERE Branch=?`, [c.Branch], (_, { rows: { _array } }) => {
                setDoctor(_array)
            })

            tx.executeSql(`SELECT * FROM Prescription`, [], (_, { rows: { _array } }) => {
                // console.log(_array)
                if (_array != 0) {
                    setId("PM0" + `${parseInt(_array[_array.length - 1].PrescriptionId.slice(3)) + 1}`)
                }
                else {
                    setId("PM01")
                }
            })
        })

        get()

    }, [save, navigation, reset, colors])

    const get = async () => {
        let d = await AsyncStorage.getItem("field")
        setField(d)
        console.log(d)
        setPatient({ Id: patientId, Name: '', Age: '', Contact: '', Address: '', Gender: 'Male', Branch: branch.Branch })
    }

    const change = (selectedDate) => {
        // console.log(selectedDate.type)
        setPicker(false)
        if (selectedDate.type == "set") {
            const currentDate = selectedDate.nativeEvent.timestamp
            setVisited(currentDate)
            setDateValue(currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear())
        }
    }

    const followUpChange = (selectedDate) => {
        // console.log(selectedDate.type)
        setFollowUpPicker(false)
        if (selectedDate.type == "set") {
            const currentDate = selectedDate.nativeEvent.timestamp
            setFollowUpDate(currentDate)
            // console.log(currentDate)
            setFollowUpValue(currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear())
        }
    }

    const showCalender = (text) => {
        if (text == "visited")
            setPicker(true)
        else
            setFollowUpPicker(true)
    }

    const check = (val) => {

        // console.log(val)
        setReset(false)

        if (patientData.length > 0) {
            for (let i = 0; i < patientData.length; i++) {
                if (val == patientData[i].Id) {
                    // console.log('matched')
                    // console.log(patientData[i])
                    setPatient(patientData[i])
                    setMatch('YES')
                    break
                }
                else {
                    setPatient({ Id: val, Name: '', Age: '', Contact: '', Address: '', Gender: 'Male', Branch: branch.Branch })
                    setMatch('NO')
                }
            }
        }
        else {
            setPatient({ Id: val, Name: '', Age: '', Contact: '', Address: '', Gender: 'Male', Branch: branch.Branch })
        }
    }

    const matching = (val) => {
        if (match == "NO") {
            setPatient({ ...patient, Id: patientId, Name: val })
            setReset(false)
        }
        else {
            setPatient({ ...patient, Name: val })
        }
    }

    const fieldChange = async (val) => {
        await AsyncStorage.setItem("field", val)
    }

    return (
        <ScrollView style={styles.main}>
            <Formik
                initialValues={{ Bp: '', Rbs: '', weight: '', height: '', amount: '', followUp: false }}
                onSubmit={(values, actions) => {
                    // console.log(values)
                    // console.log(match)
                    setActivity(true)
                    // console.log(patient)

                    if (match == "NO") {
                        db.transaction((tx) => {
                            tx.executeSql(`INSERT INTO Patient (
                                Id,
                                Name,
                                Age,
                                Gender,
                                Address,
                                Contact,
                                Doctor,
                                Branch,
                                VisitedDate,
                                FollowUpDate
                            )
                            VALUES (?,?,?,?,?,?,?,?,'${visited}','${followUpDate}');`, [patient.Id, patient.Name, patient.Age, patient.Gender, patient.Address, patient.Contact, field, patient.Branch],
                                // (data) => console.log('Patient Inserted'), (err) => console.log('Patient insertion Error')
                            )
                        })
                    }
                    else {
                        db.transaction((tx) => {
                            tx.executeSql(`UPDATE Patient SET Name=?,Age=?,Gender=?,Address=?,Contact=?,Doctor=?,Branch=?,VisitedDate='${visited}',FollowUpDate='${followUpDate}' WHERE Id=?`, [patient.Name, patient.Age, patient.Gender, patient.Address, patient.Contact, field, patient.Branch, patient.Id],
                                // (data) => console.log('Patient Updated'), (err) => console.log('Patient Updation Error')
                            )
                        })
                    }

                    db.transaction((tx) => {
                        tx.executeSql(`INSERT INTO Prescription (
                            PrescriptionId,
                            PatientId,
                            Bp,
                            Rbs,
                            Height,
                            Weight,
                            Visited,
                            FollowUpDate,
                            FollowUp,
                            amount,
                            BranchName,
                            DoctorName
                        )
                        VALUES (
                            '${id}',
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            '${visited}',
                            '${followUpDate}',
                            '${followUp}',
                            ?,
                            ?,
                            ?
                        );`, [patient.Id, values.Bp, values.Rbs, values.height, values.weight, values.amount, patient.Branch, field],
                            (data) => {
                                setSave(true);
                                setTimeout(() => {
                                    setActivity(false)
                                    setSave(false),
                                        setPatientData([]),
                                        actions.resetForm()
                                    navigation.navigate('Print', { id: id })
                                    // Alert.alert('Success', 'Prescription Saved',

                                    //     [{ text: 'OK', onPress: () => { setSave(false), setPatientData([]), actions.resetForm() } },
                                    //     { text: 'Print', onPress: () => { setSave(false), setPatientData([]), actions.resetForm(), navigation.navigate('Print', { print: true, share: false, id: id }) } },
                                    //     { text: 'Share', onPress: () => { setSave(false), setPatientData([]), actions.resetForm(), navigation.navigate('Print', { print: false, share: true, id: id }) } }])
                                }, 5000)

                            },
                            (err) => {
                                Alert.alert('Error', [{ text: 'OK', onPress: () => { setSave(false), setFollowUp(false), setFollowUpDate(null) } }])
                            })
                    })
                    // setSavedData(values)
                }}

                onReset={() => {
                    setReset(true);
                    setFollowUp(false);
                    setFollowUpDate(null);
                }}>

                {(props) => (
                    <View style={styles.form}>
                        <View>
                            <View style={styles.leftForm}>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <View style={styles.subContainer}>
                                        <Text style={{ color: colors.txt, fontSize: colors.font + 5, fontWeight: "bold" }}>Patient</Text>
                                        <View style={styles.patient}>
                                            <View style={{ flex: 1 }}>
                                                <View style={styles.field}>
                                                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Branch</Text>
                                                    <Text style={[styles.id, { fontSize: colors.font }]}>{branch.Branch}</Text>
                                                </View>
                                                <View style={styles.field}>
                                                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Patient Id</Text>
                                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                                        <View style={{ flex: 11, justifyContent: "center" }}>
                                                            <TextInput placeholder="Id" onChangeText={(val) => { check(val) }} value={patient.Id} style={{ color: colors.txt, fontSize: colors.font }}></TextInput>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: "center", width: 5 }}>
                                                            <Picker onValueChange={(val) => { check(val) }}>
                                                                <Picker.Item label="Select Patient" style={{ fontSize: colors.font }}> </Picker.Item>
                                                                {patientData.map((item) => (
                                                                    <Picker.Item key={item.Id} label={item.Name} value={item.Id} style={{ fontSize: colors.font }}></Picker.Item>
                                                                ))}
                                                            </Picker>
                                                        </View>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={styles.field} onPress={() => navigation.navigate('Prescription', { id: patient.Id, patient: patient })}>
                                                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Previous Prescriptions</Text>
                                                    <AntDesign name="rightcircleo" size={colors.font + 4} color={colors.txt} />
                                                </TouchableOpacity>
                                                <View style={styles.field}>
                                                    <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Prescription Id</Text>
                                                    <Text style={{ fontSize: colors.font, flex: 1 }}>{id}</Text>
                                                </View>
                                                <View>
                                                    <View style={{ flex: 1, flexDirection: "row", backgroundColor: "white", margin: 5, borderRadius: 15 }}>
                                                        <View style={{ flex: 11, justifyContent: "center" }}>
                                                            <TextInput style={[styles.input, { fontSize: colors.font, color: colors.txt }]} placeholder="Consultant Doctor" value={field} onChangeText={(val) => { setField(val), fieldChange(val) }}></TextInput>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: "center", width: 5 }}>
                                                            <Picker onValueChange={(val) => setField(val)}>
                                                                <Picker.Item label="" style={{ fontSize: colors.font }}> </Picker.Item>
                                                                {doctor.map((item) => (
                                                                    <Picker.Item key={item.Doctor} label={item.Doctor} value={item.Doctor} style={{ fontSize: colors.font }}></Picker.Item>
                                                                ))}
                                                            </Picker>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[styles.rowFields, { justifyContent: "center", alignItems: "center" }]}>
                                                {match == "NO" ? <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Name" onChangeText={(val) => { matching(val), console.log(patient) }} value={patient.Name} /> :
                                                    <Text style={[styles.input, { fontSize: colors.font }]}>{patient.Name}</Text>
                                                }
                                                <View style={styles.date}>
                                                    <Text style={[styles.today, { color: colors.txt, fontSize: colors.font }]}>{dateValue}</Text>
                                                    <AntDesign name="calendar" size={25} color={colors.txt} onPress={() => showCalender('visited')} style={styles.calender} />
                                                    {picker && <DatePicker mode="date" value={visited} onChange={(val) => change(val)}></DatePicker>}
                                                </View>
                                            </View>
                                            <View style={styles.rowFields}>
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Age" value={patient.Age} keyboardType='numeric' onChangeText={(val) => setPatient({ ...patient, Age: val })} />
                                                <Picker selectedValue={patient.Gender}
                                                    onValueChange={(val) => setPatient({ ...patient, Gender: val })} style={[styles.input, { color: colors.txt, backgroundColor: "white" }]}
                                                >
                                                    <Picker.Item style={{ fontSize: colors.font }} label="Male" value="Male" />
                                                    <Picker.Item style={{ fontSize: colors.font }} label="Female" value="Female" />
                                                </Picker>
                                            </View>
                                            <View style={styles.rowFields}>
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Address" onChangeText={(val) => setPatient({ ...patient, Address: val })} value={patient.Address} multiline={true} />
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Phone" onChangeText={(val) => setPatient({ ...patient, Contact: val })} value={patient.Contact} keyboardType='phone-pad' maxLength={15} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <View style={styles.subContainer}>
                                        <Text style={{ color: colors.txt, fontSize: colors.font + 5, fontWeight: "bold" }}>Observations</Text>
                                        <View style={styles.pariksha}>
                                            <View style={styles.rowFields}>
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Bp in mm of Hg" onChangeText={props.handleChange('Bp')} value={props.values.Bp} keyboardType='phone-pad' />
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter RBS in mg/dL" onChangeText={props.handleChange('Rbs')} value={props.values.Rbs} keyboardType='phone-pad' />
                                            </View>
                                            <View style={styles.rowFields}>
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Weight in Kgs" keyboardType='phone-pad' onChangeText={props.handleChange('weight')} value={props.values.weight} />
                                                <TextInput style={[styles.input, { fontSize: colors.font }]} placeholder="Enter Height in ft" keyboardType='phone-pad' onChangeText={props.handleChange('height')} value={props.values.height} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <Form save={save} title="Roga" prescription={id} reset={reset} />
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <Laxanam save={save} title="Laxanam" prescription={id} />
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <View style={styles.subContainer}>
                                        <Pathology save={save} prescription={id} />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rightForm}>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <Medicine save={save} prescription={id} reset={reset} />
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <Vishesha save={save} title="Vishesha" prescription={id} reset={reset} />
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.crd }]}>
                                    <View style={styles.amountContainer}>
                                        <View style={styles.amount}>
                                            <TextInput placeholder="Amount" value={props.values.amount} onChangeText={props.handleChange('amount')} style={[styles.input, { fontSize: colors.font }]}></TextInput>
                                        </View>
                                        <View style={[styles.followUp, { flexDirection: "column" }]}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <CheckBox style={{ color: colors.txt, fontSize: colors.font }} checked={followUp} checkedColor='blue' uncheckedColor="blue" onPress={() => { setFollowUp(!followUp), setFollowUpDate(new Date()) }} />
                                                <Text style={{ color: colors.txt, fontSize: colors.font }}>FollowUp</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                {followUp && <><AntDesign name="calendar" size={colors.font + 5} color={colors.txt} onPress={() => showCalender('followUp')} style={styles.money} /><Text style={{ color: colors.txt, paddingLeft: 2, fontSize: colors.font }}>{followUpValue}</Text></>}
                                                {followUpPicker && <DatePicker mode="date" minimumDate={visited} value={visited} onChange={(val) => followUpChange(val)}></DatePicker>}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.actions}>
                                    <View style={styles.button}>
                                        <Button title="Save" color={colors.icon} onPress={props.handleSubmit}></Button>
                                    </View>
                                    <View style={styles.button}>
                                        <Button title="New" color={colors.icon} onPress={props.handleReset}></Button>
                                    </View>
                                    {/* <View style={styles.button}>
                                        <Button title="Print" onPress={() => { props.handleSubmit(), setPrint("YES") }}></Button>
                                    </View> */}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </Formik>
            {/* <ProfilePrint prescriptionId={id} print={printing} /> */}
            <Modal visible={activity} transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000099" }}>
                    <View style={{ height: 100, width: 100, backgroundColor: colors.back, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color={colors.txt} />
                    </View>
                </View>
            </Modal>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    form: {
        flexDirection: 'column'
    },
    input: {
        flex: 1,
        padding: 10,
        margin: 5,
        borderRadius: 15,
        backgroundColor: 'white',
    },
    leftForm: {
        flex: 1
    },
    rightForm: {
        flex: 1
    },
    container: {
        flex: 1,
        elevation: 3,
        borderRadius: 10,
        shadowOpacity: 0.3,
        margin: 5,
        shadowRadius: 3
    },
    subContainer: {
        margin: 15,
        borderRadius: 5
    },
    rowFields: {
        flex: 1,
        flexDirection: 'row'
    },
    field: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    show: {
        flexDirection: 'row'
    },
    picker: {
        flex: 1
    },
    heading: {
        flex: 1,
        padding: 10,
    },
    id: {
        flex: 1,
        padding: 10,
        borderRadius: 15,
        backgroundColor: 'white',
    },
    date: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        alignItems: "center"
    },
    today: {
        flex: 3,
    },
    calender: {
        flex: 1
    },
    actions: {
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    button: {
        marginRight: 10,
        paddingRight: 20
    },
    amountContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: '5%',
        flexDirection: 'row'
    },
    amount: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    followUp: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '5%'
    },
    money: {
        paddingLeft: 15
    }
})
