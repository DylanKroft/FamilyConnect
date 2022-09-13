import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from "react";
import { BlurView } from 'expo-blur';
import { storeData, getData } from '../data';
import CachedImage from 'react-native-expo-cached-image';
import placeholder from "../assets/placeholder.png"


export default function ProfileCard(props) {

  const [loaded, setLoaded] = useState();

  const showModal = () => {
    props.setModalVisible(true);
    props.setRecipient(props.name);
    props.setReceiverEmail(props.email);
  }


  return (
    <TouchableOpacity style={styles.container} onPress={showModal}>
      <BlurView intensity={40} tint="dark"  style={styles.imageContainer}>
        {!loaded && <View style={styles.loadingBox}><ActivityIndicator /></View>}
        {props.resize && <Image style={styles.imgSmall}  source={placeholder} onLoad={() => setLoaded(true)}/>}
        {!props.resize && <CachedImage style={styles.img}  source={{uri:props.img}} onLoad={() => setLoaded(true)}/>}
      </BlurView>
      <BlurView intensity={20} tint="dark" style={styles.textBar}>
        <Text style={styles.cardName}>{props.name}</Text>
      </BlurView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "2%",
    width: "40%",
    overflow: "hidden",
    borderRadius: 10,
  },

  imageContainer: {
    width: "100%",
    height: "40%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  textBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10%",
    width: "100%",
  },

  img: {
    width: "100%",
    height: "100%",
  },

  imgSmall: {
    width: "50%",
    height: "50%",
    resizeMode: 'contain',

  },

  loadingBox: {
    flexGrow: 1,
    justifyContent: "center",
    height: "100%",
    flexDirection: "row",
    position: "absolute",
  },

  cardName: {
    fontSize: 16,
  }
});