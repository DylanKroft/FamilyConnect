import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player';
import styled from 'styled-components'
import MsgItem from './MsgItem';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { db } from './index.js';


const MessageModal = ({showMsgModal, setShowMsgModal, messages, getMessages, email}) => {

    const [selected, setSelected] = useState(null);
    const [sender, setSender] = useState();
    const [vidLink, setVidLink] = useState();
    const [playable, setPlayable] = useState(false);
    const [selectedVid, setSelectedVid] = useState();

    const storage = getStorage();
    const player = useRef(null);



    const closeModal = () => {
        setShowMsgModal(false);
    }

    const goBack = () => {
        getMessages();
        setPlayable(false);
        setSelected(null);
        setVidLink(null);
    }

    const replayVid = () => {
        getMessages();
        player.current.seekTo(0, "seconds");        
    }

    const markAsViewed = async () => {
        const docRef = doc(db, "videos", email);
        const docSnap = await getDoc(docRef);
        let arr = docSnap.data().received;
        for (const vid of arr) {
          if (vid.video === selectedVid) {
            vid.viewed = true;
            await updateDoc(docRef, {received: arr});
          }
        }
    
      }

    useEffect(() => {
        if (selected !== null) {
            let vid = messages[selected].video;
            getVid(vid);
            setSelectedVid(vid);
        }
    }, [selected])

    const getVid = async (vidLink) => {
        if (vidLink === undefined || vidLink === null) return;
        const reference = ref(storage, vidLink);
        await getDownloadURL(reference).then(vid => {
          setVidLink(vid);
        })
      }
    
  
    return (
    <>
    {showMsgModal && <Container>
        <Modal>
            {selected !== null && <VideoBox>
                <MsgHeader>You are watching a message from {sender}</MsgHeader>
                <VideoSection>
                    <Loading>LOADING</Loading>
                    <ReactPlayer 
                        style={{"zIndex": 1}}
                        url={vidLink} 
                        playing={playable}
                        height={1000}
                        width={1000}
                        loop={false}
                        ref={player}
                        onReady={() => setPlayable(true)}
                        onPlay={markAsViewed}
                    />
                </VideoSection>
                <Footer>
                    <Close onClick={goBack}>BACK</Close>
                    <Replay onClick={replayVid}>REPLAY</Replay>
                </Footer>
            </VideoBox>}
            {selected === null && <>
                {messages.length <= 10 && <MsgHeader>Click on a message to view it!</MsgHeader>}
                {messages.length > 10 && <MsgHeader>Drag the list upwards to view more messages</MsgHeader>}
                    <MsgSection>
                        <Inner>
                        {
                            messages.length > 0 && messages.map((item, index) => (
                                <MsgItem
                                idx={index}
                                key={index} 
                                setSelected={setSelected}
                                senderName={item.senderName}
                                sentTime={item.time.seconds}
                                setSender={setSender}
                                viewed={item.viewed}
                                />
                            ))
                        }
                        </Inner>
                    </MsgSection>
                <Footer>
                    <Close onClick={closeModal}>CLOSE</Close>
                </Footer>
            </>}
        </Modal>
    </Container>}
    </>
  )
}

export default MessageModal


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
  background-color: white;
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
  height: 10%;
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
  z-index: 100;
`

const MsgSection = styled.div`
  display: flex;
  background-color: lightgray;
  align-items: flex-end;
  justify-content: center;
  height: 80%;
  width: 100%;

`

const MsgHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #708090;
    color: white;
    font-size: 1.5em;
    font-weight: 600;
    height: 10%;
`

const Inner = styled.div`
    width: 100%;
    height: calc(100% - 20px);
    overflow-y: scroll;
    overflow-x: hidden;

`

const VideoBox = styled.div`
    height: 100%;
`

const VideoSection = styled.div`
  display: flex;
  background-color: lightgray;
  align-items: center;
  justify-content: center;
  height: 80%;
  width: 100%;
  overflow: hidden;
`

const Replay = styled.div`
  flex: 1;
  background-color: orange;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3em;
  font-weight: 800;
  z-index: 100;
`

const Loading = styled.div`
    text-align: center;
    width: 100%;
    position: absolute;
    font-size: 3em;
    font-weight: 800;
    color: white;
`