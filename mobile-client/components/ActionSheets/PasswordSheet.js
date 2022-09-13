import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function PasswordSheet({email, savePassword}) {

    const sendPasswordEmail = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
          .then(() => {
            alert("Password reset email sent!");
            savePassword();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.text}>Send a password reset email</Text>
        <TouchableOpacity style={styles.button} onPress={sendPasswordEmail}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
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

    button: {
      backgroundColor: "rgb(0,199,190)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 500,
      width: "35%",
    },

    buttonText: {
      padding: 10,
      color: "white",
      fontWeight: "600",
      fontSize: 16,
    },

    text: {
        padding: 5,
        fontSize: 18,
        marginTop: 30,
    }

})