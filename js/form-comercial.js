
import { municipiosPorFilial } from './municipios.js';
import { consultoresPorFilial } from './consultores.js';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('dataVisita').value = new Date().toISOString().split('T')[0];

  const filialSelect = document.getElementById("filial");
  const municipioSelect = document.getElementById("municipio");
  const consultorSelect = document.getElementById("nomeConsultor");

  municipioSelect.disabled = true;
  consultorSelect.disabled = true;

  filialSelect.addEventListener("change", () => {
    const filial = filialSelect.value;

    const municipios = municipiosPorFilial[filial] || [];
    municipioSelect.disabled = !filial;
    municipioSelect.innerHTML = '<option value="">Selecione um município</option>';
    municipios.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      municipioSelect.appendChild(option);
    });

    const consultores = consultoresPorFilial[filial] || [];
    consultorSelect.disabled = !filial;
    consultorSelect.innerHTML = '<option value="">Selecione o consultor</option>';
    consultores.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      consultorSelect.appendChild(option);
    });
  });

  const checkboxTrator = document.getElementById('temTratorTroca');
  const campoModeloTrator = document.getElementById('modeloTratorContainer');

  checkboxTrator.addEventListener('change', () => {
    campoModeloTrator.style.display = checkboxTrator.checked ? 'block' : 'none';
  });
});
