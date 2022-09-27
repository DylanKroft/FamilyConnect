import { StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/Screens/HomeScreen';
import SettingsScreen from './components/Screens/SettingsScreen';
import MessagesScreen from './components/Screens/MessagesScreen';
import React, {useEffect, useState} from 'react'
import LoginScreen from './components/Screens/LoginScreen';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore"; 
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToast } from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import { storeData, getData } from './data';

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState();
  const [docId, setDocId] = useState();
  const [family, setFamily] = useState();
  const [tabletEnabled, setTabletEnabled] = useState(false);

  const updateTablet = async (val) => {
    setTabletEnabled(val);
    //upload to firebase
  }

  useEffect(() => {
    const getUserData = async() => {
      const dbName = await getData("name");
      setName(dbName);
      const dbDocId = await getData("docId");
      setDocId(dbDocId);
      
      if (docId === undefined || name === undefined) getName(); 
    }
    getUserData();
  }, [loggedIn])

    const getName = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const mail = doc.data().email;
        if (mail === email && doc.data().name != null) {
          setName(doc.data().name);
          setDocId(doc.id);
          storeData("name", doc.data().name);
          storeData("docId", doc.id);
        }
      });
    }


  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={styles.toast}
        contentContainerStyle={styles.toastContainer}
        text1Style={{
          fontSize: 14,
          fontWeight: '600',
          textAlign: "center",
        }}
      />
    ),

  };

  return (
    <>
    {!loggedIn && <LoginScreen setLoggedIn={setLoggedIn} email={email.toLowerCase()} password={password} setEmail={setEmail} setPassword={setPassword}/>}
    {(loggedIn && docId != undefined) && <NavigationContainer style={styles.container}>
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerTranslucent: true,

          tabBarStyle: { position: 'absolute' },
          tabBarBackground: () => (
            <BlurView tint="light" intensity={70} style={StyleSheet.absoluteFill} />
          ),
        }}  
      >
        <Tab.Screen 
          name="Settings"
          children={()=><SettingsScreen setLoggedIn={setLoggedIn}
          email={email}
          docId={docId}
          setName={setName}
          family={family}
          setFamily={setFamily}
          updateTablet={updateTablet}
          name={name}/>}
          options={{
            headerShown: false,
            tabBarLabel: 'Settings',
            tabBarActiveTintColor: 'rgb(0, 199, 190)',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cog" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Home" 
          children={()=><HomeScreen docId={docId} name={name} setFamily={setFamily} family={family}/>}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarActiveTintColor: 'rgb(0, 199, 190)',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Messages" 
          children={()=><MessagesScreen docId={docId}/>}
          options={{
            tabBarLabel: 'Messages',
            headerShown: false,
            tabBarActiveTintColor: 'rgb(0, 199, 190)',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>}
    <Toast config={toastConfig}/>
    </>
  );
}

const Tab = createBottomTabNavigator();
LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toast: {
    borderLeftWidth: 0,
    width: "50%",
    borderRadius: 500,
    backgroundColor: "rgba(255,255,255,0.95)",
    textAlign: "center",
    margin: 0,
  },
});
