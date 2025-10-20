// Firebase configuración
const firebaseConfig = {
  apiKey: "AIzaSyD076ItytBwa4zqwmD6R20MzYN9XlkZojI",
  authDomain: "eco-web-ddfaa.firebaseapp.com",
  projectId: "eco-web-ddfaa",
  storageBucket: "eco-web-ddfaa.firebasestorage.app",
  messagingSenderId: "646679745661",
  appId: "1:646679745661:web:f71abe54b6a271d7524d14"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase inicializado correctamente ✅");

document.getElementById("registerBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;
  const curso = document.getElementById("regCurso").value;

  if (!email || !pass || !curso) {
    alert("Por favor completá todos los campos.");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection("usuarios").doc(userCredential.user.uid).set({ email, curso });
    alert("Registro exitoso ✅");
    window.location.href = "https://docs.google.com/forms/d/FORM_ID_LOGUEADO";
  } catch (e) {
    console.error(e);
    alert("Error al registrar: " + e.message);
  }
});

document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;

  if (!email || !pass) {
    alert("Ingresá correo y contraseña.");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, pass);
    alert("Inicio de sesión correcto ✅");
    window.location.href = "https://docs.google.com/forms/d/FORM_ID_LOGUEADO";
  } catch (e) {
    console.error(e);
    alert("Error al iniciar sesión: " + e.message);
  }
});
