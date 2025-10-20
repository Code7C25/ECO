import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const Stack = createNativeStackNavigator();

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
      <Text style={styles.subtitle}>
        No estás solo, estamos para ayudarte
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonAlt]}
        onPress={() => navigation.navigate("Anonimo")}
      >
        <Text style={styles.buttonTextAlt}>Ingresar como anónimo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Psicologos")}
      >
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
        onPress={() =>
          Linking.openURL("https://forms.gle/FPhbHisi7Esf8w1d9")
        }
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

/* =========================== NUEVO REGISTRO =========================== */

function RegistroScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [curso, setCurso] = useState(null);
  const [division, setDivision] = useState(null);
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideTo = (dir) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: dir === "next" ? -1 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goNext = () => {
    if (step === 0 && (!nombre.trim() || !apellidos.trim()))
      return Alert.alert("Error", "Completá nombre y apellidos");
    if (step === 1 && !curso)
      return Alert.alert("Error", "Seleccioná tu curso");
    if (step === 2 && !division)
      return Alert.alert("Error", "Seleccioná la división");
    slideTo("next");
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) return navigation.goBack();
    slideTo("back");
    setStep((s) => s - 1);
  };

  const handleRegister = async () => {
    if (!email || !clave)
      return Alert.alert("Error", "Completá email y contraseña");
    if (clave.length < 6)
      return Alert.alert("Error", "Contraseña mínimo 6 caracteres");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, clave);
      const user = userCredential.user;
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        apellidos,
        curso,
        division,
        email,
        creadoEn: new Date(),
      });
      Alert.alert("Registro correcto ✅");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  const CursosRow = () => (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <TouchableOpacity
          key={n}
          style={[styles.pillButton, curso === n && styles.pillSelected]}
          onPress={() => setCurso(n)}
        >
          <Text style={[styles.pillText, curso === n && styles.pillTextSelected]}>
            {n}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const DivisionRow = () => (
    <View style={styles.row}>
      {["A", "B", "C"].map((l) => (
        <TouchableOpacity
          key={l}
          style={[styles.pillButton, division === l && styles.pillSelected]}
          onPress={() => setDivision(l)}
        >
          <Text style={[styles.pillText, division === l && styles.pillTextSelected]}>
            {l}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const slideTranslate = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [300, 0, -300],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Animated.View
        style={{
          width: "100%",
          alignItems: "center",
          transform: [{ translateX: slideTranslate }],
        }}
      >
        {step === 0 && (
          <View style={styles.stepBox}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#888"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              placeholderTextColor="#888"
              value={apellidos}
              onChangeText={setApellidos}
            />
            <TouchableOpacity style={styles.button} onPress={goNext}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
            <Text style={styles.stepText}>Paso 1 de 3</Text>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.title}>Seleccioná tu curso</Text>
            <CursosRow />
            <TouchableOpacity style={styles.button} onPress={goNext}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
            <Text style={styles.stepText}>Paso 2 de 3</Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.title}>División</Text>
            <DivisionRow />
            <TouchableOpacity style={styles.button} onPress={goNext}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
            <Text style={styles.stepText}>Paso 3 de 3</Text>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.title}>Datos de acceso</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
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
            <Text style={styles.stepText}>Listo 🎉</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

/* =========================== FIN REGISTRO =========================== */

// 💬 tus otras pantallas (Psicologos, Panel, Formularios...) siguen igual

// ✅ Navegación
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Anonimo" component={AnonimoScreen} />
        {/* tus demás pantallas */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* =========================== ESTILOS =========================== */
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
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  pillButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#9d89a3ff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    margin: 5,
  },
  pillSelected: {
    backgroundColor: "#9d89a3ff",
  },
  pillText: {
    color: "#4B0082",
    fontWeight: "500",
  },
  pillTextSelected: {
    color: "#fff",
  },
  stepText: {
    marginTop: 14,
    fontSize: 14,
    color: "#6a4d74",
    opacity: 0.8,
  },
  stepBox: {
    alignItems: "center",
    width: "100%",
  },
});
