import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, LogBox } from 'react-native';
import Modal from "react-native-modal";
import { Camera, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { collection, getDoc, doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"; 
import { db } from "../firebase";
import 'react-native-get-random-values';
import {v4} from 'uuid';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import CountDown from 'react-native-countdown-component';

export default function CameraModal({isModalVisible, setModalVisible, recipient, email, docId, name, showToast}) {

    let cameraRef = useRef();
    const [hasPermission, setHasPermission] = useState(null);
    const [hasMicAccess, setHasMicAccess] = useState(null);
    const [type, setType] = useState(CameraType.front);
    const [recording, setRecording] = useState(false);
    const [video, setVideo] = useState();

    const storage = getStorage();

    const startRecording = async () => {
        setRecording(true);
        let options = {
            quality: 480,
            maxDuration: 30,
            mirror: true,
        };

        const data = await cameraRef.current.recordAsync(options)
        LogBox.ignoreLogs(["EventEmitter.removeListener"]);
        setVideo(data);
        setRecording(false);
    }

    const stopRecording = async () => {
        setRecording(false);
        if (cameraRef.current != null) {
            cameraRef.current.stopRecording();
        }
    }

    const handleCloseModal = () => {
        stopRecording();
        setModalVisible(false);
    }

    const saveToReceived = async (vidName) => {
        const docRef = doc(db, "videos", email);
        const date = new Date();
        let videoObj = {
            senderName: name,
            senderUsername: docId,
            time: date,
            video: vidName,
            viewed: false,
        }
        await updateDoc(docRef, {
            received: arrayUnion(videoObj)
        });
        
    }

    const sendVideo = async () => {
        if (storage === undefined || storage === null) return;
        const vidName = `videos/${"video" + v4()}`
        const bucketRef = ref(storage, vidName)
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", video.uri, true);
            xhr.send(null);
        });
        uploadBytes(bucketRef, blob).then(() => {
            saveToReceived(vidName);
            showToast(recipient);
            setVideo();
        })
        handleCloseModal();
    }
    

    const handleSendVideo = () => {     
        LogBox.ignoreLogs(["EventEmitter.removeListener"]);   
        Alert.alert(
            `Send video to ${recipient}?`,
            "",
            [{text: "Cancel", style: "cancel",},{text: "OK",onPress: () => {sendVideo()},style: "confirm",},],{cancelable: true,});
    }
 
    useEffect(() => {
        (async () => {
          const cameraPermission = await Camera.requestCameraPermissionsAsync();
          const micPermission = await Camera.requestMicrophonePermissionsAsync();

          setHasPermission(cameraPermission.status === 'granted');
          setHasMicAccess(micPermission.status === 'granted');

        })();
      }, []);
    
      if (hasPermission === undefined || hasMicAccess === undefined) {
        return <View />;
      }
      if (hasPermission === false || hasMicAccess === false) {
        return <Text>No access to camera or microphone</Text>;
      }
  
    return (
        <Modal isVisible={isModalVisible}>
            <BlurView style={styles.container} intensity={80} tint="dark">
                {video && <>
                <View style={styles.videoContainer}>
                    {<Video 
                        style={styles.video}
                        source={{uri: video.uri}}
                        useNativeControls
                        resizeMode="cover"
                    />}
                    <View style={styles.sendContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                        <Ionicons style={styles.icon} name="close-circle-outline" color={"white"} size={36}></Ionicons>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendVideo}>
                            <Ionicons style={styles.icon} name="paper-plane-outline" color={"white"} size={36}></Ionicons>
                        </TouchableOpacity>
                    </View>
                </View>
                </>}
                {!video && <View style={styles.closeModalButton}>
                    <Text style={{fontWeight: "800", fontSize: 24, color: "white", marginLeft: 20}} onPress={handleCloseModal}>X</Text>
                    {!video && recording && 
                        <CountDown
                            until={30}
                            size={20}
                            timeToShow={['S']}
                            timeLabels={{s: null}}
                            digitStyle={styles.digitStyle}
                            digitTxtStyle={styles.digitStyleText}
                        />
                    }
                </View>}
                {!video && <Camera style={styles.camera} type={type} ref={cameraRef}></Camera>}
                {!video && <View style={styles.cameraControl}>
                    <TouchableOpacity style={recording ? styles.recordButtonStarted : styles.recordButton} onPress={recording ? stopRecording : startRecording}/>
                </View>}
            </BlurView>
        </Modal>
    );
  }


  const styles = StyleSheet.create({
    
    digitStyleText:  {
        fontSize: 16,
        padding: 0,
        fontWeight: '400'
    },

    digitStyle: {
        backgroundColor: "rgb(2555, 149, 0)",
        position: "absolute",
        zIndex: 100000,
        height: 25,
        borderRadius: 100,
        right: 15,
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
    },

    videoContainer: {
        flex: 1,
        width: "100%",
        height: "92%",
        margin: 0,
        borderRadius: 15,
    },

    camera: {
        height: "85%",
    },

    closeModalButton: {
        height: 30,
        width: "100%",
        position: "absolute",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 500,
        margin: 15,
        marginHorizontal: 0,
        flexDirection: "row",
    },  

    cameraControl: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        display: "flex",
        width: "100%",
        flexDirection: "row",
        maxHeight: 100,
    },

    recordButton: {
        backgroundColor: "rgb(255, 59, 48)",
        height: 60,
        width: 60,
        borderRadius: "100%",
        borderWidth: 3,
        borderColor: "white",
    },

    recordButtonStarted: {
        backgroundColor: "rgb(255, 59, 48)",
        height: 60,
        width: 60,
        borderRadius: "100%",
        borderWidth: 12,
        borderColor: "white",
    },

    sendButton: {
        backgroundColor: "rgb(52, 199, 89)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
    },

    cancelButton: {
        backgroundColor: "rgb(255, 149, 0)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
    },
    
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    
    video: {
        height: "85%",
        width: "100%",
    },

    sendContainer: {
        display: "flex",
        width: "100%",
        flex: 1,
        flexDirection: 'row',
    },
    loadingBox: {
        justifyContent: "center",
        alignItems: "center",
        height: "85%",
        position: "absolute",
        zIndex: "100",
        width: "100%",
        display: "flex",
    },
    
    loadingBoxInner: {
        backgroundColor: "gray",
        padding: 20,
        backgroundColor: "lightgray",
        borderRadius: 10,
    }
  })
