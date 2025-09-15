import React, { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 💜</Text>
      <Text style={styles.subtitle}>No estás solo, estamos para ayudarte</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Registro")}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonAlt]} onPress={() => navigation.navigate("Anonimo")}>
        <Text style={styles.buttonTextAlt}>Ingresar como anónimo</Text>
      </TouchableOpacity>
    </View>
  );
}

function AnonimoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podemos ayudarte ✨</Text>
      <Text style={styles.subtitle}>Tu voz importa. No estás solo.</Text>
      <Text
        style={styles.link}
        onPress={() => Linking.openURL("https://forms.gle/FPhbHisi7Esf8w1d9")}
      >
        Completar formulario de ayuda
      </Text>
    </View>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, clave);
      Alert.alert("Sesión iniciada ✅");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a383acff"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        secureTextEntry
        value={clave}
        onChangeText={setClave}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

function RegistroScreen() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, clave);
      Alert.alert("Registro correcto ✅");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        secureTextEntry
        value={clave}
        onChangeText={setClave}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Anonimo" component={AnonimoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#4B0082",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#C1E1C1",
    padding: 14,
    marginVertical: 8,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonAlt: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#C1E1C1",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  buttonTextAlt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B0082",
  },
  link: {
    fontSize: 16,
    color: "#4B0082",
    textDecorationLine: "underline",
    marginTop: 15,
  },
});

