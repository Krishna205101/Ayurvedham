import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';


export default function Master({ navigation }) {

    const { colors } = useTheme()

    const screens = [{ name: "Patient", id: "1" },
    { name: "Medicine", id: "2" },
    { name: "Dose", id: "3" },
    { name: "Time", id: "4" },
    { name: "Vehicle", id: "5" },
    { name: "Main Complaint", id: "6" },
    { name: "Signs & Symptoms", id: "7" },
    { name: "Special Instructions", id: "9" },
    ]

    const pressHandler = (name) => {
        navigation.navigate(name)
    }

    return (
        <View style={{ backgroundColor: colors.back, flex: 1 }}>
            {/* <FlatList
                keyExtractor={(item) => item.id}
                data={screens}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{item.name}</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => pressHandler(item.name)}>
                                <AntDesign name="right" size={20} style={styles.icon} color="white"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            /> */}
            <ScrollView>
                {
                    screens.map((item) => {
                        return (
                            <TouchableOpacity key={item.id} style={[styles.item, { backgroundColor: colors.crd }]}  onPress={() => pressHandler(item.name)}>
                                <View style={styles.textContainer}>
                                    <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}>{item.name}</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <View>
                                        <AntDesign name="right" size={colors.font + 3} style={styles.icon} color={colors.txt} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        padding: 20,
        alignItems: "center"
    },
    textContainer: {
        flex: 1
    },
    iconContainer: {
        flex: 1,
        alignItems: "flex-end"
    },
    text: {
        fontSize: 18
    }
});