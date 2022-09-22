import { StyleSheet, View, Text, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Title from './Title';
import { Ionicons } from '@expo/vector-icons';
import ActionSheet, { SheetManager,SheetProps,registerSheet } from "react-native-actions-sheet";
import NameSheet from '../ActionSheets/NameSheet'
import PasswordSheet from '../ActionSheets/PasswordSheet'
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import placeholder from "../../assets/placeholder.png"
import ProfilePictureSheet from '../ActionSheets/ProfilePictureSheet';
import NotifcationsSheet from '../ActionSheets/NotificationsSheet';
import { db } from '../../firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import CircleSheet from '../ActionSheets/CircleSheet';
import { storeData } from '../../data';
import * as Notifications from "expo-notifications";



export default function SettingsScreen({setLoggedIn, email, name, docId, setName, family, setFamily, updateTablet, loggedIn}) {

  Notifications.setNotificationHandler({
    handleNotification: async () => {
    return {
    shouldShowAlert: loggedIn
    }}
    })
  

  const [isEnabled, setIsEnabled] = useState(true);
  const [notifCount, setNotifCount] = useState(0)

  const tabBarHeight = useBottomTabBarHeight();

  const handleLogout = () => {
    signOut(auth).then(() => {
      setLoggedIn(false);
      AsyncStorage.clear();
    }).catch(error => alert(error.message));
  }

  useEffect(() => {
    const getNotifcount = async () => {
      const docRef = doc(db, "users", docId);
      const docSnap = await getDoc(docRef);
      let count = docSnap.data().notifications;
      setNotifCount(count);
    }
    getNotifcount();
    
  }, [docId])
  

  const saveName = async (newName) => {
    const docRef = doc(db, "users", docId);
    await updateDoc(docRef, {"name": newName}).catch();
    setName(newName);
    storeData("name", newName);
    SheetManager.hide("nameSheet");
  }

  const savePassword = () => {
    SheetManager.hide("passwordSheet");
  }

  const changeProfilePicture = () => {
    SheetManager.hide("profilePictureSheet");
  }

  const setNotifications = async (val) => {

    await Notifications.cancelAllScheduledNotificationsAsync();
    setNotifCount(val);
    const docRef = doc(db, "users", docId);
    await updateDoc(docRef, {
      notifications: val
    });



    if (val === 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } 

    if (val >= 1) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Family Connect",
          body: "Send an afternoon message to your circle to let them know how you are doing",
          data: { data: "goes here" },
        },
        trigger: {
          hour:getRandomInt(12, 15),
          seconds: 1,
          minute: getRandomInt(0, 50),
          repeats: true
        }
      });
    }

    if (val >= 2) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Family Connect",
          body: "Send an evening message to your circle to let them know how you are doing",
          data: { data: "goes here" },
        },
        trigger: {
          hour:getRandomInt(18, 23),
          minute: getRandomInt(0, 50),
          repeats: true
        }
      });
    }

    if (val >= 3) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Family Connect",
          body: "Send a morning message to your circle to let them know how you are doing",
          data: { data: "goes here" },
        },
        trigger: {
          hour:getRandomInt(8, 11),
          minute: getRandomInt(0, 50),
          repeats: true
        }
      });
    }

  }

  const toggleSwitch = () => {
    Alert.alert("Cannot Disable Tablet Mode", "Tablet Mode cannot be disabled at this time.");
    setIsEnabled(true);
    updateTablet(isEnabled);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }



  return (
      <>
      <ActionSheet id="nameSheet">
        <NameSheet name={name} saveName={saveName}/>
      </ActionSheet>
      
      <ActionSheet id="passwordSheet">
        <PasswordSheet email={email} savePassword={savePassword}/>
      </ActionSheet>

      <ActionSheet id="profilePictureSheet">
        <ProfilePictureSheet email={email} changeProfilePicture={changeProfilePicture}/>
      </ActionSheet>

      <ActionSheet id="notificationsSheet">
        <NotifcationsSheet email={email} setNotifications={setNotifications} notifCount={notifCount}/>
      </ActionSheet>

      <ActionSheet id="circleSheet">
        <CircleSheet setFamily={setFamily} family={family}/>
      </ActionSheet>

      <LinearGradient
        colors={['rgba(0, 199, 190, 0.1)', 'white']}
        style={styles.background}
        start={{ x: -0.5, y: -0.75 }}
        end={{ x: 0.5, y: 0.5 }}
      />
      <Title title={"Settings"}/>
      <View style={{height: "12.5%"}}></View>
      <View style={[styles.container, {marginBottom: tabBarHeight + 20}]}>
        <View style={styles.user}>
          <View style={styles.profilePicture}>
            <Text style={styles.profileLetter}>{name[0]}</Text>
          </View>
          <View style={styles.profileInfoBox}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
        <View style={styles.controlButtons}>
          <TouchableOpacity style={[styles.settingBar, {borderTopLeftRadius: 10, borderTopRightRadius: 10}]} onPress={() => SheetManager.show("nameSheet")}>
            <Ionicons style={styles.icon} name="person-outline" color={"black"} size={16}></Ionicons>
            <Text style={styles.settingBarText}>Update Name</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBar} onPress={() => SheetManager.show("passwordSheet")}>
            <Ionicons style={styles.icon} name="key-outline" color={"black"} size={16}></Ionicons>
            <Text style={styles.settingBarText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBar} onPress={() => SheetManager.show("profilePictureSheet")}>
            <Ionicons style={styles.icon} name="happy-outline" color={"black"} size={16}></Ionicons>
            <Text style={styles.settingBarText}>Update Profile Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBar} onPress={() => SheetManager.show("circleSheet")}>
            <Ionicons style={styles.icon} name="people-outline" color={"black"} size={16}></Ionicons>
            <Text style={styles.settingBarText}>Update Circle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBar} onPress={() => SheetManager.show("notificationsSheet")}>
            <Ionicons style={styles.icon} name="notifications-outline" color={"black"} size={16}></Ionicons>
            <Text style={styles.settingBarText}>Notification Preferences</Text>
          </TouchableOpacity>
          <View style={[styles.settingBar, {borderBottomWidth: 0.5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
              <Ionicons style={styles.icon} name="tablet-landscape-outline" color={"black"} size={16}></Ionicons>
              <Text style={styles.settingBarText}>Tablet Mode Active</Text>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "lightgray", true: "rgb(52, 199, 89)" }}
                ios_backgroundColor="lightgray"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.settingBar, styles.logOutButton]} onPress={handleLogout}>
          <Text style={[styles.settingBarText, styles.logOutButtonText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
      </>
  )
}

