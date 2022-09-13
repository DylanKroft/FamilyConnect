import './App.css';
import styled from 'styled-components'
import Home from './Home';
import { useEffect, useState } from 'react';
import Login from './Login';
import { db } from './index.js'
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { Dna } from 'react-loader-spinner'

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyPictures, setFamilyPictures] = useState([]);
  const [familyNames, setFamilyNames] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);


  const getFamily = async () => {
    setFamilyMembers([]);
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const mail = doc.data().email;
      if (mail === email && doc.data().name != null) {
        setName(doc.data().name);
        setFamilyMembers(doc.data().associates);
        getData();
      }
    });
  }

  const getData = async () => {
    setFamilyPictures([]);
    setFamilyNames([]);
    for (const member of familyMembers) {
      const docRef = doc(db, "users", member);
      const contactSnap = await getDoc(docRef);
      
      const imgRef = contactSnap.data().picture ? contactSnap.data().picture :  "placeholder.png";

      let pictures = familyPictures;
      pictures.push(imgRef);
      setFamilyPictures(pictures);

      const nameRef = contactSnap.data().name ? contactSnap.data().name :  "Family Member";
      let names = familyNames;
      names.push(nameRef);
      setFamilyNames(names);

      if (familyMembers.length <= familyNames.length) {
        setDataLoaded(true);
      }
    }
  }

  useEffect(() => {
    getFamily();
  }, [loggedIn, name === null])

  return (
    <>
      {!loggedIn && <Login setLoggedIn={setLoggedIn} setMail={setEmail}/>}
      {!dataLoaded && loggedIn && <LoadingContainer><Dna
            visible={true}
            height="100"
            width="100"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        /></LoadingContainer>}
      {loggedIn && dataLoaded && <Home 
        setLoggedIn={setLoggedIn} 
        familyNames={familyNames} 
        dataLoaded={dataLoaded} 
        familyPictures={familyPictures}
        familyMembers={familyMembers}
        username={name}
        email={email}
      />}      
    </>
  );
}

export default App;


const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 100;
`