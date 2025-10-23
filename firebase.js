
const firebaseConfig = {
  apiKey: "AIzaSyD076ItytBwa4zqwmD6R20MzYN9XlkZojI",
  authDomain: "eco-web-ddfaa.firebaseapp.com",
  projectId: "eco-web-ddfaa",
  storageBucket: "eco-web-ddfaa.firebasestorage.app",
  messagingSenderId: "646679745661",
  appId: "1:646679745661:web:f71abe54b6a271d7524d14"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase inicializado correctamente ✅");

function mostrarMensaje(idElemento, mensaje, color = "red") {
  const el = document.getElementById(idElemento);
  if (el) {
    el.textContent = mensaje;
    el.style.color = color;
    el.style.marginTop = "10px";
    el.style.fontWeight = "500";
    el.style.textAlign = "center";
  }
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;
    const mensajeEl = "loginMsg";

    mostrarMensaje(mensajeEl, ""); 

    if (!email || !pass) {
      mostrarMensaje(mensajeEl, "Ingresá correo y contraseña.");
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, pass);
      mostrarMensaje(mensajeEl, "Inicio de sesión correcto ✅", "green");
      setTimeout(() => (window.location.href = "index.html"), 1000);
    } catch (e) {
      console.error("Error al iniciar sesión:", e.code);

      if (e.code === "auth/user-not-found" || e.code === "auth/wrong-password") {
        mostrarMensaje(mensajeEl, "Usuario o contraseña incorrectos ❌");
      } else if (e.code === "auth/invalid-email") {
        mostrarMensaje(mensajeEl, "El formato del correo no es válido.");
      } else {
        mostrarMensaje(mensajeEl, "Error al iniciar sesión: " + e.message);
      }
    }
  });
}


const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value;
    const curso = document.getElementById("regCurso").value.trim();
    const mensajeEl = "registerMsg";

    mostrarMensaje(mensajeEl, ""); 

    if (!email || !pass || !curso) {
      mostrarMensaje(mensajeEl, "Por favor completá todos los campos.");
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
      const user = userCredential.user;

      await db.collection("usuarios").doc(user.uid).set({
        email,
        curso,
        creado: new Date().toISOString()
      });

      document.getElementById("registerForm").style.display = "none";
      document.getElementById("gracias").style.display = "block";
    } catch (e) {
      console.error("Error al registrar:", e.code);

      if (e.code === "auth/email-already-in-use") {
        mostrarMensaje(mensajeEl, "Ese correo ya está registrado. Iniciá sesión o usá otro.");
      } else if (e.code === "auth/weak-password") {
        mostrarMensaje(mensajeEl, "La contraseña es muy débil. Usá una más segura.");
      } else if (e.code === "auth/invalid-email") {
        mostrarMensaje(mensajeEl, "El correo ingresado no es válido.");
      } else {
        mostrarMensaje(mensajeEl, "Error al registrarse: " + e.message);
      }
    }
  });
}

