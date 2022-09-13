import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Webcam from "react-webcam";
import {v4} from 'uuid';
import { uploadBytes, getStorage, ref } from '@firebase/storage';
import { useReactMediaRecorder } from "react-media-recorder";
import { collection, getDoc, doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"; 
import { db } from './index.js';
import {
  useRecordWebcam,
  CAMERA_STATUS
} from "react-record-webcam";


// help from https://codesandbox.io/s/elastic-dhawan-xwymeu?file=/src/App.js:264-274

const CameraModal = ({show, setShow, name, recipient, recordWebcam, username}) => {

  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const storage = getStorage();

  const getRecordingFileHooks = async () => {
    const blob = await recordWebcam.getRecording();
    const vidName = `videos/${"video" + v4()}`
    const bucketRef = ref(storage, vidName);
    uploadBytes(bucketRef, blob).then(() => {
      saveToReceived(vidName);
      console.log("uploaded");
    })
  };

  const saveToReceived = async (vidName) => {
    const docRef = doc(db, "videos", recipient);
    const date = new Date();
    let videoObj = {
        senderName: username,
        senderUsername: username+"-temp",
        time: date,
        video: vidName,
        viewed: false,
    }
    await updateDoc(docRef, {
        received: arrayUnion(videoObj)
    });
    
}

  const startRecording = () => {
    recordWebcam.start();
    setRecording(true);
    setRecorded(true);
  }

  const stopRecording = () => {
    recordWebcam.stop();
    recordWebcam.close();
    setRecording(false);
  }

  const cancelCloseRecording = () => {
    recordWebcam.stop();
    recordWebcam.close();
    setShow(false);
    setRecorded(false);
    setRecording(false);
  }

  const uploadRecording = () => {
    getRecordingFileHooks();
    setRecording(false);
    setRecorded(false);
    setShow(false);
  }


  return (
    <>
    {show && <Container>
      <Modal>
        {!recording && recorded && <Title>Send your recorded video to {name} </Title>}
        {!recording && !recorded && <Title>Record a video for {name}</Title>}
        {recording && <Title>You are currently recording a video</Title>}
        <VideoSection>
      <div>
        <VideoContainer>
          {recordWebcam.previewRef && <LoadingText>LOADING</LoadingText>}

          <Inner>
            <video
              ref={recordWebcam.webcamRef}
              style={{
                zIndex: 10,
                width: "100%",
                display: `${
                  recordWebcam.status === CAMERA_STATUS.OPEN ||
                  recordWebcam.status === CAMERA_STATUS.RECORDING
                    ? "block"
                    : "none"
                }`
              }}
              autoPlay
              muted
            />
            <video
              ref={recordWebcam.previewRef}
              style={{
                zIndex: 10,
                width: "100%",
                display: `${
                  recordWebcam.status === CAMERA_STATUS.PREVIEW ? "block" : "none"
                }`
              }}
              autoPlay loop
            />
          </Inner>
        </VideoContainer>
      </div>
        </VideoSection>
        <Footer>
          {!recording && <Close onClick={cancelCloseRecording}>CANCEL</Close>}
          {!recording && !recorded && <Record onClick={startRecording}>RECORD</Record>}
          {recorded && !recording && <Send onClick={uploadRecording}>SEND</Send>}
          {recording && <Record onClick={stopRecording}>DONE</Record>}
        </Footer>
      </Modal>
    </Container>}
    </>
    )

}

export default CameraModal

const Container = styled.div`

    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.9);
    position: absolute;
    z-index: 200;
`

const Modal = styled.div`
  width: 80%;
  height: 80%;
  background-color: black;
  left: 10%;
  top: 10%;
  position: absolute;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const Footer = styled.div`
  background-color: gray;
  width: 100%;
  display: flex;
  height: 15%;
`

const VideoSection = styled.div`
  display: flex;
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 85%;
  width: 100%;
  z-index: 100;
`

const Close = styled.div`
  flex: 1;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3em;
  font-weight: 800;
`

const Record = styled.div`
  flex: 1;
  background-color: orange;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3em;
  font-weight: 800;
`

const Send = styled.div`
  flex: 1;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3em;
  font-weight: 800;
`

const Title = styled.div`
  background-color: gray;
  text-align: center;
  color: white;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  height: 10%;
`

const LoadingText = styled.div`
  color: white;
  font-size: 3em;
  z-index: 0;
  font-weight: 600;
  position: absolute;
`

const VideoContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 80%;
  top: 9%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Inner = styled.div`
  z-index: 100;
`