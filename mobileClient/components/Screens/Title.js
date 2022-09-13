import { StyleSheet, Text, View, LogBox } from 'react-native';
import React from 'react'
import { BlurView } from 'expo-blur';

export default function Title({title}) {
  return (
    <BlurView intensity={50} style={styles.container}>
      <Text style={styles.titleWords}>{title}</Text>
    </BlurView>
  )
}

const styles = StyleSheet.create({

    container: {
      height: "12.5%",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-end",
      position: 'absolute',
        zIndex: 999,
        left: 0,
        right: 0,
        top: 0,
    },

    titleWords: {
      fontSize: 32,
      paddingLeft: 20,
      paddingBottom: 2,
      fontWeight: "700",
    }

})