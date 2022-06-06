import React, { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import BackUp from '../Screens/backup';
import Certificate from '../Screens/certificate';
import Configuration from '../Screens/configuration';
import InformationStack from './informationStack';
import MasterStack from './masterStack';
import Prescription from '../Screens/Prescription';
import Home from '../Screens/home';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';
import { Text, View, Modal, Switch, Button, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Swiper from "react-native-swiper"
import FormStack from './FormStack'
import * as Sqlite from 'expo-sqlite'
import DietChart from '../Screens/DietChart';

const Drawer = createDrawerNavigator()

const screen = Dimensions.get("screen").width > 425
const db = Sqlite.openDatabase('ProjectAyur.db')

export default function DrawerContainer(props) {

    const [color, setColor] = useState('#DDDDDD')
    const [modal, setModal] = useState(false)
    const [backGround, setBackGround] = useState('#DDDDDD')
    const [iconColor, setIconColor] = useState('#E15009')
    const [textColor, setTextColor] = useState('#0A0A0A')
    const [cardColor, setCardColor] = useState('#D0CBCB')
    const [isEnabled, setIsEnabled] = useState(false);
    const [count, setCount] = useState(0)
    const [change, setChange] = useState(true)
    const [font, setFont] = useState(18)
    const [branchVisible, setBranchVisible] = useState(false)
    const [branchData, setBranchData] = useState([])
    const [branch, setBranch] = useState("")
    const [code, setCode] = useState("")
    const [selectedBranch, setSelectedBranch] = useState({ Branch: "Nuzvid", Code: "TM" })


    useEffect(() => {
        // console.log("Me")
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM Branches`, [], (_, { rows: { _array } }) => {
                setBranchData(_array)
            })
        })
        if (count == 0) {
            getTheme()
        }
        else {
            storeData()
        }
        // storeData()
    }, [change])

    const getTheme = async () => {
        setCount(1)
        try {
            let color = JSON.parse(await AsyncStorage.getItem("theme"))
            setIsEnabled(color.darkmode)
            setBackGround(color.backGround)
            setIconColor(color.icon)
            setTextColor(color.text)
            setCardColor(color.card)
            setFont(color.font)
            let branch = JSON.parse(await AsyncStorage.getItem("Branch"))
            if (branch != null) {
                setSelectedBranch(branch)
                console.log(branch)
            }
        } catch (e) {
            // remove error
            // console.log(e)
        }
    }

    const toggleSwitch = () => {
        setIsEnabled(!isEnabled);
        if (isEnabled) {
            // console.log(isEnabled)
            setBackGround('#FCFAFA')
            setTextColor('#0A0A0A')
            setCardColor('#B6AAAA')
        }
        else {
            setBackGround('#150909')
            setTextColor('#FFFFFF')
            setCardColor('#7B7676')
        }
        // console.log(backGround)
        setChange(!change)
    }

    const MyDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            swipe: color,
            back: backGround,
            icon: iconColor,
            txt: textColor,
            crd: cardColor,
            font: font,
            change: change
        }
    }

    const MyDefaultTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            swipe: color,
            back: backGround,
            icon: iconColor,
            txt: textColor,
            crd: cardColor,
            font: font,
            change: change
        }
    }

    const storeData = async () => {
        // console.log(selectedBranch)
        let colorScheme = { "darkmode": isEnabled, "backGround": backGround, "icon": iconColor, "text": textColor, "card": cardColor, "font": font }
        try {
            await AsyncStorage.setItem('theme', JSON.stringify(colorScheme))
            await AsyncStorage.setItem('Branch', JSON.stringify(selectedBranch))
        } catch (e) {
        }
    }

    const sendData = () => {
        props.google(true)
    }

    const addBranch = () => {
        //console.log("Adding")
        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO Branches (
                Branch,
                Code
                )
                VALUES (
                ?,
                ?
                );`,
                [branch, code],
                (data) => {
                    setChange(!change)
                    // console.log("data")
                    setBranch('')
                    setCode('')
                },
                (err) => {
                    // console.log("Error")
                })
        })
    }

    return (
        <NavigationContainer theme={isEnabled ? MyDarkTheme : MyDefaultTheme}>
            <Modal visible={modal} onRequestClose={() => { setModal(false), storeData() }}>
                <View style={{ alignItems: 'flex-end' }}>
                    <Ionicons name="close" size={40} onPress={() => { setModal(false), storeData() }}></Ionicons>
                </View>
                {screen ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Back Ground </Text>
                                    <ColorPicker
                                        onColorChangeComplete={(color) => (setColor(color), setBackGround(color))}
                                        color={backGround}
                                        swatches={false}
                                        thumbSize={20}
                                        sliderSize={20}
                                        noSnap={true}
                                        row={false}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Icon Color </Text>
                                    <ColorPicker
                                        onColorChangeComplete={(color) => (setIconColor(color))}
                                        color={iconColor}
                                        swatches={false}
                                        thumbSize={30}
                                        sliderSize={20}
                                        noSnap={true}
                                        row={false}
                                    />
                                </View>

                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Text Color </Text>
                                        <ColorPicker
                                            onColorChangeComplete={(color) => (setTextColor(color))}
                                            color={textColor}
                                            swatches={false}
                                            thumbSize={20}
                                            sliderSize={20}
                                            noSnap={true}
                                            row={false}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Card Color</Text>
                                        <ColorPicker
                                            onColorChangeComplete={(color) => (setCardColor(color))}
                                            color={cardColor}
                                            swatches={false}
                                            thumbSize={20}
                                            sliderSize={20}
                                            noSnap={true}
                                            row={false}
                                        />
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View> :
                    <View style={{ flex: 1 }}>
                        <Swiper showsButtons={true} showsPagination={false}>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>BackGround Color</Text>
                                <View style={{ flex: 1, margin: "5%" }}>
                                    <ColorPicker
                                        style={{ flex: 1 }}
                                        onColorChangeComplete={(color) => (setBackGround(color))}
                                        color={backGround}
                                        swatches={false}
                                        thumbSize={30}
                                        sliderSize={20}
                                        noSnap={false}
                                        row={false}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>Card Color</Text>
                                <View style={{ flex: 1, margin: "5%" }}>
                                    <ColorPicker
                                        style={{ flex: 1 }}
                                        onColorChangeComplete={(color) => (setCardColor(color))}
                                        color={cardColor}
                                        swatches={false}
                                        thumbSize={30}
                                        sliderSize={20}
                                        noSnap={false}
                                        row={false}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>Text Color</Text>
                                <View style={{ flex: 1, margin: "5%" }}>
                                    <ColorPicker
                                        onColorChangeComplete={(color) => (setTextColor(color))}
                                        color={textColor}
                                        swatches={false}
                                        thumbSize={30}
                                        sliderSize={20}
                                        noSnap={false}
                                        row={false}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>Icon Color</Text>
                                <View style={{ flex: 1, margin: "5%" }}>
                                    <ColorPicker
                                        onColorChangeComplete={(color) => (setIconColor(color))}
                                        color={iconColor}
                                        swatches={false}
                                        thumbSize={30}
                                        sliderSize={20}
                                        noSnap={false}
                                        row={false}
                                    />
                                </View>
                            </View>
                        </Swiper>

                    </View>
                }
            </Modal>
            <Modal visible={branchVisible} transparent={true} onRequestClose={() => setBranchVisible(false)}>
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#00000089" }}>
                    <View style={{ backgroundColor: "white", height: '35%', width: '75%' }}>
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ borderWidth: 1, flex: 1 }}>
                                <TextInput style={{ margin: 5, fontSize: font }} placeholder="Branch" onChangeText={(val) => setBranch(val)} />
                            </View>
                            <View style={{ borderWidth: 1, marginLeft: 3 }}>
                                <TextInput style={{ margin: 5, fontSize: font }} placeholder="Code" onChangeText={(val) => setCode(val)} />
                            </View>
                            <Button title="Add" onPress={addBranch} />
                        </View>
                        <ScrollView nestedScrollEnabled={true}>
                            {branchData.map((item, index) => (
                                <TouchableOpacity key={index} style={{ elevation: 3, backgroundColor: "#D3D2D1", flexDirection: "row", marginTop: 5 }} onPress={() => { setBranchVisible(false), setSelectedBranch(item), setChange(!change) }}>
                                    <Text style={{ padding: 10, flex: 1, fontSize: font }}>{item.Branch}</Text>
                                    <Text style={{ padding: 10, fontSize: font }}>{item.Code}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerPressColor: '#0A0A0A' }} drawerContent={props => {
                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        <View>
                            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                    <TouchableOpacity style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, color: isEnabled ? "white" : "black", paddingLeft: 15 }}>Dark Mode</Text>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                        <Switch
                                            trackColor={{ false: "grey", true: "grey" }}
                                            thumbColor={isEnabled ? "white" : "black"}
                                            onValueChange={() => { toggleSwitch() }}
                                            value={isEnabled}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 15 }} onPress={() => { setModal(true) }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, color: isEnabled ? "white" : "black", paddingLeft: 15 }}>Customize Colors</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
                                        <MaterialCommunityIcons name="circle" size={40} color={color}></MaterialCommunityIcons>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                    <TouchableOpacity style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, color: isEnabled ? "white" : "black", paddingLeft: 15 }}>Font Size</Text>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: "row", alignItems: "center" }}>
                                        <AntDesign name="minuscircleo" size={25} onPress={() => { setFont(font - 1), storeData() }} color={textColor} />
                                        <Text style={{ fontSize: font, paddingLeft: 5, paddingRight: 5, color: textColor }}>{font}</Text>
                                        <AntDesign name="pluscircleo" size={25} onPress={() => { setFont(font + 1), storeData() }} color={textColor} />
                                    </View>
                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }} onPress={() => setBranchVisible(true)}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, color: isEnabled ? "white" : "black", paddingLeft: 15 }}>{selectedBranch.Branch}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: "row", alignItems: "center" }}>
                                        <AntDesign name="rightcircleo" size={22} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }} onPress={() => { sendData() }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, color: isEnabled ? "white" : "black", paddingLeft: 15 }}>Exit</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: "row", alignItems: "center" }}>
                                        <AntDesign name="rightcircleo" size={22} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </DrawerContentScrollView>
                )
            }}>
                <Drawer.Screen name="Home" component={Home} />
                <Drawer.Screen name="Patient" component={FormStack} />
                <Drawer.Screen name="Certificate" component={Certificate} />
                <Drawer.Screen name="Diet Chart" component={DietChart} />
                <Drawer.Screen name="Master" component={MasterStack} />
                <Drawer.Screen name="Report" component={InformationStack} />
                <Drawer.Screen name="Profile" component={Configuration} />
                <Drawer.Screen name="Backup" component={BackUp} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}