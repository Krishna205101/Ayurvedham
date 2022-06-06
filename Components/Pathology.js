import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Button, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native';
import * as Sqlite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = Sqlite.openDatabase("ProjectAyur.db")

export default function Pathology({ save, prescription }) {
    const { colors } = useTheme();
    const [impressions, setImpressions] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [link, setLink] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (save) {
            // console.log(link)
            db.transaction((tx) => {
                tx.executeSql(`INSERT INTO Pathology(Prescription,Photo,Impressions,Diagnosis) VALUES (?,?,?,?)`, [prescription, link, impressions, diagnosis],
                    (data) => { console.log("saved"), setImpressions(""), setDiagnosis(""), setLink("") }, (err) => console.log(err)
                )
            })
        }

    }, [save])

    const takeAndUploadPhotoAsync = async () => {
        setLoading(true)
        const value = await AsyncStorage.getItem("google")
        console.log(value)
        let result = await ImagePicker.launchCameraAsync({
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
                setLink(responseJson.id)
                if (responseJson.error) {
                    AsyncStorage.removeItem("google")
                    Alert.alert("Failure", "Something problem with the google.Please exit and Signin again.", [{ text: "OK" }])
                }
                else {
                    Alert.alert("Success", "Image has been uploaded", [{ text: "OK" }])
                }
            })
            .catch((error) => console.log(error));
    }

    const pickImage = async () => {
        setLoading(true)
        const value = await AsyncStorage.getItem("google")
        console.log(value)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
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
                    title: 'krishna.jpeg',
                    name: 'krish.jpeg'
                },
                headers: {
                    Authorization: "Bearer " + value,
                    "Content-Type": 'image/jpeg'
                },
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.error) {
                        Alert.alert("Failure", "Something problem with the google.Please exit and Signin again.", [{ text: "OK" }])
                    }
                    else {
                        setLink(responseJson.id)
                        Alert.alert("Success", "Image has been uploaded", [{ text: "OK", onPress: () => { setLoading(false) } }])
                    }
                });
        }
    };

    return (
        <View style={{ flex: 1 }}>

            <Text style={{ fontSize: colors.font + 5, fontWeight: "bold", color: colors.txt }}>Pathology</Text>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button} onPress={takeAndUploadPhotoAsync}>
                    <AntDesign style={{ textAlign: "center" }} name="camerao" size={24} color="black" />
                    <Text style={{ textAlign: "center" }}>Capture an Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <AntDesign style={{ textAlign: "center" }} name="picture" size={24} color="black" />
                    <Text style={{ textAlign: "center" }}>Pick an Image</Text>
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                {link.length > 1 ?
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: colors.font, color: "green" }}>Image has been uploaded</Text>
                        <MaterialCommunityIcons name="upload" size={24} color="green" />
                    </View>
                    :
                    <View style={{ flexDirection: "row" }}>
                        {loading && <ActivityIndicator size="small" color={colors.txt} />}
                        <Text style={{ fontSize: colors.font, color: "red" }}>No Image has been uploaded</Text>
                        <MaterialCommunityIcons name="upload-off" size={24} color="red" />
                    </View>
                }
            </View>
            <View style={{ backgroundColor: "white", borderRadius: 10, margin: 10 }}>
                <TextInput placeholder="Impressions" value={impressions} multiline={true} style={{ margin: 10, fontSize: colors.font }} onChangeText={(val) => setImpressions(val)} />
            </View>
            <View style={{ backgroundColor: "white", borderRadius: 10, margin: 10 }}>
                <TextInput placeholder="Diagnosis" value={diagnosis} multiline={true} style={{ margin: 10, fontSize: colors.font }} onChangeText={(val) => setDiagnosis(val)} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#00000099"
    },
    content: {
        margin: 10,
        backgroundColor: "white"
    },
    button: {
        flex: 1,
        margin: 10,
        backgroundColor: "grey",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 50
    }
})