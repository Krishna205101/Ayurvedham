import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Dimensions, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';


const db = Sqlite.openDatabase('ProjectAyur.db')

const width = Dimensions.get("window").width > 425

export default function Details(props) {

    const { colors } = useTheme()
    const [patientData, setPatientData] = useState([{ Id: "TM01", Name: "", Age: "", Gender: "", Contact: "", Address: "", VisitedDate: "00/00/0000", FollowUpDate: "00/00/0000", Doctor: "", Branch: "" }])
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
    const [pres, setPres] = useState("")
    const [change, setChange] = useState(false)
    const [imageSrc, setImageSrc] = useState("https://rimage.gnst.jp/livejapan.com/public/img/common/noimage.jpg?20210606050143&q=80")
    const [logo1, setLogo1] = useState(null)
    const [logo2, setLogo2] = useState(null)
    const [imageModal, setImageModal] = useState(false)

    useEffect(async () => {
        const value = await AsyncStorage.getItem("google")
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Patient WHERE Patient.Id="${props.route.params.Id}"`, [], (_, { rows: { _array } }) => {
                setPatientData(_array)
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


        db.transaction((tx) => {
            tx.executeSql(`SELECT Pr.PrescriptionId FROM Patient P JOIN Prescription Pr ON Pr.PatientId=P.Id WHERE P.Id="${props.route.params.Id}"`, [], (_, { rows: { _array } }) => {
                setPrescriptionIds(_array)
            })
        })

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
                console.log(_array[0])
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

    }, [change])

    const images = [{
        // Simplest usage.
        url: imageSrc,

        // width: number
        // height: number
        // Optional, if you know the image size, you can set the optimization performance

        // You can pass props to <Image />.
        props: {
            // headers: ...
        }
    }]

    const showPrescription = async (val) => {
        console.log(val)
        const value = await AsyncStorage.getItem("google")
        console.log(value)
        if (val) {
            setShow(true)
            setPres(val)
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
                tx.executeSql(`SELECT * FROM PresRoga PR JOIN Roga R on PR.Roga=R.Id WHERE PR.Prescription="${val}"`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    setRoga(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Pathology WHERE Prescription="${val}"`, [], (_, { rows: { _array } }) => {
                    // console.log(JSON.parse(_array[0].Pathology))
                    if (_array.length > 0) {
                        setSamprapti(_array)
                        fetch(`https://www.googleapis.com/drive/v3/files/${_array[0].Photo}?fields=thumbnailLink`, {
                            headers: {
                                Authorization: "Bearer " + value,
                                "Content-Type": 'image/jpeg'
                            }
                        })
                            .then((response) => response.json()).then((resJson) => {
                                if (resJson.error) {
                                    console.log(resJson)
                                    setImageSrc("https://rimage.gnst.jp/livejapan.com/public/img/common/noimage.jpg?20210606050143&q=80")
                                }
                                else {
                                    setImageSrc(resJson.thumbnailLink)
                                }
                            })
                            .catch((error) => console.log(error));
                    }
                    console.log(_array)
                })
            })

            db.transaction((tx) => {
                tx.executeSql(`SELECT L.Name FROM PresLaxanam PL JOIN Laxanam L on PL.Laxanam=L.Id WHERE PL.Prescription="${val}" `, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    setLaxanam(_array)
                })
            })

        }
        else {
            setShow(false)
            setPrescription([{ PrescriptionId: "", Bp: "", Rbs: "", Height: "", Weight: "" }])
        }
        // console.log(val)


    }

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

        .row1 {
            display: flex;
            flex-direction: row;
        }

        .col1 {
            flex: 1;
        }

        .col2 {
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
    <div></div>
    <div class="page">
        <div class="row">
            <img src="${logo1}" height="75" width="150" />
            <div style="text-align: center;width: 100%;">
                <h1 style="color : rgb(0, 255, 55);margin: 0;">${profile.Hospital}</h1>
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
                    <h4 style="float: left">${patientData[0].Doctor}</h4>
                </td>
                <td style="flex : 4">
                    <h4 style="float: left;font-weight: bolder;color:blue">Branch :</h4>
                    <h4 style="float: left">${patientData[0].Branch}</h4>
                </td>
            </tr>
        </table>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
        <table>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Patient Id :</h4>
                    <h5 style="float: left">${patientData[0].Id}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Prescription Id :</h4>
                    <h5 style="float: left">${prescription[0].PrescriptionId}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Name :</h4>
                    <h5 style="float: left">${patientData[0].Name}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Age :</h4>
                    <h5 style="float: left">${patientData[0].Age}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Address :</h4>
                    <h5 style="float: left">${patientData[0].Address}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Contact :</h4>
                    <h5 style="float: left">${patientData[0].Contact}</h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h4 style="float: left;color:blue">Date :</h4>
                    <h5 style="float: left">${patientData[0].VisitedDate.slice(8, 10) + "/" + visited + "/" + patientData[0].VisitedDate.slice(11, 15)}</h5>
                </td>
                <td>
                    <h4 style="float: left;color:blue">Gender :</h4>
                    <h5 style="float: left">${patientData[0].Gender}</h5>
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
                    <h5 style="float: left">${prescription[0].Height} ft</h5>
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
                <h1 style="color : rgb(0, 255, 55);margin: 0;">${profile.Hospital}</h1>
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
                    <h4 style="float: left">${patientData[0].Doctor}</h4>
                </td>
                <td style="flex : 4">
                    <h4 style="float: left;font-weight: bolder;color:blue">Branch :</h4>
                    <h4 style="float: left">${patientData[0].Branch}</h4>
                </td>
            </tr>
        </table>
        <hr style="height:2px;border-width:0;color:gray;background-color:red">
        <table>
        <tr>
        <td>
            <h4 style="float: left;color:blue">Name :</h4>
            <h5 style="float: left">${patientData[0].Name}</h5>
        </td>
        <td>
            <h4 style="float: left;color:blue">Age :</h4>
            <h5 style="float: left">${patientData[0].Age}</h5>
        </td>
    </tr>
    <tr>
        <td>
            <h4 style="float: left;color:blue">Address :</h4>
            <h5 style="float: left">${patientData[0].Address}</h5>
        </td>
        <td>
            <h4 style="float: left;color:blue">Contact :</h4>
            <h5 style="float: left">${patientData[0].Contact}</h5>
        </td>
    </tr>
    <tr>
        <td>
            <h4 style="float: left;color:blue">Date :</h4>
            <h5 style="float: left">${patientData[0].VisitedDate.slice(8, 10) + "/" + visited + "/" + patientData[0].VisitedDate.slice(11, 15)}</h5>
        </td>
        <td>
            <h4 style="float: left;color:blue">Gender :</h4>
            <h5 style="float: left">${patientData[0].Gender}</h5>
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
                    <h3 style="text-align: center;color:blue">Special Instructions</h3>
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
                        <h4 style="float: left;color:blue">FollowUp Date :</h4>
                        <h5 style="float: left">${patientData[0].FollowUpDate.slice(8, 10) + "/" + followUp + "/" + patientData[0].FollowUpDate.slice(11, 15)}</h5>
                    </td>
                    <td>
                        <h4 style="float: left;color:blue">Amount :</h4>
                        <h5 style="float: left">${prescription[0].Amount}</h5>
                    </td>
                    <td>
                        <h4 style="float: left;color:blue">No.of Visits :</h4>
                        <h5 style="float: left">${prescriptionIds.length}</h5>
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
        ).then(res => console.log(res))

    };

    const sharePDF = async () => {

        Print.printToFileAsync({
            html: htmlContent,
        }).then(res => {
            // console.log(res.uri)
            openShareDialogAsync(res.uri)
        })

    };

    async function openShareDialogAsync(link) {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }
        Sharing.shareAsync(link);
    };

    const deletePrescription = () => {
        // console.log(pres)
        db.transaction((tx) => {
            tx.executeSql(`DELETE FROM PresRoga WHERE Prescription=?`, [pres]);
            tx.executeSql(`DELETE FROM PresLaxanam WHERE Prescription=?`, [pres]);
            tx.executeSql(`DELETE FROM Pathology WHERE Prescription=?`, [pres]);
            tx.executeSql(`DELETE FROM PresVishesha WHERE Prescription=?`, [pres]);
            tx.executeSql(`DELETE FROM Receipt WHERE Prescription=?`, [pres]);
            tx.executeSql(`DELETE FROM Prescription WHERE PrescriptionId=?`, [pres])
        })
        setChange(!change)
    }

    return (
        <ScrollView style={{ backgroundColor: colors.back }}>
            <Text style={styles.header}>Patient Details</Text>
            <View>
                {patientData.map((item) => (
                    <View key={item.Id}>
                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Name</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Name}</Text>
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Age</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Age}</Text>
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Contact</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Contact}</Text>
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Gender</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Gender}</Text>
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Address</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Address}</Text>
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Doctor</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                {item.VisitedDate && <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.Doctor}</Text>}
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>Visited</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                {item.VisitedDate && <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.VisitedDate.slice(4, 15)}</Text>}
                            </View>
                        </View>

                        <View style={styles.element}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.heading, { color: colors.txt, fontSize: colors.font }]}>FollowUp</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                {item.FollowUpDate && <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  {item.FollowUpDate.slice(4, 15)}</Text>}
                                {!item.FollowUpDate && <Text style={[styles.data, { color: colors.txt, fontSize: colors.font }]}>:  N/A</Text>}
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ flexDirection: width ? "row" : "column", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Picker onValueChange={(val) => { showPrescription(val) }} style={[styles.prescription, { color: colors.txt, fontSize: colors.font }]}>
                        <Picker.Item label="Prescription" style={[styles.disabled, { fontSize: colors.font }]}> </Picker.Item>
                        {prescriptionIds.map((item) => (
                            <Picker.Item key={item.PrescriptionId} label={item.PrescriptionId} value={item.PrescriptionId} style={{ fontSize: colors.font }}></Picker.Item>
                        ))}
                    </Picker>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 50 }}>
                    {show &&
                        <View style={{ flexDirection: 'row' }}>
                            <FontAwesome5 name="print" size={colors.font + 8} color={colors.txt} onPress={() => createPDF()} />
                            <FontAwesome5 style={{ paddingLeft: 10 }} name="share-square" size={colors.font + 8} color={colors.txt} onPress={() => sharePDF()} />
                            <FontAwesome5 style={{ paddingLeft: 10 }} name="trash" size={colors.font + 8} color={colors.txt} onPress={() => { deletePrescription(), console.log(pres) }} />
                        </View>}
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

                    <View style={styles.Roga}>
                        <View style={[styles.head]}>
                            <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                            <Text style={[styles.text, { color: colors.txt, fontSize: colors.font + 2 }]}>Pathology</Text>
                        </View>
                        <TouchableOpacity onPress={() => setImageModal(true)}>
                            <Image
                                style={{ width: 200, height: 200, resizeMode: "contain", marginLeft: 20 }}
                                source={{
                                    uri: imageSrc,
                                }}
                            />
                        </TouchableOpacity>
                        {samprapti.map((item, index) => (
                            <View key={index}>
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

                    <View style={[styles.head, { paddingLeft: 10, marginBottom: 5 }]}>
                        <FontAwesome5 name="dot-circle" size={20} color={colors.txt} />
                        <Text style={[styles.text, { color: colors.txt, fontSize: colors.font + 2 }]}>Treatment</Text>
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
            <Modal visible={imageModal} onRequestClose={() => setImageModal(false)}>
                <View style={{alignItems : "flex-end",margin : 10}}>
                    <AntDesign name="closecircle" size={30} onPress={() => setImageModal(false)}/>
                </View>
                <ImageViewer style={{ width: '100%', height: "100%" }} imageUrls={images} />
            </Modal>
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