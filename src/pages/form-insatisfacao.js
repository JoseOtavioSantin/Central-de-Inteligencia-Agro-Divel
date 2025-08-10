// Extracted from form-insatisfacao.html
document.addEventListener("DOMContentLoaded", () => {
      const hoje = new Date().toISOString().split('T')[0];
      document.getElementById('dataVisita').value = hoje;

      const municipiosPorFilial = {
        "Campos Novos": [
          "Campos Novos", "Abdon Batista", "Vargem", "Zortéa", "Brunópolis", "Monte Carlo", "Frei Rogério",
          "Joaçaba", "Luzerna", "Herval d’Oeste", "Erval Velho",
          "Concórdia", "Irani", "Lindóia do Sul", "Presidente Castello Branco", "Peritiba", "Ipira", "Piratuba",
          "Capinzal", "Ouro", "Lacerdópolis",
          "Caçador", "Calmon", "Matos Costa", "Lebon Régis", "Timbó Grande", "Rio das Antas", "Santa Cecília",
          "Curitibanos", "São Cristóvão do Sul", "Ponte Alta do Norte",
          "Videira", "Iomerê", "Tangará", "Pinheiro Preto", "Arroio Trinta", "Ibicaré", "Treze Tílias"
        ],
        "Rio do Sul": [
          "Vitor Meireles", "José Boiteux", "Witmarsum",
          "Presidente Getúlio", "Dona Emma", "Ibirama", "Presidente Nereu",
          "Pouso Redondo", "Salete", "Taió", "Mirim Doce",
          "Ituporanga", "Petrolândia", "Imbuia", "Atalanta",
          "Aurora", "Laurentino", "Rio do Oeste", "Agronômica",
          "Rio do Sul", "Lontras", "Agrolândia", "Trombudo Central"
        ],
        "Lages": [
          "Correia Pinto", "Ponte Alta", "São José do Cerrito",
          "Anita Garibaldi", "Campo Belo do Sul", "Capão Alto", "Cerro Negro",
          "Bom Retiro", "Urubici", "Urupema", "Rio Rufino", "São Joaquim",
          "Bocaina do Sul", "Otacílio Costa", "Palmeira", "Painel",
          "Lages"
        ]
      };

      const consultoresPorFilial = {
        "Campos Novos": ["João Silva", "Maria Oliveira"],
        "Rio do Sul": ["Carlos Souza", "Fernanda Lima"],
        "Lages": ["Pedro Martins", "Ana Paula"]
      };

      const filialSelect = document.getElementById("filial");
      const municipioSelect = document.getElementById("municipio");
      const consultorSelect = document.getElementById("nomeConsultor");

      municipioSelect.disabled = true;
      consultorSelect.disabled = true;

      filialSelect.addEventListener("change", () => {
        const filial = filialSelect.value;

        // Atualiza municípios
        const municipios = municipiosPorFilial[filial] || [];
        municipioSelect.disabled = !filial;
        municipioSelect.innerHTML = '<option value="">Selecione um município</option>';
        municipios.forEach((nome) => {
          const option = document.createElement("option");
          option.value = nome;
          option.textContent = nome;
          municipioSelect.appendChild(option);
        });

        // Atualiza consultores
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
    });
