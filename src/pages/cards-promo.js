// Extracted from cards-promo.html
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

    const firebaseConfig = {
      apiKey: "AIzaSyDcjPa9jXsCCu6lNc1fjVg4Bzz1toKWAGY",
      authDomain: "agro-divel.firebaseapp.com",
      projectId: "agro-divel",
      storageBucket: "agro-divel.firebasestorage.app",
      messagingSenderId: "583977436505",
      appId: "1:583977436505:web:3754ec029aebb3d9d67848"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const container = document.querySelector('.container');

    function mostrarPopup(titulo, descricao, imagem, dataInicial, dataFinal) {
      const fundo = document.createElement("div");
      fundo.className = "popup-bg";

      const dataIniFormatada = new Date(dataInicial).toLocaleDateString("pt-BR");
      const dataFimFormatada = new Date(dataFinal).toLocaleDateString("pt-BR");

      const popup = document.createElement("div");
      popup.className = "popup";

      popup.innerHTML = `
        <div class="fechar" onclick="this.parentElement.parentElement.remove()">×</div>
        <h3>${titulo}</h3>
        <img src="${imagem}" alt="Banner">
        <p><strong>De:</strong> ${dataIniFormatada} <strong>até:</strong> ${dataFimFormatada}</p>
        <p>${descricao}</p>
      `;

      fundo.appendChild(popup);
      document.body.appendChild(fundo);
    }

    async function carregarCampanhas() {
      const querySnapshot = await getDocs(collection(db, "campanhasAtivas"));
      const hoje = new Date();

      querySnapshot.forEach(doc => {
        const data = doc.data();

        const dataIni = new Date(data.dataInicial);
        const dataFim = new Date(data.dataFinal);

        if (hoje >= dataIni && hoje <= dataFim) {
          const card = document.createElement("div");
          card.className = "card-campanha";
          card.innerHTML = `
            <img src="${data.imagem}" alt="Banner">
            <div class="info">${data.nome}</div>
          `;
          card.addEventListener("click", () => {
            mostrarPopup(data.nome, data.descricao, data.imagem, data.dataInicial, data.dataFinal);
          });
          container.appendChild(card);
        }
      });
    }

    carregarCampanhas();
