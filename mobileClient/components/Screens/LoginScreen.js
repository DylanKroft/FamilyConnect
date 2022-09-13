import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore'

export default function LoginScreen({setLoggedIn, email, setEmail, password, setPassword}) {

    const [focusEmail, setFocusEmail] = useState(false);
    const [focusPassword, setFocusPassword] = useState(false);
    const [isLogin, setisLogin] = useState(true);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            setDoc(doc(db, "users", email), {associates: [], email:email, name: ""})
            .then(
                setDoc(doc(db, "videos", email), {received: [], sent: []})
            ).then(() => {
                handleLogIn();
            })
        })
        .catch(error => alert(error.message));
    }

    const handleLogIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            setLoggedIn(true);
        })
        .catch(error => alert(error.message));
    }

  return (
    <>
    <LinearGradient
        colors={['rgba(138,43,226, 1)', 'white']}
        style={styles.background}
        start={{ x: -1.5, y: -1 }}
        end={{ x: 0.5, y: 0.5 }}

    />
    <KeyboardAvoidingView style={styles.container}  behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.inputContainer}>
                <Text style={styles.welcomeText}>{isLogin ? "Hello" : "Welcome"}<Text style={{color: "#8A2BE2"}}>!</Text></Text>
                <TextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                autoCapitalize='none'
                style={focusEmail ? styles.inputFocus : styles.input}
                onFocus={() => setFocusEmail(true)}
                onBlur={() => setFocusEmail(false)}
                />  

                <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={focusPassword ? styles.inputFocus : styles.input}
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
                />
            </View>
            <View style={styles.buttonContainer}>
                {isLogin && <TouchableOpacity
                    onPress={handleLogIn}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>}
                {!isLogin && <TouchableOpacity
                    onPress={handleSignUp}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>}
            </View>
            {isLogin && <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpTextButton} onPress={() => setisLogin(false)}>Sign-up</Text></Text>}
            {!isLogin && <Text style={styles.signUpText}>Have an account? <Text style={styles.signUpTextButton} onPress={() => setisLogin(true)}>Log-in</Text></Text>}
    </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
    

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        height: "100%",
        width: "100%",
    },

    background: {
        height: "100%",
        width: "100%",
        position: "absolute",
    },

    ScrollView: {
        backgroundColor: "white",
    },


    inputContainer: {
        width: "80%",
    },

    input: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        borderColor: 'lavender',
        borderWidth: 1,
    },  

    inputFocus: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        borderColor: '#8A2BE2',
        borderWidth: 1,
    },  

    buttonContainer: {
        width: "80%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },

    button: {
        backgroundColor: "#8A2BE2",
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonOutline: {
        backgroundColor: "white",
        marginTop: 5,
        borderColor: '#8A2BE2',
        borderWidth: 2,
    },

    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },

    buttonOutlineText: {
        color: "#8A2BE2",
        fontWeight: "700",
        fontSize: 16,
    },

    signUpText: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 50,
    },

    signUpTextButton: {
        fontWeight: "600",
        color: "#8A2BE2",
    },

    welcomeText: {
        fontSize: 48,
        marginVertical: 20,
        alignSelf: "flex-start",
        fontWeight: "700",
    }

})