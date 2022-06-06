import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Dimensions } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const db = Sqlite.openDatabase('ProjectAyur.db')

const width = Dimensions.get("window").width > 425

export default function Prescription(props) {

    const { colors } = useTheme()
    const [patientData, setPatientData] = useState([{ Id: "TM01", Name: "", Age: "", Gender: "", Contact: "", Address: "", VisitedDate: "00/00/0000", FollowUpDate: "00/00/0000" }])
    const [prescriptionIds, setPrescriptionIds] = useState([])
    const [prescription, setPrescription] = useState([{ PrescriptionId: "", Bp: "", Rbs: "", Height: "", Weight: "" }])
    const [receipt, setReceipt] = useState([])
    const [roga, setRoga] = useState([])
    const [laxanam, setLaxanam] = useState([])
    const [samprapti, setSamprapti] = useState([{ Impressions: "", Diagnosis: "" }])
    const [vishesha, setVishesha] = useState([])
    const [show, setShow] = useState(false)
    const [profile, setProfile] = useState([])
    const [visited, setVisited] = useState("")
    const [followUp, setFollowUp] = useState("")

    useEffect(() => {

        // console.log(props.route.params.id)

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Patient WHERE Patient.Id="${props.route.params.id}"`, [], (_, { rows: { _array } }) => {
                setPatientData(_array)
                // console.log(_array)
                // if(_array[0].VisitedDate.slice(4,7) == "Jan"){
                //     setVisited("1")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Feb"){
                //     setVisited("2")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Mar"){
                //     setVisited("3")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Apr"){
                //     setVisited("4")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "May"){
                //     setVisited("5")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Jun"){
                //     setVisited("6")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Jul"){
                //     setVisited("7")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Aug"){
                //     setVisited("8")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Sep"){
                //     setVisited("9")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Oct"){
                //     setVisited("10")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Nov"){
                //     setVisited("11")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Dec"){
                //     setVisited("12")
                // }
                // if(_array[0].FollowUpDate.slice(4,7) == "Jan"){
                //     setFollowUp("1")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Feb"){
                //     setFollowUp("2")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Mar"){
                //     setFollowUp("3")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Apr"){
                //     setFollowUp("4")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "May"){
                //     setFollowUp("5")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Jun"){
                //     setFollowUp("6")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Jul"){
                //     setFollowUp("7")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Aug"){
                //     setFollowUp("8")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Sep"){
                //     setFollowUp("9")
                // }
                // else if(_array[0].VisitedDate.slice(4,7) == "Oct"){
                //     setFollowUp("10")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Nov"){
                //     setFollowUp("11")
                // }
                // else if(_array[0].FollowUpDate.slice(4,7) == "Dec"){
                //     setFollowUp("12")
                // }
            })
        })


        db.transaction((tx) => {
            tx.executeSql(`SELECT Pr.PrescriptionId FROM Patient P JOIN Prescription Pr ON Pr.PatientId=P.Id WHERE P.Id="${props.route.params.id}"`, [], (_, { rows: { _array } }) => {
                setPrescriptionIds(_array)
                // console.log(_array)
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
                // console.log(_array[0])
                setProfile(_array[0])
            })
        })

    }, [])

    const showPrescription = (val) => {
        if (val) {
            setShow(true)
            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Prescription WHERE PrescriptionId="${val}"`, [], (_, { rows: { _array } }) => {
                    setPrescription(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT A.Aushadham,D.Dose,S.Samayam,AN.Anupanam FROM Receipt R JOIN Aushadham A on R.Aushadham=A.Id JOIN Dose D on R.Dose=D.Id JOIN Samayam S on R.Samayam=S.Id JOIN Anupanam AN on R.Anupanam=AN.Id WHERE R.Prescription="${val}"`, [], (_, { rows: { _array } }) => {
                    setReceipt(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT V.Name FROM PresVishesha PV JOIN Vishesha V on PV.Vishesha=V.Id WHERE PV.Prescription="${val}"`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    setVishesha(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT R.Name FROM PresRoga PR JOIN Roga R on PR.Roga=R.Id WHERE PR.Prescription="${val}"`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    setRoga(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Pathology WHERE Prescription="${val}"`, [], (_, { rows: { _array } }) => {
                    // console.log(JSON.parse(_array[0].Pathology))
                    setSamprapti(_array)
                    // console.log(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT L.Name FROM PresLaxanam PL JOIN Laxanam L on PL.Laxanam=L.Id WHERE PL.Prescription="${val}" `, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    setLaxanam(_array)
                })
            })

            // db.transaction((tx) => {

            // tx.executeSql(`INSERT INTO PresLaxanam (
            //     Prescription,
            //     Laxanam
            // )
            // VALUES (?,?);`, ["PM01", "SS01"],
            //     (data) => { console.log(`we made it PresLaxanam`) }, (err) => console.log(`We have encounter an Error in PresLaxanam`)
            // )

            //     tx.executeSql(`SELECT Laxanam FROM PresLaxanam `, [], (_, { rows: { _array } }) => {
            //         console.log(_array)
            //         // setLaxanam(_array)
            //     })
            // })


        }
        else {
            setShow(false)
            setPrescription([{ PrescriptionId: "", Bp: "", Rbs: "", Height: "", Weight: "" }])
        }
        // console.log(val)


    }

    return (
        <ScrollView style={{ backgroundColor: colors.back }}>
            <View style={{ justifyContent: "flex-end", alignItems: "flex-end", flex: 1 }}>
                <AntDesign name="close" style={{ margin: 10 }} size={colors.font + 5} color={colors.txt} onPress={() => props.navigation.navigate("PatientForm")} />
            </View>
            <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: colors.font, color: colors.txt }}>{props.route.params.patient.Id}</Text>
                <Text style={{ fontSize: colors.font, color: colors.txt }}>{props.route.params.patient.Name}</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Picker onValueChange={(val) => { showPrescription(val) }} style={[styles.prescription, { color: colors.txt, fontSize: colors.font }]}>
                        <Picker.Item label="Prescription" style={[styles.disabled, { fontSize: colors.font }]}> </Picker.Item>
                        {prescriptionIds.map((item) => (
                            <Picker.Item key={item.PrescriptionId} label={item.PrescriptionId} value={item.PrescriptionId} style={{ fontSize: colors.font }}></Picker.Item>
                        ))}
                    </Picker>
                </View>
            </View>

            {show &&
                <View>
                    {prescription.map((item) => (
                        <View key={item.PrescriptionId}>
                            <View style={{ flexDirection: width ? "row" : "column" }}>
                                <View style={styles.prescriptionData}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Bp</Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Bp}mm of Hg</Text>
                                    </View>
                                </View>

                                <View style={styles.prescriptionData}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Rbs</Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Rbs}mg/DL</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: width ? "row" : "column" }}>
                                <View style={styles.prescriptionData}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Weight</Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Weight} Kg</Text>
                                    </View>
                                </View>

                                <View style={styles.prescriptionData}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Height</Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Height} Ft</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    ))}

                    <View style={styles.Roga}>
                        <View style={styles.head}>
                            <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                            <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}> Main Complaint</Text>
                        </View>
                        {roga.map((item) => (
                            <View style={styles.matter} key={item.Name}>
                                <AntDesign name="arrowright" size={20} color={colors.txt} />
                                <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}>{item.Name}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.Roga}>
                        <View style={styles.head}>
                            <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                            <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}> Signs & Symptoms</Text>
                        </View>
                        {laxanam.map((item) => (
                            <View style={styles.matter} key={item.Name}>
                                <AntDesign name="arrowright" size={20} color={colors.txt} />
                                <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}>{item.Name}</Text>
                            </View>
                        ))}
                    </View>

                    {/* <View style={styles.Roga}>
                        <View style={styles.head}>
                            <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                            <Text style={[styles.text, { color: colors.txt,fontSize:colors.font }]}> Samprapti</Text>
                        </View>
                        {samprapti.map((item) => (
                            <View style={styles.matter} key={item.Name}>
                                <AntDesign name="arrowright" size={20} color={colors.txt} />
                                <Text style={[styles.text, { color: colors.txt,fontSize:colors.font }]}>{item.Name}</Text>
                            </View>
                        ))}
                    </View> */}

                    <View style={styles.Roga}>
                        <View style={[styles.head]}>
                            <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                            <Text style={[styles.text, { color: colors.txt, fontSize: colors.font + 2 }]}>Pathology</Text>
                        </View>
                        {samprapti.map((item, index) => (
                            <View style={{ marginTop: 10 }} key={index}>
                                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 5, marginLeft: 20 }}>
                                    <AntDesign name="arrowright" size={20} color={colors.txt} />
                                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Impressions</Text>
                                    <Text>: </Text>
                                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{item.Impressions}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 5, marginLeft: 20 }}>
                                    <AntDesign name="arrowright" size={20} color={colors.txt} />
                                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Diagnosis</Text>
                                    <Text>: </Text>
                                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{item.Diagnosis}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeading, { fontSize: colors.font }]}>Medicine</Text>
                            <Text style={[styles.tableHeading, { fontSize: colors.font }]}>Dose</Text>
                            <Text style={[styles.tableHeading, { fontSize: colors.font }]}>Time</Text>
                            <Text style={[styles.tableHeading, { fontSize: colors.font }]}>Vehicle</Text>
                        </View>
                        <ScrollView nestedScrollEnabled={true}>
                            {receipt.map((item, index) => (
                                // console.log(item),
                                <View key={index} style={styles.tableData}>
                                    <Text style={[styles.tableElement, { color: colors.txt, fontSize: colors.font }]}>{item.Aushadham}</Text>
                                    <Text style={[styles.tableElement, { color: colors.txt, fontSize: colors.font }]}>{item.Dose}</Text>
                                    <Text style={[styles.tableElement, { color: colors.txt, fontSize: colors.font }]}>{item.Samayam}</Text>
                                    <Text style={[styles.tableElement, { color: colors.txt, fontSize: colors.font }]}>{item.Anupanam}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.Roga}>
                        <View style={styles.head}>
                            <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                            <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}> Special Instructions</Text>
                        </View>
                        {vishesha.map((item) => (
                            <View style={styles.matter} key={item.Name}>
                                <AntDesign name="arrowright" size={20} color={colors.txt} />
                                <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}>{item.Name}</Text>
                            </View>
                        ))}
                    </View>



                </View>

            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'center',
        fontSize: 25,
        backgroundColor: "#E78B5E",
        height: 50,
        paddingTop: 5,
    },
    element: {
        padding: 10,
        flexDirection: 'row'
    },
    heading: {
        paddingRight: 50,
        fontSize: 20
    },
    data: {
        fontSize: 18
    },
    prescription: {
        width: "50%",
        paddingLeft: 6,
        height: 50,
        elevation: 15,
        borderWidth: 1,
        alignSelf: 'flex-start'
    },
    prescriptionData: {
        flexDirection: 'row',
        padding: 10,
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    Roga: {
        padding: 10,
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    matter: {
        flexDirection: 'row',
        paddingLeft: 20,
        alignItems: 'center'
    },
    text: {
        fontSize: 20
    },
    table: {
        marginLeft: '1%',
        borderWidth: 1,
        marginRight: '1%',
        height: 200,
        marginBottom: "10%"
    },
    tableData: {
        flexDirection: 'row',
        height: 50
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'black',
    },
    tableHeading: {
        flex: 1,
        borderWidth: 1,
        paddingLeft: '1%',
        fontStyle: 'normal',
        color: 'white',
        borderRightColor: 'white',
    },
    tableElement: {
        flex: 1,
        borderWidth: 1,
        paddingLeft: '1%',
        fontStyle: 'normal',
        color: 'black',
        borderRightColor: 'white',
    },
    disabled: {
        fontSize: 14,
        borderWidth: 1,
        flex: 1,
        color: '#C1B8B9'
    }
})