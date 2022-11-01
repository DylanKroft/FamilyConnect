import React, { useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'


const MsgItem = ({sentTime, idx, setSelected, senderName, setSender, viewed}) => {

  const openMsg = () => {
    setSelected(idx);
    setSender(senderName);
  }

  return (
    <Container onClick={openMsg}>
      <Left>Message from {senderName} sent {moment(sentTime*1000).fromNow()}</Left>
      {!viewed && <RightGreen>NEW MESSAGE</RightGreen>}
      {viewed && <RightGray>MESSAGE OPENED</RightGray>}

    </Container>
  )
}

export default MsgItem

const Container = styled.div`
    height: 100px;
    width: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(235, 235, 240);
    margin: 0px 20px 20px 20px;
    border-radius: 20px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
    -moz-box-shadow: rgba(0,0,0,0.3) 0 1px 3px;
    box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
`

const Left = styled.div`
  flex: 1;
  padding-left: 30px;
  font-size: 1.25rem;
  font-weight: 600;
`

const RightGreen = styled.div`
  padding: 10px 15px 10px 15px;
  background-color: rgb(36, 138, 61);
  font-weight: 600;
  color: white;
  margin-right: 20px;
  border-radius: 500px;
`

const RightGray = styled.div`
  padding: 10px 15px 10px 15px;
  background-color: rgb(108, 108, 112);
  font-weight: 600;
  color: white;
  margin-right: 20px;
  border-radius: 500px;
`