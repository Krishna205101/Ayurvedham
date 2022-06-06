import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { useTheme } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = Sqlite.openDatabase('ProjectAyur.db')

export default function ProfilePrint(props) {

    const { colors } = useTheme()

    // const [prescription, setprescription] = useState([{ Id: "TM01", Name: "", Age: "", Gender: "", Contact: "", Address: "", VisitedDate: "00/00/0000", FollowUpDate: "00/00/0000" }])
    const [prescription, setPrescription] = useState([{ PrescriptionId: "", Bp: "", Rbs: "", Height: "", Weight: "", VisitedDate: "00/00/0000", FollowUpDate: "00/00/0000" }])
    const [receipt, setReceipt] = useState([])
    const [roga, setRoga] = useState([])
    const [laxanam, setLaxanam] = useState([])
    const [vishesha, setVishesha] = useState([])
    const [profile, setProfile] = useState([])
    const [samprapti, setSamprapti] = useState([{ Impressions: "", Diagnosis: "" }])
    const [visited, setVisited] = useState("")
    const [followUp, setFollowUp] = useState("")
    const [logo1, setLogo1] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Blank_square.svg/2048px-Blank_square.svg.png")
    const [logo2, setLogo2] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Blank_square.svg/2048px-Blank_square.svg.png")

    useEffect(async () => {

        console.log(props.route.params.id)
        // let d = "PM0" + `${parseInt(props.prescription.slice(3)) - 1}`
        // console.log(d)
        let d = props.route.params.id
        const value = await AsyncStorage.getItem("google")

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
                setProfile(_array[0])
                fetch(`https://www.googleapis.com/drive/v3/files/${_array[0].Logo1}?fields=thumbnailLink`, {
                    headers: {
                        Authorization: "Bearer " + value,
                        "Content-Type": 'image/jpeg'
                    }
                }).then((response) => response.json())
                    .then((resJson) => {
                        console.log(resJson)
                        if (resJson.error) {
                            console.log(resJson)
                        }
                        else {
                            setLogo1(resJson.thumbnailLink)
                        }
                    })
                    .catch((error) => console.log(error));
                fetch(`https://www.googleapis.com/drive/v3/files/${_array[0].Logo2}?fields=thumbnailLink`, {
                    headers: {
                        Authorization: "Bearer " + value,
                        "Content-Type": 'image/jpeg'
                    }
                }).then((response) => response.json())
                    .then((resJson) => {
                        console.log(resJson)
                        if (resJson.error) {
                            console.log(resJson)
                        }
                        else {
                            setLogo2(resJson.thumbnailLink)
                        }
                    })
                    .catch((error) => console.log(error));
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT A.Aushadham,D.Dose,S.Samayam,AN.Anupanam FROM Receipt R JOIN Aushadham A on R.Aushadham=A.Id JOIN Dose D on R.Dose=D.Id JOIN Samayam S on R.Samayam=S.Id JOIN Anupanam AN on R.Anupanam=AN.Id WHERE R.Prescription="${d}"`, [], (_, { rows: { _array } }) => {
                setReceipt(_array)
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT V.Name FROM PresVishesha PV JOIN Vishesha V on PV.Vishesha=V.Id WHERE PV.Prescription="${d}"`, [], (_, { rows: { _array } }) => {
                setVishesha(_array)
                // console.log(_array)
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT R.Name FROM PresRoga PR JOIN Roga R on PR.Roga=R.Id WHERE PR.Prescription="${d}"`, [], (_, { rows: { _array } }) => {
                setRoga(_array)
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Pathology WHERE Prescription="${d}"`, [], (_, { rows: { _array } }) => {
                if (_array.length > 0) {
                    setSamprapti(_array)
                }
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT L.Name FROM PresLaxanam PL JOIN Laxanam L on PL.Laxanam=L.Id WHERE PL.Prescription="${d}" `, [], (_, { rows: { _array } }) => {
                // console.log(_array)
                setLaxanam(_array)
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Prescription PR JOIN Patient P on PR.PatientId=P.Id  WHERE PrescriptionId="${d}"`, [], (_, { rows: { _array } }) => {
                // console.log(_array)
                setPrescription(_array)
                if (_array[0].VisitedDate.slice(4, 7) == "Jan") {
                    setVisited("1")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Feb") {
                    setVisited("2")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Mar") {
                    setVisited("3")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Apr") {
                    setVisited("4")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "May") {
                    setVisited("5")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Jun") {
                    setVisited("6")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Jul") {
                    setVisited("7")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Aug") {
                    setVisited("8")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Sep") {
                    setVisited("9")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Oct") {
                    setVisited("10")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Nov") {
                    setVisited("11")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Dec") {
                    setVisited("12")
                }
                if (_array[0].FollowUpDate.slice(4, 7) == "Jan") {
                    setFollowUp("1")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Feb") {
                    setFollowUp("2")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Mar") {
                    setFollowUp("3")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Apr") {
                    setFollowUp("4")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "May") {
                    setFollowUp("5")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Jun") {
                    setFollowUp("6")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Jul") {
                    setFollowUp("7")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Aug") {
                    setFollowUp("8")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Sep") {
                    setFollowUp("9")
                }
                else if (_array[0].VisitedDate.slice(4, 7) == "Oct") {
                    setFollowUp("10")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Nov") {
                    setFollowUp("11")
                }
                else if (_array[0].FollowUpDate.slice(4, 7) == "Dec") {
                    setFollowUp("12")
                }
            })
        })



    }, [props.route.params.id])

    const htmlContent = `
    <html>

<head>
    <style>
        .row {
            display: flex;
            flex-direction: row;
        }

        .col {
            flex: 1;
        }

        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            flex: 1;
        }

        tr {
            display: flex;
        }

        .Receipt tr {
            border: 1px solid;
        }

        .Receipt th {
            color:blue;
        }

        .Receipt td {
            padding-top: 10px;
            border: 1px solid;
        }

        h5 {
            padding-top: 5px;
        }

        h4 {
            padding-top: 2px;
        }

        h2,
        h3,
        h4,
        h5,
        h6 {
            margin: 2px;
            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
            font-weight: 200;
        }

        .footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            margin-top: 50px;
        }

        .page {
            height: 100%;
            position: relative;
            background-color: 'red';

        }

        .dataTable {
            margin-left: 10%;
            margin-right: 10%;
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

    </style>

</head>

<body>
    <div class="page">
        <div class="row">
            <img src="${logo1}" height="75" width="150" />
            <div style="text-align: center;width: 100%;">
                <h2 style="color : rgb(0, 255, 55);margin: 0;">${profile.Hospital}</h2>
                <h3 style="color : rgb(121, 96, 233);margin: 0;">${profile.Description}</h3>
            </div>
            <img src="${logo2}" height="75" width="150"/>
        </div>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
        <div style="text-align: center;">
            <h3 style="color : red;">${profile.Address}</h3>
            <h3>Ph. ${profile.Phone}, Mob. ${profile.LandLine}, E-mail : ${profile.Email}</h3>
            <hr style="height:2px;border-width:0;color:gray;background-color:red">
        </div>
        <table>
            <tr>
                <td style="flex : 2">
                    <h4 style="float: left;font-weight: bolder;;color:blue">Consultant :</h4>
                </td>
                <td style="flex : 10">
                    <h4 style="float: left">${prescription[0].Doctor}</h4>
                </td>
                <td style="flex : 4">
                    <h4 style="float: left;font-weight: bolder;color:blue">Branch :</h4>
                    <h4 style="float: left">${prescription[0].Branch}</h4>
                </td>
            </tr>
        </table>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
        <table>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Patient Id :</h4>
                    <h5 style="float: left">${prescription[0].Id}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Prescription Id :</h4>
                    <h5 style="float: left">${prescription[0].PrescriptionId}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Name :</h4>
                    <h5 style="float: left">${prescription[0].Name}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Age :</h4>
                    <h5 style="float: left">${prescription[0].Age}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Address :</h4>
                    <h5 style="float: left">${prescription[0].Address}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Contact :</h4>
                    <h5 style="float: left">${prescription[0].Contact}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Date :</h4>
                    <h5 style="float: left">${prescription[0].VisitedDate.slice(8, 10) + "/" + visited + "/" + prescription[0].VisitedDate.slice(11, 15)}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Gender :</h4>
                    <h5 style="float: left">${prescription[0].Gender}</h5>
                </td>
            </tr>
        </table>
        <hr>
        <table>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Bp :</h4>
                    <h5 style="float: left">${prescription[0].Bp} mm of Hg</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">RBS :</h4>
                    <h5 style="float: left">${prescription[0].Rbs} mg/DL</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Weight :</h4>
                    <h5 style="float: left">${prescription[0].Weight} Kg</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Height :</h4>
                    <h5 style="float: left">${prescription[0].Height} Ft</h5>
                </td>
            </tr>
        </table>
    <hr>
        <div class="row">
            <div class="col">
                <div style="margin-top: 2%;">
                    <h3 style="text-align: center;color:blue">Main Complaint</h3>
                    <hr style="margin-left: 10%;margin-right: 10%;">
                    <table class="dataTable">
                    ${roga.map((item, index) => {
        if (index % 2 == 0 && index !== roga.length - 1) {
            return "<tr><td>‣ " + item.Name + "</td>"
        }
        else if (index % 2 != 0 && index !== roga.length - 1) {
            return "<td>‣ " + item.Name + "</td></tr>"
        }
        else {
            return "<tr><td>‣ " + item.Name + "</td><td></td></tr>"
        }
    })}
                    </table>
                </div>
                <div style="margin-top: 2%;">
                    <h3 style="text-align: center;color:blue">Signs & Symptoms</h3>
                    <hr style="margin-left: 10%;margin-right: 10%;">
                    <table class="dataTable">
                    ${laxanam.map((item, index) => {
        if (index % 2 == 0 && index !== roga.length - 1) {
            return "<tr><td>‣ " + item.Name + "</td>"
        }
        else if (index % 2 != 0 && index !== roga.length - 1) {
            return "<td>‣ " + item.Name + "</td></tr>"
        }
        else {
            return "<tr><td>‣ " + item.Name + "</td><td></td></tr>"
        }
    })}
                    </table>
                </div>
                <div style="margin-top: 2%;">
                    <h3 style="text-align: center;color:blue">Pathology</h3>
                    <hr style="margin-left: 10%;margin-right: 10%;">
                    <p style="margin-left: 10%;">
                    Impressions : ${samprapti[0].Impressions}
                    </p>
                    <p style="margin-left: 10%;">
                    Diagnosis : ${samprapti[0].Diagnosis}
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="page">
    <div class="row">
            <img src="${logo1}" height="75" width="150" />
            <div style="text-align: center;width: 100%;">
                <h2 style="color : rgb(0, 255, 55);margin: 0;">${profile.Hospital}</h2>
                <h3 style="color : rgb(121, 96, 233);margin: 0;">${profile.Description}</h3>
            </div>
            <img src="${logo2}" height="75" width="150"/>
        </div>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
    <div style="text-align: center;">
        <h3 style="color : red;">${profile.Address}</h3>
        <h3>Ph. ${profile.Phone}, Mob. ${profile.LandLine}, E-mail : ${profile.Email}</h3>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
    </div>
        <table>
            <tr>
                <td style="flex : 2">
                    <h4 style="float: left;font-weight: bolder;;color:blue">Consultant :</h4>
                </td>
                <td style="flex : 10">
                    <h4 style="float: left">${prescription[0].Doctor}</h4>
                </td>
                <td style="flex : 4">
                    <h4 style="float: left;font-weight: bolder;color:blue">Branch :</h4>
                    <h4 style="float: left">${prescription[0].Branch}</h4>
                </td>
            </tr>
        </table>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
        <table>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Name :</h4>
                    <h5 style="float: left">${prescription[0].Name}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Age :</h4>
                    <h5 style="float: left">${prescription[0].Age}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Address :</h4>
                    <h5 style="float: left">${prescription[0].Address}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Contact :</h4>
                    <h5 style="float: left">${prescription[0].Contact}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Date :</h4>
                    <h5 style="float: left">${prescription[0].VisitedDate.slice(8, 10) + "/" + visited + "/" + prescription[0].VisitedDate.slice(11, 15)}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Gender :</h4>
                    <h5 style="float: left">${prescription[0].Gender}</h5>
                </td>
            </tr>
        </table>
        <hr>
        <div class="col" style="margin-top: 2%;">
            <h3 style="text-align: center;color:blue">Treatment</h3>
            <hr>
            <table class="Receipt" >
                <tr>
                    <th>
                        S.No
                    </th>
                    <th>
                        Medicine
                    </th>
                    <th>
                        Dose
                    </th>
                    <th>
                        Time
                    </th>
                    <th>
                        Vehicle
                    </th>
                </tr>
                ${receipt.map((item, index) => (
        `<tr>
                                <td>
                                    ${index + 1}
                                </td>
                                <td>
                                    ${item.Aushadham}
                                </td>
                                <td>
                                ${item.Dose}
                                </td>
                                <td>
                                ${item.Samayam}
                                </td>
                                <td>
                                ${item.Anupanam}
                                </td>
                            </tr>`
    ))}
            </table>
        </div>
        <div style="margin-top: 2%;">
                    <h3 style="text-align: center;color:blue;">Special Instructions</h3>
                    <hr style="margin-left: 10%;margin-right: 10%;">
                    <table class="dataTable">
                    ${vishesha.map((item, index) => {
        if (index % 2 == 0 && index !== roga.length - 1) {
            return "<tr><td>‣ " + item.Name + "</td>"
        }
        else if (index % 2 != 0 && index !== roga.length - 1) {
            return "<td>‣ " + item.Name + "</td></tr>"
        }
        else {
            return "<tr><td>‣ " + item.Name + "</td><td></td></tr>"
        }
    })}
                    </table>
        </div>
        <div class="footer">
            <table>
                <tr>
                    <td>
                        <h4 style="float: left">FollowUp Date :</h4>
                        <h5 style="float: left">${prescription[0].FollowUpDate.slice(8, 10) + "/" + followUp + "/" + prescription[0].FollowUpDate.slice(11, 15)}</h5>
                    </td>
                    <td>
                        <h4 style="float: left">Amount :</h4>
                        <h5 style="float: left">${prescription[0].Amount}</h5>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>

</html>`

    const createPDF = async () => {

        // console.log(JSON.parse(samprapti[0].Pathology))

        Print.printAsync(
            {
                html: htmlContent
            },
        ).then(() => props.navigation.navigate('PatientForm'))

    };

    const sharePDF = async () => {

        Print.printToFileAsync({
            html: htmlContent,
        }).then(res => {
            // console.log(res.uri)
            openShareDialogAsync(res.uri)
            props.navigation.navigate('PatientForm')
        })

    };

    async function openShareDialogAsync(link) {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }
        Sharing.shareAsync(link);
    };

    return (
        <View style={{ flex: 1 }}>
            <Modal visible={true} onRequestClose={() => props.navigation.navigate('PatientForm')}>
                {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#B7B6B5" }}>
                    <View style={{ height: '20%', width: '80%', backgroundColor: "white", borderRadius: 10 }}>
                        <View style={{ flex: 1, margin: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Success</Text>
                            <Text style={{ fontSize: 18, marginTop: 10 }}>Prescription Saved</Text>
                        </View>
                        <View style={{ flexDirection: "row", margin: 10 }}>
                            <TouchableOpacity style={{ flex: 1, margin: 10, backgroundColor: "#E1DEDC", justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => props.navigation.navigate('PatientForm')}><Text style={{ fontSize: 24, color: "#52829D" }}>OK</Text></TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, margin: 10, backgroundColor: "#E1DEDC", justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => createPDF()}><Text style={{ fontSize: 24, color: "#52829D" }}>PRINT</Text></TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, margin: 10, backgroundColor: "#E1DEDC", justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => sharePDF()}><Text style={{ fontSize: 24, color: "#52829D" }}>SHARE</Text></TouchableOpacity>
                        </View>
                    </View>
                </View> */}
                <ScrollView>
                    <View style={{ flexDirection: 'row', alignItems: "flex-end", justifyContent: "flex-end" }}>
                        <AntDesign style={{ margin: 5 }} name="checkcircle" size={40} color="black" onPress={() => props.navigation.navigate('PatientForm')} />
                        <AntDesign style={{ margin: 5 }} name="printer" size={40} color="black" onPress={() => createPDF()} />
                        <AntDesign style={{ margin: 5 }} name="sharealt" size={40} color="black" onPress={() => sharePDF()} />
                    </View>
                    <View style={{ flex: 1, margin: 5 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={{ width: 50, height: 50, resizeMode: "cover" }}
                                source={{
                                    uri: logo1,
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: "center", fontSize: 24, color: "red", fontWeight: "bold" }}>{profile.Hospital}</Text>
                                <Text style={{ textAlign: "center", fontSize: 15, color: "blue", fontWeight: "bold" }}>{profile.Description}</Text>
                            </View>
                            <Image
                                style={{ width: 50, height: 50, resizeMode: "cover" }}
                                source={{
                                    uri: logo2,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'red',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={styles.header}>
                            <Text style={{ color: "red", fontWeight: "bold" }}>{profile.Address}</Text>
                            <Text style={{ color: "black", fontWeight: "bold" }}>Ph. {profile.Phone}, Mob. {profile.LandLine}, E-mail : {profile.Email}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'red',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                            <Text style={{ flex: 1 }}><Text style={{ color: "blue", fontWeight: "bold" }}>Consultant : </Text> {prescription[0].Doctor}</Text>
                            <Text style={{ flex: 1 }}><Text style={{ color: "blue", fontWeight: "bold" }}>Branch : </Text> {prescription[0].Branch}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'red',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Patient Id : </Text> {prescription[0].Id}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Name : </Text> {prescription[0].Name}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Address : </Text> {prescription[0].Address}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Visited : </Text> {prescription[0].VisitedDate.slice(8, 10) + "/" + visited + "/" + prescription[0].VisitedDate.slice(11, 15)}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Prescription Id : </Text> {prescription[0].PrescriptionId}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Age : </Text>{prescription[0].Age}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Contact : </Text> {prescription[0].Contact}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Gender : </Text> {prescription[0].Gender}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Bp : </Text> {prescription[0].Bp}mm of Hg</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Weight : </Text> {prescription[0].Weight} Kg</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Rbs : </Text> {prescription[0].Rbs} mg/DL</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Height : </Text> {prescription[0].Height} ft</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Main Complaint</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                    marginLeft: 30,
                                    marginRight: 30
                                }}
                            />
                            <View style={{ marginLeft: 60 }}>
                                {roga.map((item, index) => (
                                    <Text key={index}>{item.Name}</Text>
                                ))}
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Signs and Symptoms</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                    marginLeft: 30,
                                    marginRight: 30
                                }}
                            />
                            <View style={{ marginLeft: 60 }}>
                                {laxanam.map((item, index) => (
                                    <Text key={index}>{item.Name}</Text>
                                ))}
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Pathology</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                    marginLeft: 30,
                                    marginRight: 30
                                }}
                            />
                            <Text style={{ marginLeft: 60 }}>Impressions : {samprapti[0].Impressions}</Text>
                            <Text style={{ marginLeft: 60 }}>Diagnosis : {samprapti[0].Diagnosis}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 10,
                            marginTop: 20
                        }}
                    />
                    <View style={{ flex: 1, margin: 5 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={{ width: 50, height: 50, resizeMode: "cover" }}
                                source={{
                                    uri: logo1,
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: "center", fontSize: 24, color: "red", fontWeight: "bold" }}>{profile.Hospital}</Text>
                                <Text style={{ textAlign: "center", fontSize: 15, color: "blue", fontWeight: "bold" }}>{profile.Description}</Text>
                            </View>
                            <Image
                                style={{ width: 50, height: 50, resizeMode: "cover" }}
                                source={{
                                    uri: logo2,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'red',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={styles.header}>
                            <Text style={{ color: "red", fontWeight: "bold" }}>{profile.Address}</Text>
                            <Text style={{ color: "black", fontWeight: "bold" }}>Ph. {profile.Phone}, Mob. {profile.LandLine}, E-mail : {profile.Email}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'red',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                            <Text style={{ flex: 1 }}><Text style={{ color: "blue", fontWeight: "bold" }}>Consultant : </Text> {prescription[0].Doctor}</Text>
                            <Text style={{ flex: 1 }}><Text style={{ color: "blue", fontWeight: "bold" }}>Branch : </Text> {prescription[0].Branch}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'red',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Patient Id : </Text> {prescription[0].Id}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Name : </Text> {prescription[0].Name}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Address : </Text> {prescription[0].Address}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Visited : </Text> {prescription[0].VisitedDate.slice(8, 10) + "/" + visited + "/" + prescription[0].VisitedDate.slice(11, 15)}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Prescription Id : </Text> {prescription[0].PrescriptionId}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Age : </Text>{prescription[0].Age}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Contact : </Text> {prescription[0].Contact}</Text>
                                <Text><Text style={{ color: "blue", fontWeight: "bold" }}>Gender : </Text> {prescription[0].Gender}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                            }}
                        />
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Treatment</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                    marginLeft: 30,
                                    marginRight: 30
                                }}
                            />
                            <View style={{ flexDirection: "row", marginTop: 20 }}>
                                <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center", borderWidth: 1 }}>Sl.NO</Text>
                                <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center", borderWidth: 1 }}>Medicine</Text>
                                <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center", borderWidth: 1 }}>Dose</Text>
                                <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center", borderWidth: 1 }}>Time</Text>
                                <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center", borderWidth: 1 }}>Vehicle</Text>
                            </View>
                            {receipt.map((item, index) => (
                                <View key={index} style={{ flexDirection: "row" }}>
                                    <Text style={{ flex: 1, textAlign: "center", borderWidth: 1 }}>{index + 1}</Text>
                                    <Text style={{ flex: 1, textAlign: "center", borderWidth: 1 }}>{item.Aushadham}</Text>
                                    <Text style={{ flex: 1, textAlign: "center", borderWidth: 1 }}>{item.Dose}</Text>
                                    <Text style={{ flex: 1, textAlign: "center", borderWidth: 1 }}>{item.Samayam}</Text>
                                    <Text style={{ flex: 1, textAlign: "center", borderWidth: 1 }}>{item.Anupanam}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Special Instructions</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                    marginLeft: 30,
                                    marginRight: 30
                                }}
                            />
                            <View style={{ marginLeft: 60 }}>
                                {vishesha.map((item, index) => (
                                    <Text key={index}>{item.Name}</Text>
                                ))}
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                            <Text style={{ flex: 1 }}>FollowUpDate : {prescription[0].FollowUpDate.slice(8, 10) + "/" + followUp + "/" + prescription[0].FollowUpDate.slice(11, 15)}</Text>
                            <Text style={{ flex: 1 }}>Amount : {prescription[0].Amount}</Text>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 5
    }
})