import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import React, { useState } from 'react'

export default function FamilyBar({email, name, isPending, removeMember}) {

    const [newEmail, setNewEmail] = useState("");
    const [clear, setClear] = useState(false);

  return (
    <View style={styles.familyBox}>
        <TouchableOpacity onPress={removeMember} style={styles.xButton}><Text style={styles.xButtonText}>X</Text></TouchableOpacity>
        <View style={styles.info}>
            <View style={[styles.infoLeft, isPending ? styles.PendingBox : ""]}><Text style={isPending ? styles.Pending : styles.notPending}>{isPending ? "Pending" : name}</Text></View>
            <View style={styles.infoRight}><Text>{email}</Text></View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({

    xButton: {
        backgroundColor: "rgb(255, 59, 48)",
        borderRadius: 100,
        height: 25,
        width: 25,
        marginRight: 10,
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },

    Pending: {
        color: "white",
        fontWeight: "600",
    },

    PendingBox: {
        backgroundColor: "rgb(255, 149, 0)"
    },

    xButtonText: {
        color: "white",
        fontWeight: "800",
        fontSize: 12,
    },

    info: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 100,
        display: 'flex',
        flexDirection: "row",
        overflow: 'hidden',
    },

    infoLeft: {
        borderRightWidth: 1,
        borderRightColor: "lightgray",
        padding: 10,
    },

    infoRight: {
        borderRightWidth: 0,
        borderRightColor: "lightgray",
        padding: 10,
    },

    familyBox: {
        width: "100%",
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    inner: {
      height: 150,
      display: 'flex',
      justifyContent: 'space-between',
      display: "flex",
      alignItems: "center",
    },

})