import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// 🔥 Firestore
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { app } from "./firebase"; // 👈 asegurate que exportes también `app` desde firebase.js
const db = getFirestore(app);

const Stack = createNativeStackNavigator();

// 🔙 Botón reutilizable para volver atrás
function BackButton({ navigation }) {
  return (
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Volver</Text>
    </TouchableOpacity>
  );
}

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

      {/* 👇 Botón nuevo para psicólogos */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Psicologos")}>
        <Text style={styles.buttonText}>Soy psicólogo</Text>
      </TouchableOpacity>
    </View>
  );
}

function AnonimoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BackButton navigation={navigation} />
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

function LoginScreen({ navigation }) {
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
      <BackButton navigation={navigation} />

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

function RegistroScreen({ navigation }) {
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
      <BackButton navigation={navigation} />
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

/* =============================
   👨‍⚕️ Pantallas de psicólogos
============================= */

function PsicologosScreen({ navigation }) {
  const [psicologos, setPsicologos] = useState([]);

  useEffect(() => {
    const cargarPsicologos = async () => {
      const querySnapshot = await getDocs(collection(db, "psicologos"));
      const lista = [];
      querySnapshot.forEach((docu) => {
        lista.push({ id: docu.id, ...docu.data() });
      });
      setPsicologos(lista);
    };
    cargarPsicologos();
  }, []);

  return (
    <View style={styles.container}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Selecciona tu usuario</Text>
      {psicologos.map((p) => (
        <TouchableOpacity 
          key={p.id} 
          style={styles.button} 
          onPress={() => navigation.navigate("LoginPsicologo", { id: p.id })}
        >
          <Text style={styles.buttonText}>{p.nombre}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function LoginPsicologoScreen({ route, navigation }) {
  const { id } = route.params;
  const [password, setPassword] = useState("");

  const verificarPassword = async () => {
    const docRef = doc(db, "psicologos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (password === data.password) {
        Alert.alert("Éxito", "Bienvenido " + data.nombre);
        navigation.navigate("PanelPsicologo", { nombre: data.nombre });
      } else {
        Alert.alert("Error", "Contraseña incorrecta");
      }
    }
  };

  return (
    <View style={styles.container}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Ingresar contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
      />
      <TouchableOpacity style={styles.button} onPress={verificarPassword}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

function PanelPsicologoScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de {route.params.nombre}</Text>
      <Text style={styles.subtitle}>Aquí irá el chat o herramientas del psicólogo</Text>
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
        {/* 👨‍⚕️ Rutas nuevas para psicólogos */}
        <Stack.Screen name="Psicologos" component={PsicologosScreen} />
        <Stack.Screen name="LoginPsicologo" component={LoginPsicologoScreen} />
        <Stack.Screen name="PanelPsicologo" component={PanelPsicologoScreen} />
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
    backgroundColor: "#9d89a3ff",
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
    borderColor: "#83608eff",
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#83608eff",
  },
  backButtonText: {
    fontSize: 14,
    color: "#4B0082",
    fontWeight: "600",
  },
});
