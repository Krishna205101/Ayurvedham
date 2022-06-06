import * as React from 'react';
import { useState, useEffect } from 'react'
import { Text, View, Button, Modal, Switch } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker'
import BackUp from '../Screens/backup';
import Certificate from '../Screens/certificate';
import Configuration from '../Screens/configuration';
import InformationStack from './informationStack';
import MasterStack from './masterStack';
import Prescription from '../Screens/Prescription';
import Home from '../Screens/home';
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormStack from './FormStack'

const Tab = createBottomTabNavigator()

export default function Tabbar(props) {

    const [color, setColor] = useState('#DDDDDD')
    const [modal, setModal] = useState(false)
    const [backGround, setBackGround] = useState('#DDDDDD')
    const [iconColor, setIconColor] = useState('#E15009')
    const [textColor, setTextColor] = useState('#0A0A0A')
    const [cardColor, setCardColor] = useState('#D0CBCB')
    const [isEnabled, setIsEnabled] = useState(false);
    const [count, setCount] = useState(0)
    const [change, setChange] = useState(true)
    const [font, setFont] = useState(22)

    useEffect(() => {
        // console.log("Me")
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
            // console.log(color.darkmode)
            setIsEnabled(color.darkmode)
            setBackGround(color.backGround)
            setIconColor(color.icon)
            setTextColor(color.text)
            setCardColor(color.card)
            setFont(color.font)
        } catch (e) {
            // remove error
            // console.log(e)
        }
    }

    const toggleSwitch = () => {
        setIsEnabled(!isEnabled);
        // console.log(isEnabled)
        if (isEnabled) {
            setBackGround('#FCFAFA')
            setTextColor('#0A0A0A')
            setCardColor('#B6AAAA')
        }
        else {
            setBackGround('#150909')
            setTextColor('#FFFFFF')
            setCardColor('#413434')
        }
        setChange(!change)
    }

    const storeData = async () => {
        let colorScheme = { "darkmode": isEnabled, "backGround": backGround, "icon": iconColor, "text": textColor, "card": cardColor, "font": font }
        try {
            await AsyncStorage.setItem('theme', JSON.stringify(colorScheme))
            // console.log(colorScheme)
        } catch (e) {
            // console.log(e)
        }
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
            font: font
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
            font: font
        }
    }

    return (
        <NavigationContainer theme={isEnabled ? MyDarkTheme : MyDefaultTheme}>
            <Modal visible={modal}>
                <View style={{ alignItems: 'flex-end' }}>
                    <Ionicons name="close" size={40} onPress={() => { setModal(false), storeData() }}></Ionicons>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>Back Ground </Text>
                                <ColorPicker style={{ margin: 20 }}
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
                                <ColorPicker style={{ margin: 20 }}
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
                                    <ColorPicker style={{ margin: 20 }}
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
                                    <ColorPicker style={{ margin: 20 }}
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
                </View>
            </Modal>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let IconComponent = MaterialCommunityIcons;
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Prescription') {
                            iconName = focused ? 'file-edit' : 'file-edit-outline';
                        }
                        else if (route.name === 'Patient') {
                            iconName = focused ? 'file-edit' : 'file-edit-outline';
                        }
                        else if (route.name === 'Certificate') {
                            iconName = focused ? 'certificate' : 'certificate-outline';
                        }
                        else if (route.name === 'Master') {
                            iconName = focused ? 'view-list' : 'view-list-outline';
                        }
                        else if (route.name === 'Report') {
                            iconName = focused ? 'calendar-account' : 'calendar-account-outline';
                        }
                        else if (route.name === 'Profile') {
                            iconName = focused ? 'account-box' : 'account-box-outline';
                        }
                        else if (route.name === 'Backup') {
                            iconName = 'backup-restore';
                        }

                        return <IconComponent name={iconName} size={40} color={iconColor} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'black',
                })}
            >
                <Tab.Screen name="Home" component={Home} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={30} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
                <Tab.Screen name="Patient" component={FormStack} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={40} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
                <Tab.Screen name="Certificate" component={Certificate} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={40} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
                <Tab.Screen name="Master" component={MasterStack} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={40} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
                <Tab.Screen name="Report" component={InformationStack} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={40} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
                <Tab.Screen name="Profile" component={Configuration} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={40} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
                <Tab.Screen name="Backup" component={BackUp} options={{
                    headerRight: () => (
                        <View style={{ marginRight: 30, flexDirection: 'row' }}>
                            <Switch
                                trackColor={{ false: "grey", true: "grey" }}
                                thumbColor={isEnabled ? "white" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <MaterialCommunityIcons name="circle" size={40} color={color} onPress={() => { setModal(true) }}></MaterialCommunityIcons>

                        </View>
                    ),
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}