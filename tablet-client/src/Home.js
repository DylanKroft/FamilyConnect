import React, { useEffect } from 'react'
import styled from 'styled-components'
import PhotoBox from './PhotoBox'
import { useState } from 'react';
import CameraModal from './CameraModal';
import { getAuth, signOut } from "firebase/auth";
import MessageModal from './MessageModal';
import {
  useRecordWebcam,
  CAMERA_STATUS
} from "react-record-webcam";
import { db } from './index.js';
import { collection, getDoc, doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"; 
import { BsMailbox } from 'react-icons/bs';
import { IconContext } from 'react-icons';

const OPTIONS = {
    filename: "test-filename",
    fileType: "webm",
  };

const Home = ({setLoggedIn, familyNames, familyPictures, familyMembers, username, email}) => {

    const [show, setShow] = useState(false);
    const [showMsgModal, setShowMsgModal] = useState(false);

    const [currentName, setCurrentName] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [messages, setMessages] = useState([]);

    const recordWebcam = useRecordWebcam(OPTIONS);
    const docRef = doc(db, "videos", email);

    const getMessages = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let tempMsgs = docSnap.data().received.sort((a,b) => b.time - a.time);
          setMessages(tempMsgs);
        }
    }

    const openMsgsModal = () => {
        getMessages();
        setShowMsgModal(true);
    }

    useEffect(() => {
        getMessages();
    }, [])


    const logOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            setLoggedIn(false);
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        if (show) {
            recordWebcam.open();
        } else {
            recordWebcam.close();
        }
    }, [show])

  return (
    <Container>
        <Logout onClick={logOut}>Log out</Logout>
        <MessageModal 
            showMsgModal={showMsgModal} 
            setShowMsgModal={setShowMsgModal} 
            name={currentName} 
            sentFrom={currentEmail} 
            email={email} 
            messages={messages} 
            getMessages={getMessages}
        />
        {< CameraModal show={show} setShow={setShow} name={currentName} recipient={currentEmail} recordWebcam={recordWebcam} username={username}/>}
        <Header>Hi {username}, Connect With Your Family!</Header>
        {<Matrix>
                {
            familyNames.map((item, index) => (
                <PhotoBox 
                    key={index}
                    setShow={setShow}
                    name={familyNames[index]}
                    email={familyMembers[index]}
                    imgRef={familyPictures[index]}
                    setCurrentName={setCurrentName}
                    setCurrentEmail={setCurrentEmail}
                    setShowMsgModal={setShowMsgModal}
                /> 
            ))
            }
            {familyNames !== undefined && familyNames.length === 1 && <Temp/>}

        </Matrix>}
        <Footer onClick={openMsgsModal}>
            <IconContext.Provider
                value={{ color: 'white', size: '2em' }}
                >
                <div style={{marginRight: "20px"}}>
                    <BsMailbox />
                </div>
            </IconContext.Provider>
            Click Here For Your Mailbox
            </Footer>
    </Container>
  )
}

export default Home

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`

const Matrix = styled.div`
    flex:6;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 80%;
    columns: 2 auto;

`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: gray;
    width: 100%;
    font-size: 2em;
    font-weight: 600;
    color: white;
    height: 10%;

`

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #708090;
    width: 100%;
    font-size: 2em;
    font-weight: 600;
    color: white;
    height: 10%;
    
`

const Logout = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: darkgray;
    color: white;
    padding: 5px 10px 5px 10px;
    border-radius: 100px;
`

const PlaceHolder = styled.div`
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    font-weight: 600;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;   
`

const Temp = styled.div`
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    font-weight: 600;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 50%;
`