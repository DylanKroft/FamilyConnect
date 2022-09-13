import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react'
import { collection, getDoc, doc } from "firebase/firestore"; 
import FamilyBar from './FamilyBar';

export default function CircleSheet({family, setFamily}) {

    const [familyCount, setFamilyCount] = useState(0);
    const [newEmail, setNewEmail] = useState();
    const [isAddingFamily, setIsAddingFamily] = useState(false);

    const setNewMember = () => {
        setIsAddingFamily(true);
    }

    const saveMember = () => {
        //check if recipient exists
        //check if is full
        //add to current member as pending
        //add to recipient as isConfirmable

        //recipient accepts
            //set isConfirmable in recipient to false, ispending to false
            //set isPending to false on user

        setIsAddingFamily(false);
    }

    const removeMember = (idx) => {
        console.log(idx);
        //remove selected family bar from members by index
        // let tempFamily = family remove idx
        // setFamily(tempFamily)

        //upload to user's firebase
        //upload to recipient firebase
    }

    const cancelSaveFamily = () => {
        setIsAddingFamily(false);
        setNewEmail("");
    }

    useEffect(() => {
        if (family != undefined) setFamilyCount(family.length);
    }, [family])

  return (
    <View style={styles.container}>
        <View style={styles.inner}>
            <Text style={styles.header}>{isAddingFamily ? "Add new family member" : "Family Members"}</Text>

            {!isAddingFamily && family && 
                family.map((item, index) => (
                    <FamilyBar key={index} removeMember={() => removeMember(index)} name={item.name} email={item.email} isPending={false}></FamilyBar>
                ))
            }   

            {familyCount != 4 && !isAddingFamily &&  
                <TouchableOpacity style={styles.addMember} onPress={setNewMember}>
                    <Text style={{color: "white", fontWeight: "600"}}>Add New Family Member</Text>
                </TouchableOpacity>
            }
            
            {isAddingFamily && 
                <View style={styles.addFamilyBox}>
                    <TextInput
                    placeholder={"email"}
                    value={newEmail}
                    onChangeText={text => setNewEmail(text)}
                    style={styles.input}
                    />  

                    <View style={styles.buttonBox}>
                        <TouchableOpacity style={styles.button} onPress={saveMember}>
                        <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonCancel} onPress={cancelSaveFamily}>
                        <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

        </View>
    </View>
  )
}

const styles = StyleSheet.create({

    buttonBox: {
        display: "flex",
        flexDirection: "row",
        width: "60%",
        justifyContent: "space-evenly",
    },

    addMember: {
        padding: 10,
        paddingHorizontal: 15,
        marginTop: 10,
        backgroundColor: "rgb(0,199,190)",
        borderRadius: 500,
        alignSelf: "flex-start"
    },

    addFamilyBox: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },  

    container: {
        height: "40%",
        margin: 30,
    },

    header: {
        fontSize: 20,
        fontWeight: "600",
        alignSelf: "flex-start",
        marginBottom: 20,
    },

    inner: {
      display: 'flex',
      justifyContent: 'space-between',
      display: "flex",
      alignItems: "center",
    },

    input: {
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
        padding: 10,
        marginBottom: 30,
        fontSize: 16,
        width: "100%",
      },
  
      button: {
        backgroundColor: "rgb(0,199,190)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 500,
      },

      buttonCancel: {
        backgroundColor: "rgb(255, 149, 0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 500,
      },
  
      buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
        padding: 10,
        paddingHorizontal: 15,
      },
})