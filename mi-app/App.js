import React, { useState } from "react";
import { Button, Text, TextInput, View, Alert, Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Bienvenido</Text>
      <Button title="Ingresar" onPress={() => navigation.navigate("Login")} />
      <Button title="Registrarse" onPress={() => navigation.navigate("Registro")} />
      <Button title="Ingresar como anónimo" onPress={() => navigation.navigate("Anonimo")} />
    </View>
  );
}

function AnonimoScreen() {
  return (
    <View>
      <Text>Podemos ayudarte. No estás solo.</Text>
      <Text
        style={{ color: "blue", textDecorationLine: "underline" }}
        onPress={() => Linking.openURL("https://forms.gle/ejemplo")}
      >
        https://forms.gle/ejemplo
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
    <View>
      <Text>Iniciar sesión</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Contraseña"
        value={clave}
        secureTextEntry
        onChangeText={setClave}
      />
      <Button title="Entrar" onPress={handleLogin} />
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
    <View>
      <Text>Crear cuenta</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Contraseña"
        value={clave}
        secureTextEntry
        onChangeText={setClave}
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Anonimo" component={AnonimoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
