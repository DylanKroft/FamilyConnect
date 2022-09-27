import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react'
import MessageBar from '../MessageBar';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { db } from '../../firebase';
import VideoModal from '../VideoModal';
import Title from './Title';
import {LinearGradient} from 'expo-linear-gradient';
import { getData, storeData } from '../../data';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function MessagesScreen({docId}) {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const docRef = doc(db, "videos", docId);
  const storage = getStorage();

  const [messages, setMessages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [videoLink, setVideoLink] = useState();
  const [video, setVideo] = useState();
  const [videoViewed, setVideoViewed] = useState(false);
  const [idx, setIdx] = useState();
  

  const getMessages = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let tempMsgs = docSnap.data().received.sort((a,b) => b.time - a.time);
      setMessages(tempMsgs);
      //storeData("messages", null);
    }
  }

  const getCachedMessages = async () => {
    let cachedMessages = await getData("messages");
    if (cachedMessages != undefined && cachedMessages != null) {
      setMessages(cachedMessages);
    } else {
      if (docRef == null) return;
      getMessages();
    }
  }
 
  useEffect(() => {
    getMessages();
  }, [])

  useEffect(() => {
    const getVid = async () => {
      if (videoLink === undefined || videoLink === null) return;
      const reference = ref(storage, videoLink);
      await getDownloadURL(reference).then(vid => {
        setVideo(vid);
      })
    }
    getVid();
  }, [videoLink])

  return (
    <>
      <VideoModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} video={video} setVideoViewed={setVideoViewed}/>
      <LinearGradient
        colors={['rgba(0, 199, 190, 0.1)', 'white']}
        style={styles.background}
        start={{ x: -0.5, y: -0.75 }}
        end={{ x: 0.5, y: 0.5 }}
      />
      <View style={styles.refreshContainer}>
        
      </View>
      
      <ScrollView 
        contentContainerStyle={{flexGrow: 1}} 
        style={styles.ScrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
      {!messages || messages.length < 0 && <View style={styles.loadingBox}><ActivityIndicator/></View>}
        <View style={{height: "1%"}}></View>
        {
          messages.length > 0 && messages.map((item, index) => (
            <MessageBar
              idx={idx}
              setIdx={setIdx}
              key={index} 
              index={index}
              docId={docId} 
              sender={item.senderName} 
              date={item.time.seconds} 
              viewed={item.viewed} 
              setModalVisible={setModalVisible} 
              setVideoLink={setVideoLink} 
              link={item.video}
              videoViewed={videoViewed}
              getMessages={getMessages}
            />
        ))
        }
      <View style={styles.filler}/>
      </ScrollView>
      <Title title={"Messages"}/>
    </>
  )
}


const styles = StyleSheet.create({

  filler: {
    height: 120,
  },

  background: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },


  ScrollView: {
      flex: 1,
    },

  loadingBox: {
      flex: 1,
      justifyContent: "center",
      height: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
    },

    refreshButton: {
      position: "absolute",
      backgroundColor: "rgb(0, 199, 190)",
      right: 0,
      marginRight: 20,
      borderRadius: 100,
      bottom: 0,
      height: 30,
      width: 70,
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
    },

    refreshContainer: {
      zIndex: 1000,
      position: 'relative',
      height: "12%",
      display: 'flex',
      right: 0,
      width: "100%",
    },

    refreshText: {
      color: "white",
      fontWeight: "600"
    },

})