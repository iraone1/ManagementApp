import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  DrawerLayoutAndroid,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/AntDesign';
import Loginimage from "../src/assets/23844095_6842314.svg";

const Homescreen = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "", username: "",password:""});
  const [editIndex, setEditIndex] = useState(null);
  const drawer = useRef(null);

  const addUser = async (newUser) => {
    if (!newUser.name || !newUser.username|| !newUser.password) {
      Alert.alert("Validation Error", "Tolong isi semua data.");
      return;
    }
    const storedUsers = JSON.parse(await AsyncStorage.getItem("users")) || [];
    storedUsers.push(newUser);
    await AsyncStorage.setItem("users", JSON.stringify(storedUsers));
    setUsers(storedUsers);
  };

  const updateUser = async (index, updatedUser) => {
  if (!updatedUser.name || !updatedUser.password) {
    Alert.alert("Validation Error", "Name and Password are required.");
    return;
  }

  const storedUsers = JSON.parse(await AsyncStorage.getItem("users")) || [];
  const existingUser = storedUsers[index];

  // Pertahankan username lama dan perbarui hanya nama dan password
  storedUsers[index] = {
    ...existingUser,
    name: updatedUser.name,
    password: updatedUser.password,
  };

  await AsyncStorage.setItem("users", JSON.stringify(storedUsers));
  setUsers(storedUsers);
};

  const deleteUser = async (index) => {
    const storedUsers = JSON.parse(await AsyncStorage.getItem("users")) || [];
    storedUsers.splice(index, 1);
    await AsyncStorage.setItem("users", JSON.stringify(storedUsers));
    setUsers(storedUsers);
  };

  const fetchUsers = async () => {
    const storedUsers = JSON.parse(await AsyncStorage.getItem("users")) || [];
    setUsers(storedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 

  return (
    
      <View style={styles.container}>
         <Loginimage
                width={620}
                height={800}
                preserveAspectRatio="xMidYMid slice"
                style={StyleSheet.absoluteFillObject}
              />
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
       
        <Text style={styles.text1}>ManagementApp</Text>
        <TouchableOpacity style={{marginBottom:15}} onPress={onLogout} >
          <Icons name="logout" size={30} color={"red"} />
      </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={styles.text}>List User :</Text>
          <TouchableOpacity
          
          onPress={() => {
            setCurrentUser({ name: '', username: '', password: '' });
            setEditIndex(null);
            setModalVisible(true);
          }}
        >
          <Icon name='add-user' size={30} color={"blue"}  />
        </TouchableOpacity>
        </View>
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.userItem}>
              <Text style={styles.userText}>{item.name}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentUser(item);
                    setEditIndex(index);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteUser(index)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        

<Modal visible={modalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.formContainer}>
      <Text style={styles.title}>{editIndex !== null ? 'Edit User' : 'Add User'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={currentUser.name}
        onChangeText={(text) => setCurrentUser({ ...currentUser, name: text })}
      />
      {editIndex === null && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={currentUser.username}
          onChangeText={(text) => setCurrentUser({ ...currentUser, username: text })}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={currentUser.password}
        onChangeText={(text) => setCurrentUser({ ...currentUser, password: text })}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (editIndex !== null) {
            updateUser(editIndex, currentUser);
          } else {
            addUser(currentUser);
          }
          setModalVisible(false);
          setCurrentUser({ name: '', username: '', password: '' });
          setEditIndex(null);
        }}
      >
        <Text style={styles.buttonText}>{editIndex !== null ? 'Update' : 'Add'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={() => {
          setModalVisible(false);
          setCurrentUser({ name: '', username: '', password: '' });
          setEditIndex(null);
        }}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    alignItems: "center",
    marginTop:20,
  },
    text1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    alignItems: "center",
    
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    color: "blue",
    marginRight: 15,
  },
  deleteButton: {
    color: "red",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(17, 16, 16, 0.5)",
  },
  input: {
    
    width: "100%",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#766f6f",
    
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign:"center",
  },
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
},
formContainer: {
  width: "80%",
  padding: 20,
  backgroundColor: "white",
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
title: {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 20,
  textAlign: "center",
},


  
});

export default Homescreen;
