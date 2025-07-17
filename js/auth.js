// js/auth.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    localStorage.setItem("usuarioLogado", email);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
};


