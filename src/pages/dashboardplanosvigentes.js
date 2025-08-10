// Extracted from Dashboardplanosvigentes.html
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    addDoc
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const tipoChecklist = "planosVigentes";
  window.tipoChecklist = tipoChecklist;

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

  const instance = document.getElementById("filtro-periodo")._flatpickr;
  const selectedDates = instance.selectedDates;

  let dataInicio = "", dataFim = "";
  if (selectedDates.length === 2) {
    dataInicio = selectedDates[0].toISOString().slice(0, 10);
    dataFim = selectedDates[1].toISOString().slice(0, 10);
  } else if (selectedDates.length === 1) {
    dataInicio = dataFim = selectedDates[0].toISOString().slice(0, 10);
  }

  const painel = document.getElementById("painel-detalhes");
  painel.innerHTML = "";

  const filtrados = dadosTotais.filter(d => {
    const cliente = (d.nomeCliente || "").toLowerCase();
    const totalChecklist = (d.checklistRealizado || []).length;
    const preenchidos = (d.checklistRealizado || []).filter(item => {
      const dados = (d.datasChecklist || {})[item];
      return dados && dados.os && dados.data;
    });
    const statusChecklistAuto = totalChecklist > 0 && preenchidos.length === totalChecklist ? "Concluído" : "Em andamento";
    d.statusChecklist = statusChecklistAuto;

    const status = statusChecklistAuto;
    const consultor = (d.consultor || "").toLowerCase();
    const dataFormatada = d.dataInicioContrato || "";

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

  // 🔢 Contagens
  const total = filtrados.length;
  const concluidos = filtrados.filter(d => {
    const totalChecklist = (d.checklistRealizado || []).length;
    const preenchidos = (d.checklistRealizado || []).filter(item => {
      const dados = (d.datasChecklist || {})[item];
      return dados && dados.os && dados.data;
    });
    return totalChecklist > 0 && preenchidos.length === totalChecklist;
  }).length;
  const cancelados = filtrados.filter(d => d.statusChecklist === "Cancelado").length;
  const andamento = total - concluidos - cancelados;

  document.getElementById("total-clientes").textContent = total;
  document.getElementById("total-concluidos").textContent = concluidos;
  document.getElementById("em-andamento").textContent = andamento;

  // 💲 Valor total
  let totalValor = 0;
  filtrados.forEach(d => {
    const preco = typeof d.valorNegociado === "number" ? d.valorNegociado : parseFloat(d.valorNegociado);
    if (!isNaN(preco)) totalValor += preco;
  });
  document.getElementById("valor-total").textContent = totalValor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// 🔁 Ordenar: Concluídos por último, alertas no topo
filtrados.sort((a, b) => {
  const statusOrder = (status) => status === "Concluído" ? 1 : 0;
  const alertaA = alertaDoItem(a);
  const alertaB = alertaDoItem(b);

  // Primeiro ordena por status (concluído vai para o final), depois por alerta (alerta vai para o topo)
  if (statusOrder(a.statusChecklist) !== statusOrder(b.statusChecklist)) {
    return statusOrder(a.statusChecklist) - statusOrder(b.statusChecklist);
  }

  return alertaB - alertaA;
});

  // 🧠 Função para checar se item tem alerta
  function alertaDoItem(d) {
    const horasAtuais = parseFloat(d.horasAtuais || 0);
    const checklistsPendentes = (d.checklistRealizado || []).filter(item => !(d.datasChecklist || {})[item]);
    return checklistsPendentes.some(item => {
      const horasChecklist = parseFloat(item);
      return !isNaN(horasChecklist) && horasAtuais >= (horasChecklist - 60) && horasAtuais < horasChecklist;
    }) ? 1 : 0;
  }

  // 🖼️ Renderizar linhas
  filtrados.forEach(d => {
    const totalChecklist = (d.checklistRealizado || []).length;
    const preenchidos = (d.checklistRealizado || []).filter(item => (d.datasChecklist || {})[item]);
    const statusChecklistAuto = totalChecklist > 0 && preenchidos.length === totalChecklist ? "Concluído" : "Em andamento";
    const statusClass = statusChecklistAuto === "Concluído" ? "status-concluido" : "status-em-andamento";

    const horasAtuais = parseFloat(d.horasAtuais || 0);
    const checklistsPendentes = (d.checklistRealizado || []).filter(item => !(d.datasChecklist || {})[item]);
    const alerta = checklistsPendentes.some(item => {
      const horasChecklist = parseFloat(item);
      return !isNaN(horasChecklist) && horasAtuais >= (horasChecklist - 60) && horasAtuais < horasChecklist;
    });
    const alertaClass = alerta ? "linha-alerta" : "";

    const checklistOrdenado = [...(d.checklistRealizado || [])];

// Coloca "ÓLEO" primeiro se existir
checklistOrdenado.sort((a, b) => {
  if (a === "ÓLEO") return -1;
  if (b === "ÓLEO") return 1;
  return parseFloat(a) - parseFloat(b);
});

const checklistHtml = checklistOrdenado.map(item => {
  const infoChecklist = (d.datasChecklist || {})[item];
  let dataFormatada = "";
  let osInfo = "";

  if (typeof infoChecklist === "object" && infoChecklist !== null) {
    dataFormatada = formatarDataBR(infoChecklist.data);
    osInfo = infoChecklist.os ? ` - OS.${infoChecklist.os}` : "";
  } else {
    dataFormatada = formatarDataBR(infoChecklist);
  }

  const isOleo = item === "ÓLEO";
  const corFundo = infoChecklist
    ? (isOleo ? '#006666' : '#4caf50') // Verde normal ou azul petróleo se for óleo
    : '#fff';

  const corTexto = infoChecklist ? '#fff' : (isOleo ? '#006666' : '#00205b');

  const iconeOleo = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" style="margin-right:4px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path d="M12 3c.8 2.5 4 5.3 4 8.1a4 4 0 0 1-8 0c0-2.8 3.2-5.6 4-8.1Z"/>
    <path d="M9 21h6"/>
  </svg>`;

  const label = isOleo ? `${iconeOleo}`: item;

  return `<button 
    onclick="abrirDataChecklist('${d.id}','${item}','${infoChecklist?.data || infoChecklist || ''}', '${infoChecklist?.os || ''}')"
    style="background:${corFundo}; color:${corTexto}; padding:3px 8px; border:none; border-radius:5px; margin:2px; font-size:10px; cursor:pointer; display:flex; align-items:center; gap:4px;"
    ${infoChecklist ? 'disabled' : ''}
  >${label}${osInfo}${dataFormatada ? ` - ${dataFormatada}` : ''}</button>`;
}).join("");

    painel.innerHTML += `
      <tr class="${statusClass} ${alertaClass}">
        <td>${formatarDataBR(d.dataInicioContrato)}</td>
        <td>${formatarDataBR(d.dataFimContrato)}</td>
        <td>${d.nomeCliente || "-"}</td>
        <td>${d.planoVendido || "-"}</td>
        <td>${d.chassi || "-"}</td>
        <td>${d.modelo || "-"}</td>
        <td>${d.horasIniciais || "-"}</td>
        <td>${d.horasFinais || "-"}</td>
        <td>
          ${d.horasAtuais || "-"}
          ${alerta ? `<span title="Checklist se aproxima" style="color: orange; margin-left: 6px;">⚠️</span>` : ""}
        </td>
        <td>${checklistHtml}</td>
      </tr>`;
  });
}


  // Expor Firebase e funções necessárias para os outros scripts
  window.db = db;
  window.doc = doc;
  window.getDoc = getDoc;
  window.updateDoc = updateDoc;
  window.addDoc = addDoc;
  window.collection = collection;
  window.carregarFiliaisDoGestor = carregarFiliaisDoGestor;
  window.carregarDados = carregarDados;

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

    if (status === "Concluído") {
      // Abre o segundo popup
      document.getElementById("popupConclusao").style.display = "flex";
    } else {
      carregarDados(); // só recarrega se não for concluído
    }

  }

  window.fecharPopup = fecharPopup;
  window.salvarPopup = salvarPopup;

  async function salvarConclusao() {
  const id = document.getElementById("docIdSelecionado").value;

  // Busca os dados originais do checklist (nome do cliente e outros)
  const docRefOriginal = doc(db, tipoChecklist, id);
  const docSnap = await getDoc(docRefOriginal);
  if (!docSnap.exists()) {
    alert("Erro: não foi possível encontrar os dados originais.");
    return;
  }

  const dadosOriginais = docSnap.data();
  const nomeCliente = dadosOriginais.nomeCliente || "";
  const consultor = dadosOriginais.consultor || "";
  const planoVendido = dadosOriginais.planoVendido || "";
  const modelo = dadosOriginais.modelo || "";
  const fazenda = dadosOriginais.nomeFazenda || "";

  // Dados do segundo popup
  const chassi = document.getElementById("chassiFinal").value;
  const horasIni = parseFloat(document.getElementById("horasIniciais").value) || 0;
  const horasFim = parseFloat(document.getElementById("horasFinais").value) || 0;
  const dataInicio = document.getElementById("dataInicioContrato").value;
  const dataFim = document.getElementById("dataFimContrato").value;

  const checkboxes = document.querySelectorAll('#popupConclusao input[type="checkbox"]:checked');
  const checklistRealizado = Array.from(checkboxes).map(cb => cb.value);

  // Salva na coleção `planosVigentes`
  const novaEntrada = {
    nomeCliente,
    consultor,
    PlanoVendido,
    modelo,
    fazenda,
    chassi,
    horasIniciais: horasIni,
    horasFinais: horasFim,
    dataInicioContrato: dataInicio,
    dataFimContrato: dataFim,
    checklistRealizado,
    dataCriacao: new Date().toISOString()
  };

  await addDoc(collection(db, "planosVigentes"), novaEntrada);

  fecharPopupConclusao();
  carregarDados(); // Atualiza a tela
  
}


function fecharPopupConclusao() {
  document.getElementById("popupConclusao").style.display = "none";
}

window.salvarConclusao = salvarConclusao;
window.fecharPopupConclusao = fecharPopupConclusao;
window.abrirPopup = abrirPopup;

    
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
    "Data Início", "Data Fim", "Cliente", "Chassi", "Modelo",
    "Horas Iniciais", "Horas Finais", "Horas Atuais", "Checklist"
  ];

  const linhas = Array.from(document.querySelectorAll("#painel-detalhes tr")).map(tr => {
    const tds = tr.querySelectorAll("td");
    return [
    tds[0]?.textContent.trim(), // Data Início
    tds[1]?.textContent.trim(), // Data Fim
    tds[2]?.textContent.trim(), // Cliente
    tds[3]?.textContent.trim(), // Consultor
    tds[4]?.textContent.trim(), // Fazenda
    tds[5]?.textContent.trim(), // Município
    tds[6]?.textContent.trim(), // Modelo
    tds[7]?.textContent.trim(), // Horas Iniciais
    tds[8]?.textContent.trim(), // Horas Finais
    tds[9]?.innerText.trim()    // Checklist
    ];
  });

  const planilha = XLSX.utils.aoa_to_sheet([headers, ...linhas]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, planilha, "Checklist");

  XLSX.writeFile(wb, "checklists_filtrados.xlsx");
});


//script importar

document.getElementById("btn-importar").addEventListener("click", () => {
  document.getElementById("arquivo-importar").click();
});

document.getElementById("arquivo-importar").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const loading = document.getElementById("loadingImport");
  loading.style.display = "flex"; // Mostrar overlay escuro

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const registros = XLSX.utils.sheet_to_json(sheet);

      let atualizados = 0;

      for (const linha of registros) {
        const chassi = String(linha["Chassi"] || "").trim();
        const horas = parseFloat(String(linha["Horas"]).replace(",", "."));

        if (!chassi || isNaN(horas)) continue;

        const q = query(collection(db, "planosVigentes"), where("chassi", "==", chassi));
        const snapshot = await getDocs(q);

        if (snapshot.empty) continue;

        for (const docSnap of snapshot.docs) {
          const ref = doc(db, "planosVigentes", docSnap.id);
          await updateDoc(ref, { horasAtuais: horas });
          atualizados++;
        }
      }

      alert(`✅ Importação concluída.\n\n🔄 Atualizados: ${atualizados}`);
      carregarDados(); // Atualiza a tabela

    } catch (err) {
      alert("❌ Erro durante a importação: " + err.message);
    } finally {
      loading.style.display = "none"; // Esconde o overlay
    }
  };

  reader.readAsArrayBuffer(file);
});

//fim import


//fim type="module">

;

  if (localStorage.getItem("gestorLogado") !== "true") {
    alert("Acesso restrito! Faça login como gestor.");
    window.location.href = "index.html";
  } else {
    const filiais = JSON.parse(localStorage.getItem("gestorFilial") || "[]");
    document.getElementById("dynamic-title").textContent = `Filiais: ${filiais.join(", ") || "Desconhecida"}`;
  }

;

function abrirFormularioNovoPlano() {
  document.getElementById("popupNovoPlano").style.display = "flex";
}

function fecharNovoPlano() {
  document.getElementById("popupNovoPlano").style.display = "none";
}

async function salvarNovoPlano() {
const nomeCliente = document.getElementById("novoCliente").value.trim();
  const planoVendido = document.getElementById("novoPlanoVendido").value.trim();
  const modelo = document.getElementById("novoModelo").value.trim();
  const chassi = document.getElementById("novoChassi").value.trim();
  const horasIniciais = parseFloat(document.getElementById("novoHorasIni").value) || 0;
  const horasFinais = parseFloat(document.getElementById("novoHorasFim").value) || 0;
  const dataInicioContrato = document.getElementById("novoDataIni").value;
  const dataFimContrato = document.getElementById("novoDataFim").value;
  const valorNegociado = parseFloat(document.getElementById("novoValorNegociado").value) || 0;


  // Coleta os checklists marcados
  const checkboxes = document.querySelectorAll(".checklistNovoPlano:checked");
  const checklistRealizado = Array.from(checkboxes).map(cb => cb.value);

  const filiais = JSON.parse(localStorage.getItem("gestorFilial") || "[]");
  const filial = filiais[0] || "Não informado";

  const novoPlano = {
    nomeCliente,
    planoVendido,
    modelo,
    chassi,
    horasIniciais,
    horasFinais,
    dataInicioContrato,
    dataFimContrato,
    checklistRealizado,
    datasChecklist: {},
    statusChecklist: "Em andamento",
    valorNegociado,
    comentarioResponsavel: "",
    dataCriacao: new Date().toISOString(),
    filial
  };

  await addDoc(collection(db, "planosVigentes"), novoPlano);

  fecharNovoPlano();
  carregarDados();
  limparFormularioNovoPlano();
}

function limparFormularioNovoPlano() {
  document.getElementById("novoCliente").value = "";
  document.getElementById("novoPlanoVendido").value = "";
  document.getElementById("novoModelo").value = "";
  document.getElementById("novoChassi").value = "";
  document.getElementById("novoHorasIni").value = "";
  document.getElementById("novoHorasFim").value = "";
  document.getElementById("novoDataIni").value = "";
  document.getElementById("novoDataFim").value = "";
  document.getElementById("novoValorNegociado").value = "";

  // Desmarca todos os checkboxes
  const checkboxes = document.querySelectorAll(".checklistNovoPlano");
  checkboxes.forEach(cb => cb.checked = false);

  // Remove checklists adicionados manualmente
  const container = document.getElementById("checklist-container");
  const fixos = ["Óleo", "100", "300", "600", "900", "1200"];
  container.querySelectorAll("input[type='checkbox']").forEach(cb => {
    if (!fixos.includes(cb.value)) {
      cb.parentElement.remove(); // remove o <label> inteiro
    }
  });

  // Limpa campo de input manual (caso tenha esse ID no popup)
  const campoManual = document.getElementById("inputChecklistManual");
  if (campoManual) campoManual.value = "";
}

function adicionarChecklistManual() {
  const valor = document.getElementById("inputChecklistManual").value.trim();
  if (!valor || isNaN(valor)) return alert("Digite um número válido.");

  const container = document.getElementById("checklist-container");

  // Cria novo checkbox dinamicamente
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" class="checklistNovoPlano" value="${valor}" checked /> ${valor}`;
  container.appendChild(label);

  document.getElementById("inputChecklistManual").value = ""; // limpa o campo
}

;

    function abrirDataChecklist(id, valor, dataPreenchida, osPreenchida = "") {
      document.getElementById('docIdChecklistData').value = id;
      document.getElementById('valorChecklistData').value = valor;
      document.getElementById('inputDataChecklist').value = dataPreenchida || "";
      document.getElementById('osChecklistData').value = osPreenchida || "";
      document.getElementById('popupChecklistData').style.display = 'flex';
    }

  function fecharPopupDataChecklist() {
    document.getElementById('popupChecklistData').style.display = 'none';
  }

  async function salvarDataChecklist() {
    const id = document.getElementById('docIdChecklistData').value;
    const valor = document.getElementById('valorChecklistData').value;
    const data = document.getElementById('inputDataChecklist').value;
    const os = document.getElementById('osChecklistData').value.trim();
    if (!data) return alert("Preencha a data antes de salvar.");
    const docRef = doc(db, tipoChecklist, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return alert("Erro ao salvar.");
    const dados = docSnap.data();
    const datasChecklist = dados.datasChecklist || {};
    datasChecklist[valor] = { data, os };
    await updateDoc(docRef, { datasChecklist });
    fecharPopupDataChecklist();
    carregarDados();
  }

  // Torna as funções acessíveis globalmente
  window.abrirDataChecklist = abrirDataChecklist;
  window.fecharPopupDataChecklist = fecharPopupDataChecklist;
  window.salvarDataChecklist = salvarDataChecklist;

function formatarDataBR(data) {
  if (!data) return "";

  // Se for objeto Date (ex: Firestore Timestamp convertido)
  if (data instanceof Date) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // Se for string (ex: "2025-08-04" ou "2025/08/04")
  const partes = data.split(/[-/]/); // divide por "-" ou "/"
  if (partes.length !== 3) return data;

  // Garante formato dd/mm/aaaa
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
