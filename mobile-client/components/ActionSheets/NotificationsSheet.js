import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import SwitchSelector from "react-native-switch-selector";

export default function NotifcationsSheet({email, setNotifications, notifCount}) {

    const options = [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 }
      ];
  

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.notificationsPerDayBox}>
        <Text style={styles.text}>Notifications per day</Text>
        <SwitchSelector
            options={options}
            initial={notifCount}
            onPress={value => setNotifications(value)}
            buttonColor="rgb(0,199,190)"
            borderColor="lightgray"
            hasPadding
        />
      <Text style={styles.top}>For one notification, it will be sent around noon.</Text>
      <Text style={styles.txt}>For two, the second will be sent in the evening.</Text>
      <Text>For three, the third will be sent in the morning.</Text>
        </View>
      </View>
      

    </View>
  )
}

const styles = StyleSheet.create({

    container: {
        height: "25%",
        margin: 30,
    },

    inner: {
      height: 150,
      display: 'flex',
      justifyContent: 'space-between',
      display: "flex",
      alignItems: "center",
    },

    notificationsPerDayBox: {
        width: "100%",
    },

    text: {
        padding: 5,
        fontSize: 18,
        marginBottom: 15,
        fontWeight: "600"
    },

    top: {
      marginTop: 30,
      marginBottom: 2.5,
    },

    txt: {
      marginBottom: 2.5,
    }

})