const styles = StyleSheet.create({
  
  background: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  switchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    alignItems: "center",
    flex: 1,
  },


  icon: {
    marginLeft: 20,
  },

  main: {
    backgroundColor: "#f7f7f7",
    height: "100%",

  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 20,
    marginTop: 5,
    height: "100%",
  },

  controlButtons: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  user: {
    backgroundColor: "white",
    height: "20%",
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "left",
    display: "flex",
    flexDirection: "row",
    borderColor: 'lightgray',
    borderWidth: 0.5,
  },

  profilePicture:{ 
    backgroundColor: "rgba(0, 199, 190, 0.2)",
    height: "70%",
    borderRadius: 500,
    aspectRatio: 1,
    margin: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfoBox: {
  },

  settingBar: {
    backgroundColor: "white",
    height: "12.5%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    borderBottomWidth: 0,
  },

  settingBarText: {
    paddingLeft: 15,
    fontSize: 16,
  },

  logOutButton: {
    marginBottom: 5,
    height: "7.5%",
    backgroundColor: "rgb(0, 199, 190)",
    color: "white",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderRadius: 10,
  },

  logOutButtonText: {
    color: "white",
    fontWeight: "600",
  },

  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
  },

  imgSmall: {
    height: "70%",
    aspectRatio: 1,
    resizeMode: 'contain',
  },

  profileLetter: {
    color: "white",
    fontWeight: "800",
    fontSize: 48,
  }


})