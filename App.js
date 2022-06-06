import * as React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, Modal, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Drawer from './routes/Drawer'
import * as Sqlite from 'expo-sqlite'
import Login from './Screens/Authentication/Login';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons'
import { Button } from 'react-native-elements'
import * as GoogleSignIn from 'expo-google-sign-in';
import * as FileSystem from 'expo-file-system';

const screen = Dimensions.get("screen").width > 425

const db = Sqlite.openDatabase('ProjectAyur.db')

db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
  console.log('Foreign keys turned on')
);

export default function App() {

  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL)

  const [logged, setLogged] = useState(false)
  const [signin, setSignin] = useState(false)
  const [restoreVisible, setRestoreVisible] = useState(false)
  const [signinVisible, setSigninVisible] = useState(false)
  const [backUpKey, setBackUpKey] = useState("")
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS User(
        Id TEXT,
        Name TEXT,
        Email TEXT,
        Phone TEXT,
        LandLine TEXT,
        Address TEXT,
        Hospital TEXT,
        Description TEXT,
        Logo1 TEXT,
        Logo2 TEXT
      );`)

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Branches(
        Branch TEXT,
        Code TEXT
      );`, [])

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
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Roga (
        Id TEXT PRIMARY KEY NOT NULL,
        Name TEXT NOT NULL
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Laxanam (
        Id TEXT PRIMARY KEY NOT NULL,
        Name TEXT NOT NULL
      );`, [])


      tx.executeSql(`CREATE TABLE IF NOT EXISTS Vishesha (
        Id TEXT PRIMARY KEY NOT NULL,
        Name TEXT NOT NULL
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Aushadham (
        Id TEXT PRIMARY KEY NOT NULL,
        Aushadham TEXT NOT NULL
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Dose (
        Id TEXT PRIMARY KEY NOT NULL,
        Dose TEXT NOT NULL
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Samayam (
        Id TEXT PRIMARY KEY NOT NULL,
        Samayam TEXT NOT NULL
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Anupanam (
        Id TEXT PRIMARY KEY NOT NULL,
        Anupanam TEXT NOT NULL
      );`, [])

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
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS PresRoga (
        Prescription TEXT REFERENCES Prescription (PrescriptionId),
        Roga TEXT REFERENCES  Roga (Id) 
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS PresLaxanam (
        Prescription TEXT REFERENCES Prescription (PrescriptionId),
        Laxanam TEXT REFERENCES Laxanam (Id) 
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Pathology (
        Prescription TEXT REFERENCES Prescription (PrescriptionId),
        Photo TEXT,
        Impressions TEXT,
        Diagnosis TEXT 
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS PresVishesha (
        Prescription TEXT REFERENCES Prescription (PrescriptionId),
        Vishesha TEXT REFERENCES Vishesha (Id) 
      );`, [])

      tx.executeSql(`CREATE TABLE IF NOT EXISTS Receipt(
        Prescription TEXT REFERENCES Prescription (PrescriptionId),
        Aushadham    TEXT REFERENCES Aushadham (Id),
        Dose         TEXT REFERENCES Dose (Id),
        Samayam      TEXT REFERENCES Samayam (Id),
        Anupanam     TEXT REFERENCES Anupanam (Id) 
      );`, [])
    })

    getData()
    getLogin()
    initAsync()

  }, [logged])

  const getLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("google")
      if (value != null) {
        setSigninVisible(false)
      }
      else {
        setSigninVisible(true)
      }
    }
    catch (e) {
    }
  }

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
        if (_array.length > 0) {
          setLogged(true)
        }
        else {
          setLogged(false)
        }
      })
    })
  }

  const callbackFunction = (childData) => {
    setLogged(childData)
  }

  const googleCallbackFunction = (childData) => {
    GoogleSignIn.signOutAsync()
    setSigninVisible(childData)
    AsyncStorage.removeItem('google')
    setSignin(!childData)
  }

  const getUser = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    if (user) {
      AsyncStorage.setItem("google", user.auth.accessToken)
    }
  };

  const initAsync = async () => {
    await GoogleSignIn.initAsync({
      // You may ommit the clientId when the firebase `googleServicesFile` is configured
      clientId: `616855259281-mrod8di4hj9mpmd6shdfa3dnggjcsk8a.apps.googleusercontent.com`,
      scopes: [
        GoogleSignIn.SCOPES.PROFILE,
        GoogleSignIn.SCOPES.EMAIL,
        GoogleSignIn.SCOPES.DRIVE_FILE,
        GoogleSignIn.SCOPES.DRIVE_APPFOLDER,
        GoogleSignIn.SCOPES.DRIVE_FULL,
        GoogleSignIn.SCOPES.DRIVE_APPS,
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.photos.readonly',
      ]
    });
    getUser();
  };

  const handleSubmit = async () => {
    try {
      setSignin(true)
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      // Alert.alert(JSON.stringify(type), JSON.stringify(user))
      AsyncStorage.setItem("google", user.auth.accessToken)
      Alert.alert("Welcome", user.displayName)
      setSigninVisible(false)
      db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM User`, [], (_, { rows: { _array } }) => {
          console.log(_array.length)
          console.log("OK")
          if (_array.length > 0) {
            setRestoreVisible(false)
          }
          else {
            setRestoreVisible(true)
          }
        })
      })
    }
    catch ({ message }) {
      Alert.alert("Google Signin Error", message)
    }
  }

  const restore = async () => {

    const value = await AsyncStorage.getItem("google")
    fetch(`https://www.googleapis.com/drive/v3/files/${backUpKey}?alt=media`, {
      headers: {
        Authorization: "Bearer " + value,
        "Content-Type": "text/plain"
      }
    })
      .then((response) => response.text()).then((resJson) => {
        let data = JSON.parse(resJson)
        if (data.error) {
          Alert.alert("Failure", "File Not Found")
        }
        else {
          // console.log(resJson)
          setRestoring(true)
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO User (Id,Name,Email,Phone,LandLine,Address,Hospital,Description,Logo1,Logo2)
                            VALUES (?,?,?,?,?,?,?,?,?,?);`,
              [data.User[0].Id, data.User[0].Name, data.User[0].Email, data.User[0].Phone, data.User[0].LandLine, data.User[0].Address, data.User[0].Hospital, data.User[0].Description, data.User[0].Logo1, data.User[0].Logo2],
              (data) => console.log("Users Done"), (err) => console.log("Error in User")
            )

            for (let i = 0; i < data.Branches.length; i++) {
              tx.executeSql(`INSERT INTO Branches (Branch,Code)
                                VALUES (?,?);`, [data.Branches[i].Branch, data.Branches[i].Code],
                () => {
                  console.log("Branches Done")
                  let tempBranch = JSON.stringify({ Branch: data.Branches[0].Branch, Code: data.Branches[0].Code })
                  AsyncStorage.setItem('Branch', tempBranch)
                },
                (err) => {
                  console.log("Error in Branches")
                }
              )
            }

            for (let i = 0; i < data.Patient.length; i++) {
              tx.executeSql(`INSERT INTO Patient (Id,Name,Age,Gender,Address,Contact,Doctor,Branch,VisitedDate,FollowUpDate)
                                VALUES (?,?,?,?,?,?,?,?,?,?);`, [data.Patient[i].Id, data.Patient[i].Name, data.Patient[i].Age, data.Patient[i].Gender, data.Patient[i].Address, data.Patient[i].Contact, data.Patient[i].Doctor, data.Patient[i].Branch, data.Patient[i].VisitedDate, data.Patient[i].FollowUpDate])
            }

            for (let i = 0; i < data.Aushadam.length; i++) {
              tx.executeSql(`INSERT INTO Aushadham(Id,Aushadham) VALUES(?,?)`, [data.Aushadam[i].Id, data.Aushadam[i].Aushadham])
            }

            for (let i = 0; i < data.Dose.length; i++) {
              tx.executeSql(`INSERT INTO Dose(Id,Dose) VALUES(?,?)`, [data.Dose[i].Id, data.Dose[i].Dose])
            }

            for (let i = 0; i < data.Samayam.length; i++) {
              tx.executeSql(`INSERT INTO Samayam(Id,Samayam) VALUES(?,?)`, [data.Samayam[i].Id, data.Samayam[i].Samayam])
            }

            for (let i = 0; i < data.Anupanam.length; i++) {
              tx.executeSql(`INSERT INTO Anupanam(Id,Anupanam) VALUES(?,?)`, [data.Anupanam[i].Id, data.Anupanam[i].Anupanam])
            }

            for (let i = 0; i < data.Roga.length; i++) {
              tx.executeSql(`INSERT INTO Roga(Id,Name) VALUES(?,?)`, [data.Roga[i].Id, data.Roga[i].Name])
            }

            for (let i = 0; i < data.Laxanam.length; i++) {
              tx.executeSql(`INSERT INTO Laxanam(Id,Name) VALUES(?,?)`, [data.Laxanam[i].Id, data.Laxanam[i].Name])
            }

            for (let i = 0; i < data.Vishesha.length; i++) {
              tx.executeSql(`INSERT INTO Vishesha(Id,Name) VALUES(?,?)`, [data.Vishesha[i].Id, data.Vishesha[i].Name])
            }

            for (let i = 0; i < data.Prescription.length; i++) {
              tx.executeSql(`INSERT INTO Prescription (PrescriptionId,PatientId,Bp,Rbs,Height,Weight,Visited,FollowUpDate,FollowUp,amount,BranchName,DoctorName)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`, [data.Prescription[i].PrescriptionId, data.Prescription[i].PatientId, data.Prescription[i].Bp, data.Prescription[i].Rbs, data.Prescription[i].Height, data.Prescription[i].Weight, data.Prescription[i].Visited, data.Prescription[i].FollowUpDate, data.Prescription[i].FollowUp, data.Prescription[i].Amount, data.Prescription[i].DoctorName, data.Prescription[i].BranchName]
              )
            }

            for (let i = 0; i < data.PresRoga.length; i++) {
              tx.executeSql(`INSERT INTO PresRoga (Prescription,Roga) VALUES (?,?);`, [data.PresRoga[i].Prescription, data.PresRoga[i].Roga])
            }

            for (let i = 0; i < data.PresLaxanam.length; i++) {
              tx.executeSql(`INSERT INTO PresLaxanam (Prescription,Laxanam) VALUES (?,?);`, [data.PresLaxanam[i].Prescription, data.PresLaxanam[i].Laxanam])
            }

            for (let i = 0; i < data.Pathology.length; i++) {
              tx.executeSql(`INSERT INTO Pathology(Prescription,Photo,Impressions,Diagnosis) 
                                    VALUES (?,?,?,?)`, [data.Pathology[i].Prescription, data.Pathology[i].Photo, data.Pathology[i].Impressions, data.Pathology[i].Diagnosis])
            }

            for (let i = 0; i < data.PresVishesha.length; i++) {
              tx.executeSql(`INSERT INTO PresVishesha (Prescription,Vishesha) VALUES (?,?);`, [data.PresVishesha[i].Prescription, data.PresVishesha[i].Vishesha])
            }

            for (let i = 0; i < data.Receipt.length; i++) {
              tx.executeSql(`INSERT INTO Receipt (Prescription,Aushadham,Dose,Samayam,Anupanam) VALUES (?,?,?,?,?);`, [data.Receipt[i].Prescription, data.Receipt[i].Aushadham, data.Receipt[i].Dose, data.Receipt[i].Samayam, data.Receipt[i].Anupanam])
            }
            setLogged(true)
            setRestoring(false)
            setRestoreVisible(false)
          })
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <Modal visible={restoring} transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000099" }}>
          <View style={{ height: 100, width: 100, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      </Modal>
      <Modal visible={signinVisible}>
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <View style={styles.card}>
            <View style={{ margin: 15 }}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ color: "red", fontSize: 30, fontWeight: "bold" }}>G</Text>
                <Text style={{ color: "#E5E12C", fontSize: 30, fontWeight: "bold" }}>o</Text>
                <Text style={{ color: "#80B619", fontSize: 30, fontWeight: "bold" }}>o</Text>
                <Text style={{ color: "red", fontSize: 30, fontWeight: "bold" }}>g</Text>
                <Text style={{ color: "#FB911B", fontSize: 30, fontWeight: "bold" }}>l</Text>
                <Text style={{ color: "#168FE0", fontSize: 30, fontWeight: "bold" }}>e</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: "900" }}>Please Signin into your google account to continue using the Application.</Text>
              <Text style={{ fontSize: 18, marginTop: 15 }}>It is a mandotory step</Text>
              <View style={{ marginTop: 15 }}>
                {!signin ?
                  <Button title="Sign into Google" buttonStyle={{ backgroundColor: "#80B619" }} icon={
                    <AntDesign style={{ paddingRight: "2%" }} name="google" size={20} color="white" />
                  } onPress={() => handleSubmit()} />
                  :
                  <ActivityIndicator size="large" color="black" />
                }
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={restoreVisible}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={styles.card}>
            <View style={{ margin: 15 }}>
              <Text style={{ fontSize: 22, fontWeight: "900" }}>If you have any backed up data and want to restore it.Please enter the Id into the Textbox below and then press OK else press Cancel</Text>
              <Text>Press CANCEL, if you have exited from the App.</Text>
              <TextInput placeholder="Enter BackUp Id" onChangeText={(val) => setBackUpKey(val)} />
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Button title="CANCEL" buttonStyle={{ margin: 15, backgroundColor: "#F99377", justifyContent: "flex-start" }} icon={
                    <AntDesign style={{ paddingRight: "2%" }} name="closecircleo" size={20} color="white" />
                  } onPress={() => setRestoreVisible(false)} />
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Button title="OK" buttonStyle={{ margin: 15, backgroundColor: "#80B619", justifyContent: "flex-start" }} icon={
                    <AntDesign style={{ paddingRight: "2%" }} name="checkcircleo" size={20} color="white" />
                  } onPress={() => restore()} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {logged ? <Drawer callback={callbackFunction} google={googleCallbackFunction} /> : <Login callback={callbackFunction} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    elevation: 3,
    borderRadius: 10,
    shadowOpacity: 0.3,
    margin: 5,
    shadowRadius: 3
  }
});
