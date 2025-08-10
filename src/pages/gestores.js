// Extracted from Gestores.html
// Carregar Firebase no head (para evitar delay na página)
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDcjPa9jXsCCu6lNc1fjVg4Bzz1toKWAGY",
      authDomain: "agro-divel.firebaseapp.com",
      projectId: "agro-divel",
      storageBucket: "agro-divel.firebasestorage.app",
      messagingSenderId: "583977436505",
      appId: "1:583977436505:web:3754ec029aebb3d9d67848"
    };

    const app = initializeApp(firebaseConfig);
    window.auth = getAuth(app);
    window.db = getFirestore(app);
  
;

    import {
      signInWithEmailAndPassword
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

    import {
      collection, query, where, getDocs
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    window.login = async function () {
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        const gestoresRef = collection(db, "gestores");
        const q = query(gestoresRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert("Usuário não autorizado como gestor.");
          return;
        }

        const gestor = snapshot.docs[0].data();
        const dashboard = gestor.dashboard || "dashboard.html";
        const filiais = gestor.filial || [];
        
        localStorage.setItem("gestorLogado", "true");
        localStorage.setItem("gestorEmail", email);
        localStorage.setItem("gestorFilial", JSON.stringify(filiais));
        localStorage.setItem("gestorDashboard", dashboard);

        window.location.href = dashboard;
      } catch (err) {
        console.error("Erro no login:", err);
        alert("E-mail ou senha inválidos.");
      }
    }
