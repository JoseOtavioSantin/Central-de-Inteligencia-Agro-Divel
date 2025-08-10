// Extracted from DashboardServicos.html
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const tipoChecklist = new URLSearchParams(window.location.search).get("tipo") || "checklistServicos";
  const app = initializeApp({
    apiKey: "AIzaSyDcjPa9jXsCCu6lNc1fjVg4Bzz1toKWAGY",
    authDomain: "agro-divel.firebaseapp.com",
    projectId: "agro-divel"
  });
  const db = getFirestore(app);
  let dadosTotais = [];

  document.getElementById("dynamic-title").textContent =
  tipoChecklist === "checklistComercial" ? "Comercial" :
  tipoChecklist === "checklistRevisao" ? "Revisão" :
  tipoChecklist === "checklistPecas" ? "Peças" : "Painel";
  
  async function carregarFiliaisDoGestor() {
    const emailGestor = localStorage.getItem("gestorEmail") || "";
    if (!emailGestor) return;
  
    const gestoresRef = collection(db, "gestores");
    const q = query(gestoresRef, where("email", "==", emailGestor));
    const snapshot = await getDocs(q);
  
    if (!snapshot.empty) {
      const dados = snapshot.docs[0].data();
      const filiais = dados.filial || [];
      localStorage.setItem("gestorFilial", JSON.stringify(filiais));
      document.getElementById("dynamic-title").textContent = `Filiais: ${filiais.join(", ")}`;
      carregarDados();
    } else {
      alert("Gestor não encontrado no banco.");
    }
  }
  
  async function carregarDados() {
    const querySnapshot = await getDocs(collection(db, tipoChecklist));
    dadosTotais = [];

    const filiaisLogadas = JSON.parse(localStorage.getItem("gestorFilial") || "[]");

    querySnapshot.forEach(docItem => {
      const dados = docItem.data();

      // Só adiciona se for da mesma filial
      if (filiaisLogadas.map(f => f.toLowerCase().trim()).includes((dados.filial || "").toLowerCase().trim())) {
        dadosTotais.push({ id: docItem.id, ...dados });
      }
    });
    
          console.log("Total encontrado:", dadosTotais.length, dadosTotais);

    aplicarFiltros();
  }

