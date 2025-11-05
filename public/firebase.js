/* --------------------------------------------------
   CONFIGURACIÓN INICIAL DE FIREBASE
   Define el proyecto con sus claves y activa los
   servicios principales: autenticación y base de datos.
-------------------------------------------------- */
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


/* --------------------------------------------------
   FUNCIÓN AUXILIAR PARA MOSTRAR MENSAJES
   Muestra mensajes (errores o confirmaciones) en
   elementos HTML específicos con estilo personalizado.
-------------------------------------------------- */
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


/* --------------------------------------------------
   SECCIÓN DE LOGIN (INICIO DE SESIÓN)
   Valida los campos de correo y contraseña, inicia
   sesión con Firebase Auth y redirige a denuncia.html
   si el login es exitoso.
-------------------------------------------------- */
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
      setTimeout(() => (window.location.href = "denuncia.html"), 1000);
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


/* --------------------------------------------------
   SECCIÓN DE REGISTRO DE USUARIO
   Permite crear una nueva cuenta con email, contraseña
   y curso. Guarda los datos en la colección “usuarios”
   de Firestore.
-------------------------------------------------- */
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


/* --------------------------------------------------
   SECCIÓN DE ACCESO PARA PSICÓLOGOS
   Comprueba DNI y clave contra los datos guardados en
   Firestore. Si coinciden, redirige al panel del psicólogo.
-------------------------------------------------- */
const psicoBtn = document.getElementById("psicoBtn");
if (psicoBtn) {
  psicoBtn.addEventListener("click", async () => {
    const dni = document.getElementById("psicoDNI").value.trim();
    const clave = document.getElementById("psicoClave").value;
    const msgId = "psicoMsg";

    /* Función local para mostrar mensajes en esta sección */
    function mostrarMensajeLocal(idElemento, mensaje, color = "red") {
      const el = document.getElementById(idElemento);
      if (el) {
        el.textContent = mensaje;
        el.style.color = color;
        el.style.marginTop = "10px";
        el.style.fontWeight = "500";
        el.style.textAlign = "center";
      }
    }

    mostrarMensajeLocal(msgId, "");

    if (!dni || !clave) {
      mostrarMensajeLocal(msgId, "Completá DNI y contraseña.");
      return;
    }

    try {
      const snapshot = await db.collection("psicologos").where("dni", "==", dni).get();

      if (snapshot.empty) {
        mostrarMensajeLocal(msgId, "DNI o contraseña incorrectos.");
        return;
      }

      /* Recorre los resultados para verificar si la clave coincide */
      let accesoPermitido = false;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.clave && data.clave === clave) {
          accesoPermitido = true;
        }
      });

      if (accesoPermitido) {
        mostrarMensajeLocal(msgId, "Acceso permitido ✅", "green");
        setTimeout(() => { window.location.href = "psicologo_panel.html"; }, 500);
      } else {
        mostrarMensajeLocal(msgId, "DNI o contraseña incorrectos.");
      }

    } catch (e) {
      console.error("Error validando psicólogo:", e);
      mostrarMensajeLocal(msgId, "Error de conexión. Intentá de nuevo.");
    }
  });
}


/* --------------------------------------------------
   GESTIÓN DE SESIÓN DEL USUARIO
   Muestra el correo del usuario activo y un botón para
   cerrar sesión. Si no hay usuario logueado, no muestra nada.
-------------------------------------------------- */
firebase.auth().onAuthStateChanged((user) => {
  const sessionEl = document.getElementById("userSession");

  if (!sessionEl) return;
  sessionEl.innerHTML = "";

  if (user && user.email) {

    const spanEmail = document.createElement("span");
    spanEmail.textContent = `Estás en la sesión de: ${user.email}`;
    spanEmail.style.marginRight = "10px";
    spanEmail.style.color = "#332239ff";

    const btnLogout = document.createElement("button");
    btnLogout.textContent = "Cerrar sesión";
    btnLogout.style.background = "#e7d7f6";
    btnLogout.style.border = "none";
    btnLogout.style.padding = "5px 10px";
    btnLogout.style.borderRadius = "8px";
    btnLogout.style.cursor = "pointer";
    btnLogout.style.fontWeight = "500";
    btnLogout.style.color = "#332239ff";

    btnLogout.addEventListener("click", () => {
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    });

    sessionEl.appendChild(spanEmail);
    sessionEl.appendChild(btnLogout);
  } else {
    sessionEl.textContent = "";
  }
});
