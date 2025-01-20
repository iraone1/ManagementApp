import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loginimage from "../src/assets/23844095_6842314.svg";
const Loginscreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
  // Ambil data pengguna dari AsyncStorage
  const storedUsers = JSON.parse(await AsyncStorage.getItem("users")) || [];

  // Periksa apakah admin login
  if (username === "admin" && password === "admin123") {
    // Jika admin, navigasi ke AdminScreen
    onLoginSuccess("admin");
    navigation.navigate("AdminScreen");
    return;
  }

  // Cari pengguna biasa
  const user = storedUsers.find((user) => user.username === username);

  if (user && user.password === password) {
    // Jika login berhasil sebagai pengguna biasa
    onLoginSuccess("user");
    navigation.navigate("UserScreen");
  } else {
    alert("Username atau Password salah!");
  }
};
  return (
    <View style={styles.container}>
         <Loginimage
        width={620}
        height={800}
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFillObject}
      />
      <Text style={styles.title}>UserManagement App</Text>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#0e0000"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#010000"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

     <View style={{marginBottom:50}}>
      <Text style={styles.title}>Notes !!</Text>
      <View style={{flexDirection:'row'}}>
<Text style={styles.subtitle}>Username:admin</Text>
<Text style={styles.subtitle}></Text>
<Text style={styles.subtitle}>Password:admin123</Text>
      </View>
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 30,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 30,
  },
  formContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    marginTop: 30,
    borderWidth: 3,
    borderColor: "#a69d9d",
  },
  input: {
    textAlign: "center",
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    fontSize: 26,
    borderWidth: 1,
    borderColor: "#040000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Loginscreen;