function aplicarFiltros() {
  const clienteFiltro = document.getElementById("filtro-cliente").value.toLowerCase();
  const statusFiltro = document.getElementById("filtro-status").value;
  const consultorFiltro = document.getElementById("filtro-consultor").value.toLowerCase();
  const periodo = document.getElementById("filtro-periodo").value.trim();

  const instance = document.getElementById("filtro-periodo")._flatpickr;
  const selectedDates = instance.selectedDates;

  let dataInicio = "", dataFim = "";
  if (selectedDates.length === 2) {
    dataInicio = selectedDates[0].toISOString().slice(0, 10); // yyyy-mm-dd
    dataFim    = selectedDates[1].toISOString().slice(0, 10);
  } else if (selectedDates.length === 1) {
    dataInicio = dataFim = selectedDates[0].toISOString().slice(0, 10);
  }

  const painel = document.getElementById("painel-detalhes");
  painel.innerHTML = "";

  const filtrados = dadosTotais.filter(d => {
    const cliente = (d.nomeCliente || "").toLowerCase();
    const status = d.statusChecklist || "";
    const consultor = (d.consultor || "").toLowerCase();
    const dataFormatada = d.dataVisita || "";

    const dentroDoPeriodo =
      (!dataInicio && !dataFim) ||
      (
        (!dataInicio || dataFormatada >= dataInicio) &&
        (!dataFim || dataFormatada <= dataFim)
      );

    return cliente.includes(clienteFiltro) &&
           (statusFiltro === "" || status === statusFiltro) &&
           consultor.includes(consultorFiltro) &&
           dentroDoPeriodo;
  });

  // CONTADORES E RENDERIZAÇÃO
  document.getElementById("total-clientes").textContent = filtrados.length;
  document.getElementById("total-concluidos").textContent = filtrados.filter(d => d.statusChecklist === "Concluído").length;
  document.getElementById("cancelados").textContent = filtrados.filter(d => d.statusChecklist === "Cancelado").length;

  let totalValor = 0;
  filtrados.forEach(d => {
    if (!isNaN(d.valorNegociado)) totalValor += Number(d.valorNegociado);
    const statusClass = d.statusChecklist === "Concluído" ? "status-concluido" :
                        d.statusChecklist === "Cancelado" ? "status-cancelado" :
                        d.statusChecklist === "Em andamento" ? "status-em-andamento" : "";

  painel.innerHTML += `
    <tr class="${statusClass}">
      <td>${d.dataVisita || "-"}</td>
      <td>${d.nomeCliente || "-"}</td>
      <td>${d.nomeFazenda || "-"}</td>
      <td>${d.municipio || "-"}</td>
      <td>${d.consultor || "-"}</td>
      <td>${d.modelo || "-"}</td>
      <td>${d.horimetro || "-"}</td>
      <td style="text-align: center;">
        ${
          d.telefone
            ? `<a href="https://wa.me/55${d.telefone.replace(/\D/g, '')}" 
                  target="_blank" 
                  title="Chamar no WhatsApp"
                  style="color: #25D366; font-size: 22px; display: inline-block;">
                <i class="fa-brands fa-whatsapp"></i>
              </a>`
            : "-"
        }
      </td>
      <td data-comentario="${d.comentarioResponsavel || ''}" data-valor="${d.valorNegociado || 0}">
        ${d.observacoes || "-"}
      </td>
      <td>${(d.checklist || []).map(item => `<span style="background:#fff; color:#00205b; padding:3px 8px; border-radius:5px; margin:2px; display:inline-block; font-size:10px">${item}</span>`).join("")}</td>
      <td class="acoes"><button class="btn-acao" data-id="${d.id}" title="Abrir ações">➕</button></td>
    </tr>`;
  });

  document.getElementById("valor-total").textContent = `R$ ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  document.querySelectorAll(".acoes button").forEach(btn => {
    btn.addEventListener("click", () => abrirPopup(btn.getAttribute("data-id")));
  });
}

  async function abrirPopup(id) {
    document.getElementById("popup").style.display = "flex";
    document.getElementById("docIdSelecionado").value = id;
    const docRef = doc(db, tipoChecklist, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const dados = docSnap.data();
      document.getElementById("comentario").value = dados.comentarioResponsavel || "";
      document.getElementById("statusChecklist").value = dados.statusChecklist || "Em andamento";
      document.getElementById("valorNegociado").value = dados.valorNegociado || "";
    }
  }

  function fecharPopup() {
    document.getElementById("popup").style.display = "none";
  }

  async function salvarPopup() {
    const id = document.getElementById("docIdSelecionado").value;
    const comentario = document.getElementById("comentario").value;
    const status = document.getElementById("statusChecklist").value;
    const valor = parseFloat(document.getElementById("valorNegociado").value) || 0;
    const docRef = doc(db, tipoChecklist, id);
    await updateDoc(docRef, {
      comentarioResponsavel: comentario,
      statusChecklist: status,
      valorNegociado: valor
    });
    fecharPopup();
    carregarDados();
  }

  window.fecharPopup = fecharPopup;
  window.salvarPopup = salvarPopup;
  
  document.addEventListener("DOMContentLoaded", () => {
  carregarFiliaisDoGestor();
  lucide.createIcons();

  document.getElementById("filtro-cliente").addEventListener("input", aplicarFiltros);
  document.getElementById("filtro-status").addEventListener("change", aplicarFiltros);
  document.getElementById("filtro-consultor").addEventListener("input", aplicarFiltros);

  flatpickr("#filtro-periodo", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "pt",
    onChange: aplicarFiltros
  });

  // ⏱ Atualizar automaticamente a cada 60 segundos
  setInterval(() => {
    console.log("Atualizando dados do painel...");
    carregarDados();
  }, 60000); // 1 minuto
});
//Função exportar.

document.getElementById("btn-exportar").addEventListener("click", () => {
  const headers = [
    "Data da Visita", "Cliente", "Fazenda", "Município", "Consultor",
    "Modelo", "Horímetro", "Telefone", "Observações", "Checklist",
    "Comentário", "Valor (R$)", "Status"
  ];

  const linhas = Array.from(document.querySelectorAll("#painel-detalhes tr")).map(tr => {
    const tds = tr.querySelectorAll("td");
    return [
      tds[0]?.textContent.trim(), // Data da Visita
      tds[1]?.textContent.trim(), // Cliente
      tds[2]?.textContent.trim(), // Fazenda
      tds[3]?.textContent.trim(), // Município
      tds[4]?.textContent.trim(), // Consultor
      tds[5]?.textContent.trim(), // Modelo
      tds[6]?.textContent.trim(), // Horímetro
      tds[7]?.textContent.trim(), // Telefone
      tds[8]?.textContent.trim(), // Observações
      tds[9]?.innerText.trim(),   // Checklist
      tds[8]?.getAttribute("data-comentario") || "",   // Comentário
      tds[8]?.getAttribute("data-valor") || "",        // Valor
      tr.classList.contains("status-concluido") ? "Concluído" :
      tr.classList.contains("status-cancelado") ? "Cancelado" :
      tr.classList.contains("status-em-andamento") ? "Em andamento" : ""
    ];
  });

  const planilha = XLSX.utils.aoa_to_sheet([headers, ...linhas]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, planilha, "Checklist");

  XLSX.writeFile(wb, "checklists_filtrados.xlsx");
});


;

  if (localStorage.getItem("gestorLogado") !== "true") {
    alert("Acesso restrito! Faça login como gestor.");
    window.location.href = "index.html";
  }

;

  if (localStorage.getItem("gestorLogado") !== "true") {
    alert("Acesso restrito! Faça login como gestor.");
    window.location.href = "index.html";
  } else {
    const filiais = JSON.parse(localStorage.getItem("gestorFilial") || "[]");
    document.getElementById("dynamic-title").textContent = `Filiais: ${filiais.join(", ") || "Desconhecida"}`;
  }
