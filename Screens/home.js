import * as React from 'react';
import { useEffect, useState } from 'react'
import { StyleSheet, View, Modal, Text, TextInput, Button, TouchableOpacity, ScrollView, ImageBackground, Animated } from 'react-native';
import * as Sqlite from 'expo-sqlite'
import { useTheme } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = Sqlite.openDatabase('ProjectAyur.db')

export default function Home({ navigation }) {

    const { colors } = useTheme()
    const rotate = useState(new Animated.Value(0))[0]
    const larging = useState(new Animated.Value(0))[0]
    const scaling = useState(new Animated.Value(0))[0]

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS Patient (
                Id TEXT    PRIMARY KEY NOT NULL,
                Name TEXT NOT NULL,
                Age TEXT NOT NULL,
                Gender TEXT,
                Address TEXT,
                Contact TEXT,
                VisitedDate DATE,
                FollowUpDate DATE,
                Doctor TEXT,
                Branch TEXT
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Roga (
                Id TEXT PRIMARY KEY NOT NULL,
                Name TEXT NOT NULL
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Laxanam (
                Id TEXT PRIMARY KEY NOT NULL,
                Name TEXT NOT NULL
            );
            `, [])


            tx.executeSql(`CREATE TABLE IF NOT EXISTS Vishesha (
                Id TEXT PRIMARY KEY NOT NULL,
                Name TEXT NOT NULL
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Aushadham (
                Id TEXT PRIMARY KEY NOT NULL,
                Aushadham TEXT NOT NULL
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Dose (
                Id TEXT PRIMARY KEY NOT NULL,
                Dose TEXT NOT NULL
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Samayam (
                Id TEXT PRIMARY KEY NOT NULL,
                Samayam TEXT NOT NULL
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Anupanam (
                Id TEXT PRIMARY KEY NOT NULL,
                Anupanam TEXT NOT NULL
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Prescription(
                PrescriptionId TEXT    NOT NULL PRIMARY KEY,
                PatientId TEXT REFERENCES Patient (Id),
                Bp             TEXT,
                Rbs            TEXT,
                Height         TEXT,
                Weight         TEXT,
                Visited        DATE,
                FollowUpDate   DATE,
                FollowUp BOOLEAN,
                Amount TEXT,
                DoctorName TEXT,
                BranchName TEXT
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS PresRoga (
                Prescription TEXT REFERENCES Prescription (PrescriptionId),
                Roga TEXT REFERENCES  Roga (Id) 
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS PresLaxanam (
                Prescription TEXT REFERENCES Prescription (PrescriptionId),
                Laxanam TEXT REFERENCES Laxanam (Id) 
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Pathology (
                Prescription TEXT REFERENCES Prescription (PrescriptionId),
                Photo TEXT,
                Impressions TEXT,
                Diagnosis TEXT 
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS PresVishesha (
                Prescription TEXT REFERENCES Prescription (PrescriptionId),
                Vishesha TEXT REFERENCES Vishesha (Id) 
            );
            `, [])

            tx.executeSql(`CREATE TABLE IF NOT EXISTS Receipt(
                Prescription TEXT REFERENCES Prescription (PrescriptionId),
                Aushadham    TEXT REFERENCES Aushadham (Id),
                Dose         TEXT REFERENCES Dose (Id),
                Samayam      TEXT REFERENCES Samayam (Id),
                Anupanam     TEXT REFERENCES Anupanam (Id) 
            );
            `, [])

            set()
            looping()
            enlarge()
        })
    }, [navigation])

    const set = async () => {
        if (AsyncStorage.getItem("field")) {
            // console.log("have")
        }
        else {
            await AsyncStorage.setItem("field", "Amount")
            // console.log("Dont have")
        }
    }

    const looping = () => {
        Animated.loop(
            Animated.timing(
                rotate,
                {
                    toValue: 1,
                    duration: 10000,
                    // easing: Easing.linear,
                    useNativeDriver: false
                }
            )
        ).start();
    }

    const enlarge = () => {
        Animated.loop(
            Animated.timing(
                larging,
                {
                    toValue: 1,
                    duration: 2000,
                    // easing: Easing.linear,
                    useNativeDriver: false
                }
            )
        ).start();
    }

    const enlargeing = () => {
        Animated.timing(
            scaling,
            {
                toValue: 1,
                duration: 1000,
                // easing: Easing.linear,
                useNativeDriver: false
            }
        ).start();
    }


    return (
        <ImageBackground source={require('../assets/ayurvedham.gif')} resizeMode="cover" style={styles.image}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, alignItems: "flex-start" }}>
                        <Animated.View style={{
                            opacity: larging.interpolate({
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 1, 0]
                            })
                        }}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.bubbles} onPress={() => { navigation.navigate('Patient'), enlargeing() }}>
                                <View style={{ margin: 30, alignItems: "center" }}>
                                    <AntDesign name="profile" size={30} color="#FCB404" style={styles.icon} />
                                    <Text>Patient</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Animated.View style={{
                            opacity: larging.interpolate({
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 1, 0]
                            })
                        }}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.bubbles} onPress={() => navigation.navigate('Master')}>
                                <View style={{ margin: 20, alignItems: "center" }}>
                                    <FontAwesome name="users" size={30} color="#FCB404" />
                                    <Text>Master</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, alignItems: "flex-start" }}>
                        <Animated.View style={{
                            opacity: larging.interpolate({
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 1, 0]
                            })
                        }}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.bubbles} onPress={() => navigation.navigate('Certificate')}>
                                <View style={{ margin: 20, alignItems: "center" }}>
                                    <MaterialCommunityIcons name="certificate-outline" size={30} color="#FCB404" />
                                    <Text>Certificate</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Animated.View style={{
                            opacity: larging.interpolate({
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 1, 0]
                            })
                        }}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.bubbles} onPress={() => navigation.navigate('Diet Chart')}>
                                <View style={{ margin: 20, alignItems: "center" }}>
                                    <MaterialIcons name="insert-chart-outlined" size={30} color="#FCB404" />
                                    <Text>Diet Chart</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, alignItems: "flex-start" }}>
                        <Animated.View style={{
                            opacity: larging.interpolate({
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 1, 0]
                            })
                        }}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.bubbles} onPress={() => navigation.navigate('Report')}>
                                <View style={{ margin: 20, alignItems: "center" }}>
                                    <FontAwesome name="calendar-check-o" size={30} color="#FCB404" />
                                    <Text>Report</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Animated.View style={{
                            opacity: larging.interpolate({
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 1, 0]
                            })
                        }}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.bubbles} onPress={() => navigation.navigate('Profile')}>
                                <View style={{ margin: 20, alignItems: "center", opacity: 1 }}>
                                    <Ionicons name="person-outline" size={30} color="#FCB404" />
                                    <Text>Profile</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bubbles: {
        borderRadius: 100,
        backgroundColor: "#08E1F9",
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        elevation: 10,
        width: 100,
        height: 100
    },
    icon: {
        elevation: 100
    },
    image: {
        flex: 1,
        justifyContent: "center"
    }
});
