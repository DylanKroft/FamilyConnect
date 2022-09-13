import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from "react";
import ProfileCard from '../ProfileCard';
import CameraModal from '../CameraModal';
import { db } from '../../firebase';
import { collection, getDoc, doc } from "firebase/firestore"; 
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import Toast from 'react-native-toast-message';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Title from './Title';
import { storeData, getData } from '../../data';
import {LinearGradient} from 'expo-linear-gradient';

export default function HomeScreen({docId, name, setFamily, family}) {

  const [isModalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState();
  const [recipient, setRecipient] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const docRef = doc(db, "users", docId);
  const storage = getStorage();
  const tabBarHeight = useBottomTabBarHeight();
  const [showWelcomeText, setShowWelcomeText] = useState(false);


  //poll for contacts changes
  //contacts change = clear cache

  useEffect(() => {
    const getContacts = async () => {
      if (docRef === null) return;
      const dbContacts = await getData("contacts");
      const dbContactInfo = await getData("contactInfo");
      if (dbContacts === undefined || family === undefined) {
        getName().then((ret) => {
          obtainContactInfo(ret);
        })
      } else {
        setContacts(JSON.parse(dbContacts));
        setFamily(JSON.parse(dbContactInfo));
        setLoaded(true);
      }
    }
    getContacts();

  }, [])

  const obtainContactInfo = async (contactNames) => {
    let arr = [];
    if (contactNames === undefined || contactNames.length === 0) {
      setLoaded(true);
      setShowWelcomeText(true);
      return;
    }
    for (const contact of contactNames) {
      const contactRef = doc(db, "users", contact);
      const contactSnap = await getDoc(contactRef);
      if (contactSnap.exists()) {
        const imgRef = contactSnap.data().picture ? contactSnap.data().picture :  "placeholder.png";
        const sz = imgRef == "placeholder.png" ? true : false;
        const reference = ref(storage, imgRef);
        getDownloadURL(reference).then(img => {
          arr.push({name:contactSnap.data().name, photo:img, resize:sz, email:contactSnap.data().email});
          setFamily(arr);
          if (arr.length === contactNames.length) {
            setLoaded(true);
            storeData("contactInfo", JSON.stringify(arr))
          }
        })
      }
    }
  }

  const getName = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docId) {
      let contacts = docSnap.data().associates;
      setContacts(contacts);
      storeData("contacts", JSON.stringify(contacts))
      return contacts;
    }
  }

  const showToast = (receiver) => {
    Toast.show({
      type: 'success',
      text1: `Video sent to ${receiver}!`,
      topOffset: 60,
    });
  }

  return (
    <>
    <CameraModal 
      recipient={recipient} 
      isModalVisible={isModalVisible} 
      setModalVisible={setModalVisible} 
      email={receiverEmail} 
      docId={docId} 
      name={name}
      showToast={showToast}
    />
    <LinearGradient
        colors={['rgba(0, 199, 190, 0.1)', 'white']}
        style={styles.background}
        start={{ x: -0.5, y: -0.75 }}
        end={{ x: 0.5, y: 0.5 }}
      />
    <ScrollView contentContainerStyle={{flexGrow: 1, marginBottom: tabBarHeight}} style={styles.ScrollView}>
      <View style={{height: "12.5%"}}></View>
      {!loaded && <View style={styles.loadingBox}><ActivityIndicator /></View>}
      {showWelcomeText && <Text style={styles.familyText}>Add some family members to your circle!</Text>}
      {loaded && family != undefined && <View style={styles.container}>
        {
          family.map((item, index) => (
            <ProfileCard
              setRecipient={setRecipient}
              key={index} resize={item.resize}
              img={item.photo}
              name={item.name}
              setReceiverEmail={setReceiverEmail}
              email={item.email}
              setModalVisible={setModalVisible}/>
         ))
        }
        </View>}
    </ScrollView>
    <Title title={"Home"}/>

    </>
  )
}

const styles = StyleSheet.create({
  
  background: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  familyText: {
    color: "gray",
    alignSelf: "center",
    position: "absolute",
    top: "55%",

  },

  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: "center",
    padding: "2%",
    backgroundColor: "rgba(255,255,255,0.25)",
    fontSize: "1.5em",
    fontWeight: 600,
    height: "100%"
  },

  ScrollView: {
  },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  }




});