import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    
    // Buscar filial do usuário no Firestore
    const docRef = doc(db, "usuarios", email);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Erro: usuário sem filial definida.");
      return;
    }

    const filial = docSnap.data().filial;

    // Salva o e-mail e a filial no localStorage
    localStorage.setItem("usuarioLogado", email);
    localStorage.setItem("filialLogada", filial);

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
};
