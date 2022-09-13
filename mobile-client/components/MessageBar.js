import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react'
import moment from "moment";
import { collection, getDoc, doc, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from '../firebase';
import placeholder from "../assets/placeholder.png"

export default function MessageBar({index, sender, date, viewed, setModalVisible, setVideoLink, link, docId, videoViewed, idx, setIdx, getMessages}) {
  
  const docRef = doc(db, "videos", docId);
  const [isViewed, setIsViewed] = useState(viewed);

  const showModal = () => {
    setVideoLink(link);
    setModalVisible(true);
    setIdx(index);
    getMessages();
  }

  useEffect(() => {
    if (!isViewed && videoViewed && index === idx) {
      markAsViewed();
    }
  }, [videoViewed, isViewed, index, idx])

  const markAsViewed = async () => {
    const docSnap = await getDoc(docRef);
    let arr = docSnap.data().received;
    for (const vid of arr) {
      if (vid.video === link) {
        vid.viewed = true;
        setIsViewed(true);
        await updateDoc(docRef, {received: arr});
        const a = await getDoc(docRef);
      }
    }

  }

  return (
    <TouchableOpacity style={styles.container} onPress={showModal}>
        <View style={styles.imageContainer}>
          <Image style={styles.imgSmall} source={placeholder}/>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.senderText}>{sender}</Text>
            <View style={styles.datePill}>
                <Text style={styles.dateText}>
                    {moment(date*1000).fromNow()}
                </Text>
            </View>
            <View style={isViewed ? styles.pillViewed : styles.pill}>
                <Text style={styles.viewText}>
                    {isViewed ? "viewed" : "view"}
                </Text>
            </View>
        </View>
        <View></View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

    imageContainer: {
      backgroundColor: "rgba(0, 199, 190, 0.2)",
      height: "60%",
      borderRadius: 500,
      aspectRatio: 1,
      margin: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    container: {
        backgroundColor: "white",
        height: 65,
        width: "90%",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "left",
        display: "flex",
        flexDirection: "row",
        marginHorizontal: "5%",
        marginTop: 7.5,
        overflow: "hidden",
        borderColor: 'lightgray',
        borderWidth: 0.5,
      },

      textContainer: {
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        flexDirection: "row",
      },

      senderText: {
        fontSize: 18,
        flex: 1,
      },

      dateText: {
        fontSize: 12,
        color: "rgb(88, 86, 214)",
        fontWeight: "600",
      },

      pill: {
        backgroundColor: "rgb(52, 199, 89)",
        borderRadius: "100%",
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
      },

      pillViewed: {
        backgroundColor: "rgb(255, 149, 0)",
        borderRadius: "100%",
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
      },

      datePill: {
        borderColor: "rgb(88, 86, 214)",
        borderRadius: "100%",
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        borderWidth: 1,
      },

      viewText: {
        fontWeight: "600",
        color: "white",
        fontSize: 12,
      },

      imgSmall: {
        height: "70%",
        aspectRatio: 1,
        resizeMode: 'contain',
      }


    



})