import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

export default function Information({ navigation }) {

    const { colors } = useTheme()

    const screens = [{ name: "Visited", id: "1" }, { name: "Followup", id: "2" }, { name: "Total", id: "3" }]

    const pressHandler = (name) => {
        navigation.navigate(name)
    }

    return (
        <View style={{ backgroundColor: colors.back, flex: 1 }}>
            <ScrollView>
                {
                    screens.map((item) => {
                        return (
                            <TouchableOpacity key={item.id} style={[styles.item, { backgroundColor: colors.crd }]} onPress={() => pressHandler(item.name)}>
                                <View style={styles.textContainer}>
                                    <Text style={[styles.text, { color: colors.txt, fontSize: colors.font }]}>{item.name}</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <View>
                                        <AntDesign name="right" size={20} style={styles.icon} color={colors.txt} />
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
        backgroundColor: 'pink',
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