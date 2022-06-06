import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native'
import { Formik } from 'formik'
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup';
import * as Sqlite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker';

const db = Sqlite.openDatabase("ProjectAyur.db");


const RegisterSchema = yup.object({
    Name: yup.string().required().min(4),
    Email: yup.string()
        .required()
        .email(),
    Phone: yup.string()
        .required()
        .max(15)
        .min(9),
    LandLine: yup.string()
        .max(15)
        .min(10),
    Address: yup.string().required().min(5),
    Hospital: yup.string().required(),
    Code: yup.string().required().min(2).max(2)
})

export default function Login(props) {

    // const [login, setLogin] = useState(true)
    // const [logged, setLogged] = useState(true)
    // const [showPassword, setShowPassword] = useState(true)
    // const [users, setUsers] = useState([])
    const [theme, setTheme] = useState({ backGround: "#fff", card: "#fff" })
    const [logo1, setLogo1] = useState("")
    const [logo2, setLogo2] = useState("")
    const [logo1Active, setLogo1Active] = useState(false)
    const [logo2Active, setLogo2Active] = useState(false)

    const sendData = () => {
        props.callback(true);
    }

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS Branches(
              Branch TEXT,
              Code TEXT
            );`, [])
        })
        getTheme()
    }, [])

    const getTheme = async () => {
        try {
            let theme = JSON.parse(await AsyncStorage.getItem('theme'))
            if (theme != null) {
                setTheme(theme)
            }
            // console.log(theme)
        } catch (e) {
            // console.log(e)
        }
    }

    const storeData = async (branch, code) => {
        try {
            let tempBranch = JSON.stringify({ Branch: branch, Code: code })
            await AsyncStorage.setItem('Branch', tempBranch)
        }
        catch (e) {

        }
    }

    const uploadLogo1 = async () => {
        setLogo1Active(true)
        const value = await AsyncStorage.getItem("google")
        console.log(value)
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        });

        if (result.cancelled) {
            return;
        }
        else {
            console.log(result)
        }

        let localUri = result.uri;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append('photo', { uri: localUri, name: filename });

        console.log(formData)

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
            method: 'POST',
            body: {
                uri: localUri,
            },
            headers: {
                Authorization: "Bearer " + value,
                "Content-Type": 'image/jpeg'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.error) {
                    AsyncStorage.removeItem("google")
                    Alert.alert("Failure", "Something problem with the google.Please exit and Signin again.", [{ text: "OK" }])
                }
                else {
                    setLogo1Active(false)
                    setLogo1(responseJson.id)
                    Alert.alert("Success", "Image has been uploaded", [{ text: "OK" }])
                }
            })
            .catch((error) => console.log(error));
    }

    const uploadLogo2 = async () => {
        setLogo2Active(true)
        const value = await AsyncStorage.getItem("google")
        console.log(value)
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        });

        if (result.cancelled) {
            return;
        }
        else {
            console.log(result)
        }

        let localUri = result.uri;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append('photo', { uri: localUri, name: filename });

        console.log(formData)

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
            method: 'POST',
            body: {
                uri: localUri,
            },
            headers: {
                Authorization: "Bearer " + value,
                "Content-Type": 'image/jpeg'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.error) {
                    AsyncStorage.removeItem("google")
                    Alert.alert("Failure", "Something problem with the google.Please exit and Signin again.", [{ text: "OK" }])
                }
                else {
                    setLogo2Active(false)
                    setLogo2(responseJson.id)
                    Alert.alert("Success", "Image has been uploaded", [{ text: "OK" }])
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.backGround }}>
            <ScrollView contentContainerStyle={styles.main}>
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.header}>
                        <View style={styles.navigateButton}>
                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Registration</Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Formik
                            initialValues={{ Name: '', Email: '', Phone: '', Address: '', Hospital: '', Description: '', LandLine: '', Branch: '', Code: '' }}
                            validationSchema={RegisterSchema}
                            onSubmit={(values, actions) => {
                                // console.log(values)
                                db.transaction((tx) => {

                                    tx.executeSql(`INSERT INTO Branches (
                                        Branch,
                                        Code
                                        )
                                        VALUES (
                                        ?,
                                        ?
                                        );`,
                                        [values.Branch, values.Code],
                                        (data) => {
                                            console.log("Data")
                                            storeData(values.Branch, values.Code)
                                        },
                                        (err) => {
                                            console.log("Error")
                                        })

                                    tx.executeSql(`INSERT INTO User (
                                        Id,
                                        Name,
                                        Email,
                                        Phone,
                                        LandLine,
                                        Address,
                                        Hospital,
                                        Description,
                                        Logo1,
                                        Logo2
                                        )
                                        VALUES (
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?,
                                        ?
                                        );`,
                                        ["US01", values.Name, values.Email, values.Phone, values.LandLine, values.Address, values.Hospital, values.Description, logo1, logo2],
                                        (data) => {
                                            sendData()
                                        },
                                        (err) => {
                                            Alert.alert('Failure', 'User Exists',
                                                [{ text: 'OK' }])
                                        })
                                })
                                actions.resetForm()
                            }
                            }
                        >
                            {(props) => (
                                <>
                                    <View style={styles.input}>
                                        <Ionicons name="person-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Name" multiline={true} style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Name')} value={props.values.Name}></TextInput>
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Name && props.errors.Name}</Text>
                                    <View style={styles.input}>
                                        <Ionicons name="mail-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Email" multiline={true} style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Email')} value={props.values.Email}></TextInput>
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Email && props.errors.Email}</Text>
                                    <View style={styles.input}>
                                        <Ionicons name="phone-portrait-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Phone" multiline={true} style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Phone')} value={props.values.Phone} maxLength={15} keyboardType='phone-pad'></TextInput>
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Phone && props.errors.Phone}</Text>
                                    <View style={styles.input}>
                                        <Ionicons name="call-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Landline" multiline={true} style={{ paddingLeft: 8 }} onChangeText={props.handleChange('LandLine')} value={props.values.LandLine} maxLength={15} keyboardType='phone-pad'></TextInput>
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.LandLine && props.errors.LandLine}</Text>
                                    <View style={styles.input}>
                                        <Ionicons name="md-location-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Address" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Address')} value={props.values.Address} multiline={true}></TextInput>
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Address && props.errors.Address}</Text>
                                    <View style={styles.input}>
                                        <Ionicons name="md-home-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Hospital Name" style={{ paddingLeft: 8 }} multiline={true} onChangeText={props.handleChange('Hospital')} value={props.values.Hospital}></TextInput>
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Hospital && props.errors.Hospital}</Text>
                                    <View style={styles.input}>
                                        <Ionicons name="pencil-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                        <TextInput placeholder="Enter Description" style={{ paddingLeft: 8 }} multiline={true} onChangeText={props.handleChange('Description')} value={props.values.Description}></TextInput>
                                    </View>
                                    <View style={styles.input}>
                                        <FontAwesome5 name="hospital" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></FontAwesome5>
                                        <TextInput placeholder="Enter Branch" style={{ paddingLeft: 8 }} multiline={true} onChangeText={props.handleChange('Branch')} value={props.values.Branch}></TextInput>
                                    </View>
                                    <View style={styles.input}>
                                        <MaterialCommunityIcons name="unicode" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></MaterialCommunityIcons>
                                        <TextInput placeholder="Enter Branch Code" style={{ paddingLeft: 8 }} multiline={true} onChangeText={props.handleChange('Code')} value={props.values.Code}></TextInput>
                                    </View>
                                    <View style={styles.input}>
                                        <MaterialCommunityIcons name="image-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></MaterialCommunityIcons>
                                        <TouchableOpacity onPress={uploadLogo1}><Text>Select an Image</Text></TouchableOpacity>
                                        {logo1Active && <ActivityIndicator size="small" color="black" />}
                                        {logo1.length > 1 && <Ionicons name="checkmark-circle" color="green" size={24} />}
                                    </View>
                                    <View style={styles.input}>
                                        <MaterialCommunityIcons name="image-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></MaterialCommunityIcons>
                                        <TouchableOpacity onPress={uploadLogo2}><Text>Select an Image</Text></TouchableOpacity>
                                        {logo2Active && <ActivityIndicator size="small" color="black" />}
                                        {logo2.length > 1 && <Ionicons name="checkmark-circle" color="green" size={24} />}
                                    </View>
                                    <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Code && props.errors.Code}</Text>
                                    <View style={styles.button}>
                                        <View style={{ width: "30%" }}>
                                            <Button title="Register" onPress={props.handleSubmit}></Button>
                                        </View>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    card: {
        elevation: 3,
        borderRadius: 10,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginTop: "15%",
        marginLeft: "2%",
        marginRight: "2%",
        marginBottom: "2%"

    },
    header: {
        flexDirection: 'row',
        // elevation: 3,
        // shadowOpacity: 0.3,
        // borderWidth : 1,
        margin: "4%",
        height: 50,
    },
    navigateButton: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowOpacity: 0.3,
        borderWidth: 0.1,
        width: "100%",
        height: '150%',
        backgroundColor: "green"
    },
    body: {
        flex: 1,
        margin: "5%",
        // marginRight: "5%",
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: "2%",
        elevation: 3,
        shadowOpacity: 0.5,
        backgroundColor: 'white',
        height: 60,
        borderRadius: 5
    },
    button: {
        paddingTop: "5%",
        alignItems: 'center',
    },
    modal: {
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#00000099"
    },
    content: {
        margin: 10,
        backgroundColor: "white",
        padding: 20
    }
})