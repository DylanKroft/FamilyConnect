import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";
import { Video, Audio } from 'expo-av';
import { BlurView } from "expo-blur";


export default function VideoModal({isModalVisible, setModalVisible, video, setVideoViewed}) {

    const [status, setStatus] = useState({});
    const [checkStatus, setCheckStatus] = useState(true);

    const handleCloseModal = () => {
        setModalVisible(false);
        setCheckStatus(true);
        setVideoViewed(false);
    }

    useEffect(() => {
        Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    }, []);

    useEffect(() => {
        if (status.isPlaying && checkStatus) {
            setVideoViewed(true);
            setCheckStatus(false);
        }
    }, [status])
BlurView
  return (
    <Modal isVisible={isModalVisible}>
        <BlurView style={styles.container}>
        {!video && <View style={styles.videoHolder}/>}
        {video && <Video 
            style={styles.video}
            source={{uri: video}}
            useNativeControls
            resizeMode="cover"
            shouldPlay={true}
            playsInSilentModeIOS={true}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
        />}
        <View style={styles.loadingBox}><ActivityIndicator /></View>
        <BlurView style={styles.closeModalButton} intensity={70} tint="dark">
            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                <Text style={{fontWeight: "600", fontSize: 16, color: "white"}}>Done</Text>
            </TouchableOpacity>
        </BlurView>
        </BlurView>
    </Modal>
  )
}

const styles = StyleSheet.create({
    
    button: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },

    container: {
        flex: 1,
        display: "flex",
        width: "100%",
        height: "92%",
        margin: 0,
        position: "absolute",
        borderRadius: 15,
        overflow: "hidden",
        display: "flex",
    },

    closeModalButton: {
        width: "100%",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },  

    loadingBox: {
        flex: 1,
        justifyContent: "center",
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        position: "absolute",
        width: "100%",
      },

    video: {
        height: "100%",
        flex: "1",
        zIndex: 100,
    },

    videoHolder: {
        height: "100%",
        flex: "1",
    }
    

})