import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker"
import DatePicker from '@react-native-community/datetimepicker'
import * as Sqlite from 'expo-sqlite';

const db = Sqlite.openDatabase('ProjectAyur.db')

export default function totalAmount() {

    const { colors } = useTheme()

    const [dateShow, setDateShow] = useState(false)
    const [monthShow, setMonthShow] = useState(false)
    const [yearShow, setYearShow] = useState(false)
    const date = new Date()
    const month = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [calenderShow, setCalenderShow] = useState(false)
    const [amount, setAmount] = useState(0)
    const [dateValue, setDateValue] = useState("")
    const [dateAmount, setDateAmount] = useState(0)
    const [monthAmount, setMonthAmount] = useState(0)
    const [yearAmount, setYearAmount] = useState(0)
    const [dateVisits, setDateVisits] = useState(0)
    const [monthVisits, setMonthVisits] = useState(0)
    const [yearVisits, setYearVisits] = useState(0)
    const [monthValue, setmonthValue] = useState("")
    const [yearValue, setYearValue] = useState("")


    const dateEarning = (val) => {

        // console.log(val)
        // console.log(date.getDate())
        setCalenderShow(false)
        let sum = 0
        if (val.type == "set") {
            let d = val.nativeEvent.timestamp
            // console.log(d.getDate())
            let visitedDate = "";
            if (d.getDate() < 10) {
                visitedDate = (month[d.getMonth()].slice(0, 3) + " 0" + d.getDate() + " " + d.getFullYear())
                setDateValue(visitedDate)
            }
            else {
                visitedDate = (month[d.getMonth()].slice(0, 3) + " " + d.getDate() + " " + d.getFullYear())
                setDateValue(visitedDate)
            }
            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Prescription WHERE Visited LIKE '%${visitedDate}%'`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    for (let i = 0; i < _array.length; i++) {
                        sum = sum + parseInt(_array[i].Amount)
                    }
                    setDateAmount(sum)
                    setDateVisits(_array.length)
                })
            })
        }

    }

    const monthWiseAmount = (val) => {
        let sum = 0

        if (val.length > 0) {
            // console.log(val.length)
            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Prescription WHERE Visited LIKE '%${val.slice(0, 3)}%'`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    for (let i = 0; i < _array.length; i++) {
                        sum = sum + parseInt(_array[i].Amount)
                    }
                    // console.log(sum)
                    setMonthAmount(sum)
                    setMonthVisits(_array.length)
                    setmonthValue(val)
                })
            })
            // setDate(d)
        }
    }

    const yearWiseAmount = (val) => {
        let sum = 0
        setYearValue(val)

        if (val.length > 3) {
            // console.log(val.length)
            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM Prescription WHERE Visited LIKE '%${val}%'`, [], (_, { rows: { _array } }) => {
                    // console.log(_array)
                    for (let i = 0; i < _array.length; i++) {
                        sum = sum + parseInt(_array[i].Amount)
                    }
                    // console.log(sum)
                    setYearAmount(sum)
                    setYearVisits(_array.length)
                })
            })
            // setDate(d)
        }
        else {
            setYearAmount(0)
            setYearVisits(0)
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity activeOpacity={0.7} style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10, marginTop: 10, marginLeft: 5, marginRight: 5, backgroundColor: colors.crd }} onPress={() => { setDateShow(!dateShow) }}>
                <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Date</Text>
                    <AntDesign style={{ marginRight: 10 }} name={dateShow ? "downcircleo" : "rightcircleo"} size={colors.font} color={colors.txt} />
                </View>
            </TouchableOpacity>
            {dateShow &&
                <View style={{ marginLeft: 5, marginRight: 5, backgroundColor: colors.crd, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopWidth: 3, borderTopColor: "grey" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", margin: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%', fontSize: colors.font }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{dateValue}</Text>
                            <AntDesign style={{ flex: 1 }} name="calendar" size={colors.font + 8} color={colors.txt} onPress={() => setCalenderShow(true)} />
                        </View>
                        {calenderShow && <DatePicker value={date} mode="date" onChange={(val) => dateEarning(val)}></DatePicker>}
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%' }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>Total Amount</Text>
                            <Text> : </Text>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{dateAmount}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%' }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>Total Number of Visits</Text>
                            <Text> : </Text>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{dateVisits}</Text>
                        </View>
                    </View>
                </View>
            }

            <TouchableOpacity activeOpacity={0.7} style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10, marginTop: 10, marginLeft: 5, marginRight: 5, backgroundColor: colors.crd }} onPress={() => { setMonthShow(!monthShow) }}>
                <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Month</Text>
                    <AntDesign style={{ marginRight: 10 }} name={monthShow ? "downcircleo" : "rightcircleo"} size={colors.font} color={colors.txt} />
                </View>
            </TouchableOpacity>
            {monthShow &&
                <View style={{ marginLeft: 5, marginRight: 5, backgroundColor: colors.crd, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopWidth: 3, borderTopColor: "grey" }}>
                    <Picker onValueChange={(val) => monthWiseAmount(val)} style={{ marginTop: 20, marginLeft: '10%', width: '70%', fontSize: colors.font }}>
                        <Picker.Item label="select a month" value="" style={{ fontSize: colors.font }}></Picker.Item>
                        {month.map((item, index) => (
                            <Picker.Item key={index} value={item} label={item} style={{ fontSize: colors.font, color: colors.txt }}></Picker.Item>
                        ))}
                    </Picker>
                    <View style={{ flex: 1, fontSize: colors.font, alignItems: "center", marginTop: 10, marginBottom: 20 }}>
                        <Text style={{ fontSize: colors.font }}>{monthValue}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", margin: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%' }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>Total Amount</Text>
                            <Text> : </Text>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{monthAmount}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%' }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>Total Number of Visits</Text>
                            <Text> : </Text>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{monthVisits}</Text>
                        </View>
                    </View>
                </View>
            }

            <TouchableOpacity activeOpacity={0.7} style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10, marginTop: 10, marginLeft: 5, marginRight: 5, backgroundColor: colors.crd }} onPress={() => { setYearShow(!yearShow) }}>
                <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
                    <Text style={{ flex: 1, fontSize: colors.font, color: colors.txt }}>Year</Text>
                    <AntDesign style={{ marginRight: 10 }} name={yearShow ? "downcircleo" : "rightcircleo"} size={colors.font} color={colors.txt} />
                </View>
            </TouchableOpacity>
            {yearShow &&
                <View style={{ marginLeft: 5, marginRight: 5, backgroundColor: colors.crd, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopWidth: 3, borderTopColor: "grey" }}>
                    <View style={{ alignItems: "center", marginTop: 10, marginBottom: 20 }}>
                        <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                            <TextInput placeholder="Enter a year" style={{ fontSize: colors.font, margin: 10 }} onChangeText={(val) => yearWiseAmount(val)} />
                        </View>
                    </View>
                    <View style={{ flex: 1, fontSize: colors.font, alignItems: "center", marginTop: 10, marginBottom: 20 }}>
                        <Text style={{ fontSize: colors.font }}>{yearValue}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", margin: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%' }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>Total Amount</Text>
                            <Text> : </Text>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{yearAmount}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: '8%', margin: '2%' }}>
                            <Text style={{ flex: 1, fontSize: colors.font }}>Total Number of Visits</Text>
                            <Text> : </Text>
                            <Text style={{ flex: 1, fontSize: colors.font }}>{yearVisits}</Text>
                        </View>
                    </View>
                </View>
            }
        </View>


    )
}
