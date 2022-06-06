import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Modal, TextInput,TouchableOpacity,ActivityIndicator,Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Sqlite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import { Formik } from 'formik'
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker';

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
        .required()
        .max(15)
        .min(10),
    Address: yup.string().required().min(3),
    Hospital: yup.string().required(),
})


const db = Sqlite.openDatabase('ProjectAyur.db')

export default function Configuration() {

    const { colors } = useTheme()

    const [profile, setProfile] = useState([])
    const [formShow, setFormShow] = useState(false)
    const [change, setChange] = useState(false)
    const [logo1, setLogo1] = useState("")
    const [logo2, setLogo2] = useState("")
    const [logo1Active, setLogo1Active] = useState(false)
    const [logo2Active, setLogo2Active] = useState(false)
    


    // Expo.FileSystem.getInfoAsync('SQLite/ProjectAyur.db')

    // const backup = async () => {
    //     FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/ProjectAyur.db`).then(res => {
    //         console.log(res)
    //     })
    // }

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
                // console.log(_array[0])
                setProfile(_array[0])
            })
        })
    }, [change])

    const uploadLogo1 = async () => {
        setLogo1Active(true)
        const value = await AsyncStorage.getItem("google")
        console.log(value)
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality : 1
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
            quality : 1
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
        <ScrollView style={{ backgroundColor: colors.back, flex: 1 }}>
            <View style={[styles.card, { backgroundColor: colors.crd, borderTopWidth: 2, borderColor: "#DDDCCE", borderRadius: 10 }]}>
                <View style={[styles.field, { justifyContent: "flex-end" }]}>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Ionicons name="pencil-outline" size={colors.font + 5} color={colors.icon} onPress={() => { setFormShow(true) }} />
                    </View>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Name</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.Name}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Email</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.Email}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Phone</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.Phone}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>LandLine</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.LandLine}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Hospital</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.Hospital}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Address</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.Address}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Description</Text>
                    <Text>: </Text>
                    <Text style={{ flex: 2, fontSize: colors.font, color: colors.txt }}>{profile.Description}</Text>
                </View>
            </View>
            <Modal animationType="slide" visible={formShow} onRequestClose={() => setFormShow(false)}>
                <View style={{ flex: 1, backgroundColor: colors.back }}>
                    <View style={{ alignItems: "flex-end", margin: 10 }}>
                        <Ionicons name="close-circle" size={colors.font + 5} color={colors.icon} onPress={() => setFormShow(false)} />
                    </View>
                    <Formik
                        initialValues={{ Name: profile.Name, Email: profile.Email, Phone: profile.Phone, Address: profile.Address, Hospital: profile.Hospital, Description: profile.Description, LandLine: profile.LandLine }}
                        validationSchema={RegisterSchema}
                        onSubmit={(values, actions) => {

                            db.transaction((tx) => {
                                tx.executeSql(`UPDATE User SET Name=?,Email=?,Phone=?,LandLine=?,Address=?,Hospital=?,Description=?,Logo1=?,Logo2=? WHERE Name=?;`,
                                    [values.Name, values.Email, values.Phone, values.LandLine, values.Address, values.Hospital, values.Description,logo1,logo2, profile.Name],
                                    (data) => {
                                        // console.log("Updated")
                                    },
                                    (err) => {
                                        Alert.alert('Failure', 'User Exists',
                                            [{ text: 'OK' }])
                                    })
                            })
                            setChange(!change)
                            actions.resetForm()
                            setFormShow(false)
                        }
                        }
                    >
                        {(props) => (
                            <ScrollView>
                                <View style={styles.input}>
                                    <Ionicons name="person-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Name" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Name')} value={props.values.Name} multiline={true}></TextInput>
                                </View>
                                <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Name && props.errors.Name}</Text>
                                <View style={styles.input}>
                                    <Ionicons name="mail-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Email" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Email')} value={props.values.Email} multiline={true}></TextInput>
                                </View>
                                <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Email && props.errors.Email}</Text>
                                <View style={styles.input}>
                                    <Ionicons name="phone-portrait-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Phone" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Phone')} value={props.values.Phone} maxLength={15} multiline={true} keyboardType='phone-pad'></TextInput>
                                </View>
                                <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Phone && props.errors.Phone}</Text>
                                <View style={styles.input}>
                                    <Ionicons name="call-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Landline" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('LandLine')} value={props.values.LandLine} maxLength={15} multiline={true} keyboardType='phone-pad'></TextInput>
                                </View>
                                <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.LandLine && props.errors.LandLine}</Text>
                                <View style={styles.input}>
                                    <Ionicons name="md-location-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Address" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Address')} value={props.values.Address} multiline={true}></TextInput>
                                </View>
                                <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Address && props.errors.Address}</Text>
                                <View style={styles.input}>
                                    <Ionicons name="md-home-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Hospital Name" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Hospital')} value={props.values.Hospital} multiline={true}></TextInput>
                                </View>
                                <Text style={{ color: "#FC040F", paddingLeft: 20 }}>{props.touched.Hospital && props.errors.Hospital}</Text>
                                <View style={styles.input}>
                                    <Ionicons name="pencil-outline" size={24} color="#3E5EC3" style={{ paddingLeft: 8 }}></Ionicons>
                                    <TextInput placeholder="Enter Description" style={{ paddingLeft: 8 }} onChangeText={props.handleChange('Description')} value={props.values.Description} multiline={true}></TextInput>
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
                                <View style={styles.button}>
                                    <View style={{ width: "30%" }}>
                                        <Button title="save" onPress={props.handleSubmit}></Button>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        elevation: 3,
        // borderRadius: 10,
        // margin: 5,
        alignItems: "center",
        margin: 5
    },
    field: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center"
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
})