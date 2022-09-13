import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { RotatingLines } from 'react-loader-spinner'


const PhotoBox = ({setShow, name, setCurrentName, imgRef, setCurrentEmail, email, setShowMsgModal}) => {

  const [image, setImage] = useState(null);
  const storage = getStorage();


  const openModal = () => {
    setCurrentName(name);
    setCurrentEmail(email);
    setShow(true);
  }

  const openMsgModal = () => {
    setShowMsgModal(true)
  }

  useEffect(() => {
    const reference = ref(storage, imgRef);
    getDownloadURL(reference).then(img => {
      setImage(img);
    })
  }, [imgRef])

  return (
    <Container>
      <Inner>
        <PictureBox onClick={openModal}>    
          {!image && <LoadingContainer><RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="50"
            visible={true}
          /></LoadingContainer>}
          {image && imgRef !== "placeholder.png" && <img className='homeImages' src={image}/>}
          {image && imgRef === "placeholder.png" && <img className='homeImagesSmall' src={image}/>}

        </PictureBox>
        <BottomBar>{name}</BottomBar>
      </Inner>
    </Container>
    
  )
}

export default PhotoBox

const Container = styled.div`
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

const Inner = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const PictureBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 5;
    background-color: rgb(224,224,224);
    width: 100%;
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    position:relative;

`

const BottomBar = styled.div`
    flex: 1;
    background-color: lightgray;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    border-radius: 0px 0px 20px 20px;
`


const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 100;
`