import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import React, { useState } from 'react'
import { collection, getDoc, doc } from "firebase/firestore"; 

export default function NameSheet({name, saveName}) {

  const [inputName, setInputName] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TextInput
          placeholder={name}
          value={inputName}
          onChangeText={text => setInputName(text)}
          style={styles.input}
        />  
        <TouchableOpacity style={styles.button} onPress={() => saveName(inputName)}>
          <Text style={styles.buttonText}>Save</Text>
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

    input: {
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
      padding: 10,
      fontSize: 16,
      width: "100%",
      marginTop: 10,
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
    }

})