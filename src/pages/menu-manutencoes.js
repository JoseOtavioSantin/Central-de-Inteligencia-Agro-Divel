// Extracted from menu-manutencoes.html
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
    import { app } from './firebase.js';

    const db = getFirestore(app);

    window.abrirPopup = async function () {
      document.getElementById("popup").style.display = "block";
      const popupBody = document.getElementById("popup-body");
      popupBody.innerHTML = "<p>Carregando...</p>";

      try {
        const docNps = await getDoc(doc(db, "informativos", "nps"));
        const nps = docNps.exists() ? docNps.data().valor : "N/A";

        popupBody.innerHTML = `
          <p style="font-size: 16px; margin-bottom: 10px;">
            Com a sua colaboração, nosso NPS segue crescendo!<br>Obrigado por fazer parte disso. 🙌
          </p>
          <p class="nps">${nps}%</p>
        `;
      } catch (e) {
        popupBody.innerHTML = "<p>Erro ao carregar dados.</p>";
        console.error("Erro ao carregar:", e);
      }
    }

    window.fecharPopup = function () {
      document.getElementById("popup").style.display = "none";
    };

    // Mostrar popup uma vez por dia automaticamente
    function verificarPopupAutomatico() {
      const hoje = new Date().toISOString().slice(0, 10); // Ex: "2025-07-22"
      const ultimoDia = localStorage.getItem('popup_nps_hoje');

      if (hoje !== ultimoDia) {
        abrirPopup();
        localStorage.setItem('popup_nps_hoje', hoje);
      }
    }

    verificarPopupAutomatico();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('✅ Service Worker registrado com sucesso!'))
        .catch((error) => console.error('❌ Erro ao registrar Service Worker:', error));
    }
  
;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(reg => {
      // Detecta novo SW em espera
      reg.onupdatefound = () => {
        const novoSW = reg.installing;
        novoSW.onstatechange = () => {
          if (novoSW.state === 'installed' && navigator.serviceWorker.controller) {
            // Exibe banner de atualização
            const banner = document.getElementById('update-banner');
            banner.style.display = 'block';

            banner.addEventListener('click', () => {
              // Pede para ativar novo SW e recarrega a página
              novoSW.postMessage({ action: 'skipWaiting' });
            });
          }
        };
      };
    });

    // Recarrega a página quando o novo SW for ativado
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        location.reload();
      }
    });
  }

;

  function voltarPagina() {
    if (document.referrer && document.referrer !== window.location.href) {
      // Se veio de outra página, volta
      window.history.back();
    } else {
      // Se entrou direto, redireciona para a tela inicial
      window.location.href = "index.html"; // <- troque se o nome for diferente
    }
  }
