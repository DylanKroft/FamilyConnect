import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React from 'react'

export default function Sheet() {
  return (
    <View style={styles.container}>
      <Text>Sheet</Text>
    </View>
  )
}

const styles = StyleSheet.create({

    container: {
        height: "50%",
    }

})