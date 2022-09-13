import React, { useState } from 'react'
import styled from 'styled-components'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const Login = ({setLoggedIn, setMail}) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const logIn = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setMail(email);
                setLoggedIn(true);
                setEmail();
                setPassword();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            });
    }

  return (
    <Container>
        <Main>
            <Title>Login</Title>
            <InputBox>
                <input className='inputBox username' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="password" className='inputBox' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </InputBox>
            <ButtonBox>
                <Button onClick={logIn}><ButtonText>Log In</ButtonText></Button>
            </ButtonBox>

        </Main>
    </Container>
  )
}

export default Login

const Container = styled.div`
    background-image: linear-gradient(217deg, rgba(138,43,226, 0.8), rgba(138,43,226, 0) 70.71%), linear-gradient(127deg, rgba(230,230,250, 0.8), rgba(230,230,250, 0) 70.71%), linear-gradient(336deg, rgba(173,216,230, 0.8), rgba(230,230,250, 0) 70.71%);
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Main = styled.div`

    height: 40%;
    aspect-ratio: 0.7;
    background-color: white;
    border-radius: 20px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
    -moz-box-shadow: rgba(0,0,0,0.3) 0 1px 3px;
    box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50px;
`

const Title = styled.div`
    font-size: 2em;
    font-weight: 800;
    color: #8A2BE2;
    flex-direction: column;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: end;    
`

const InputBox = styled.div`

    width: 100%;
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;   

`

const ButtonBox = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: center;

`

const Button = styled.div`
    background-color: #8A2BE2;
    width: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 50px;
    width: 70%;
    border-radius: 500px;
    transition-duration: 0.2s;

    :active {
        transform: scale(0.7);
    }
`

const ButtonText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.5em;
`