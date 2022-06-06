import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import * as Sqlite from 'expo-sqlite';
import { useTheme } from '@react-navigation/native';
import * as Print from 'expo-print';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = Sqlite.openDatabase("ProjectAyur.db")

export default function Certificate() {

    const { colors } = useTheme()
    const [text, setText] = useState("")
    const [patient, setPatient] = useState({ Id: '', Name: '', Age: '', Contact: '', Address: '', Gender: 'Male' })
    const [visited, setVisited] = useState(new Date());
    const [dateValue, setDateValue] = useState(visited.getDate() + '/' + (visited.getMonth() + 1) + '/' + visited.getFullYear());
    const [picker, setPicker] = useState(false);
    const [patientData, setPatientData] = useState([]);
    const [logo1, setLogo1] = useState(null)
    const [logo2, setLogo2] = useState(null)
    const [profile, setProfile] = useState([])

    useEffect(async () => {
        const value = await AsyncStorage.getItem("google")
        let code = JSON.parse(await AsyncStorage.getItem("Branch"))

        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Patient WHERE Branch=?`, [code.Branch], (_, { rows: { _array } }) => {
                setPatientData(_array)
                // console.log(_array)
            })
        })

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


    }, [])

    const htmlContent = `
    <html>

<head>
    <style>
        .row {
            display: flex;
            flex-direction: row;
        }

        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            flex: 1;
            text-align: center;
            height: 30px;
        }

        tr {
            display: flex;
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
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        }
    </style>

</head>

<body>
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
            <td>
                <h4 style="float: left">Name :</h4>
                <h5 style="float: left">${patient.Name}</h5>
            </td>
            <td>
                <h4 style="float: left">Age :</h4>
                <h5 style="float: left">${patient.Age}</h5>
            </td>
        </tr>
        <tr>
            <td>
                <h4 style="float: left">Address :</h4>
                <h5 style="float: left">${patient.Address}</h5>
            </td>
            <td>
                <h4 style="float: left">Contact :</h4>
                <h5 style="float: left">${patient.Contact}</h5>
            </td>
        </tr>
        <tr>
            <td>
                <h4 style="float: left">Date :</h4>
                <h5 style="float: left">${dateValue}</h5>
            </td>
            <td>
                <h4 style="float: left">Gender :</h4>
                <h5 style="float: left">${patient.Gender}</h5>
            </td>
        </tr>
    </table>
    <hr>
    <div class="row">
        <pre>${text}</pre>
    </div>
</body>

</html>
`;

    const showCalender = (text) => {
        if (text == "visited")
            setPicker(true)
        else
            setFollowUpPicker(true)
    }

    const change = (selectedDate) => {
        // console.log(selectedDate.type)
        setPicker(false)
        if (selectedDate.type == "set") {
            const currentDate = selectedDate.nativeEvent.timestamp
            setVisited(currentDate)
            setDateValue(currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear())
        }
    }

    const check = (val) => {

        for (let i = 0; i < patientData.length; i++) {
            if (val == patientData[i].Id) {
                // console.log(patientData[i])
                setPatient(patientData[i])
                break
            }
            else {
                setPatient({ Id: val, Name: '', Age: '', Contact: '', Address: '', Gender: 'Male' })
            }
        }
    }

    const createPDF = async () => {

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

    return (
        <ScrollView style={{ backgroundColor: colors.back, flex: 1 }}>
            <View style={[styles.container, { backgroundColor: colors.crd }]}>

                <View style={styles.field}>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1 }}>Patient Id </Text>
                    <View style={{ flex: 2, justifyContent: "center", backgroundColor: "white", flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1 }}>{patient.Id}</Text>
                        <View style={{ flex: 1 }}>
                            <Picker onValueChange={(val) => { check(val) }}>
                                <Picker.Item label="" style={{ fontSize: colors.font }}> </Picker.Item>
                                {patientData.map((item) => (
                                    <Picker.Item key={item.Id} label={item.Name} value={item.Id} style={{ fontSize: colors.font }}></Picker.Item>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
                <View style={styles.field}>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1 }}>Date :</Text>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ color: colors.txt, fontSize: colors.font }}>{dateValue}</Text>
                        <AntDesign name="calendar" size={colors.font + 3} color={colors.txt} onPress={() => showCalender('visited')} style={styles.calender} />
                        {picker && <DatePicker mode="date" value={visited} onChange={(val) => change(val)}></DatePicker>}
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1 }}>Name :</Text>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1, backgroundColor: "white", padding: 10, borderRadius: 10 }}>{patient.Name}</Text>
                </View>
                <View style={styles.rowFields}>
                    <View style={styles.field}>
                        <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1, backgroundColor: "white", padding: 10, borderRadius: 10 }}>{patient.Gender}</Text>
                    </View>

                    <View style={styles.field}>
                        <Text style={{ color: colors.txt, fontSize: colors.font }}>Age :</Text>
                        <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1, backgroundColor: "white", padding: 10, borderRadius: 10 }}>{patient.Age}</Text>
                    </View>
                </View>
                <View style={styles.field}>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1 }}>Address :</Text>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1, backgroundColor: "white", padding: 10, borderRadius: 10 }}>{patient.Address}</Text>
                </View>

                <View style={styles.field}>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1 }}>Contact :</Text>
                    <Text style={{ color: colors.txt, fontSize: colors.font, flex: 1, backgroundColor: "white", padding: 10, borderRadius: 10 }}>{patient.Contact}</Text>
                </View>
                {/* <View style={styles.field}>
                        <Text>Address :</Text>
                        <Text style={{ paddingLeft: 10 }} placeholder="Address"></Text>
                    </View> */}

            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingRight: 40 }}>
                <Ionicons name="print-outline" color={colors.txt} size={35} onPress={() => { createPDF() }} />
                <Ionicons name="share-social" color={colors.txt} size={35} onPress={() => { sharePDF() }} />
            </View>
            <View style={[styles.container, { flex: 3, backgroundColor: 'white' }]}>
                <TextInput multiline={true} placeholder="Type here..." onChangeText={(val) => setText(val)} style={{ margin: "5%", fontSize: colors.font }}></TextInput>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 3,
        borderRadius: 10,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        margin: 30
    },
    rowFields: {
        flex: 1,
        flexDirection: "row"
    },
    field: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        margin: 5
    }
})