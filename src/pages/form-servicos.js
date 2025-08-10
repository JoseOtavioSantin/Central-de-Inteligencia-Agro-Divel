// Extracted from form-servicos.html
document.addEventListener("DOMContentLoaded", () => {
      const hoje = new Date().toISOString().split('T')[0];
      document.getElementById('dataVisita').value = hoje;

      const municipiosPorFilial = {

          "Campos Novos": [
          // Região Campos Novos
          "Campos Novos", "Abdon Batista", "Vargem", "Zortéa", "Brunópolis", "Monte Carlo", "Frei Rogério",
          
          // Região Joaçaba
          "Joaçaba", "Luzerna", "Herval d’Oeste", "Erval Velho",

          // Região Concórdia
          "Concórdia", "Irani", "Lindóia do Sul", "Presidente Castello Branco", "Peritiba", "Ipira", "Piratuba",

          // Região Capinzal
          "Capinzal", "Ouro", "Lacerdópolis",

          // Região Caçador
          "Caçador", "Calmon", "Matos Costa", "Lebon Régis", "Timbó Grande", "Rio das Antas", "Santa Cecília",

          // Região Curitibanos
          "Curitibanos", "São Cristóvão do Sul", "Ponte Alta do Norte",

          // Região Videira
          "Videira", "Iomerê", "Tangará", "Pinheiro Preto", "Arroio Trinta", "Ibicaré", "Treze Tílias"
        ],

        "Rio do Sul": [
          // Região Vitor Meireles
          "Vitor Meireles", "José Boiteux", "Witmarsum",

          // Região Presidente Getúlio
          "Presidente Getúlio", "Dona Emma", "Ibirama", "Presidente Nereu",

          // Região Pouso Redondo
          "Pouso Redondo", "Salete", "Taió", "Mirim Doce",

          // Região Ituporanga
          "Ituporanga", "Petrolândia", "Imbuia", "Atalanta",

          // Região Aurora
          "Aurora", "Laurentino", "Rio do Oeste", "Agronômica",

          // Outras já existentes
          "Rio do Sul", "Lontras", "Agrolândia", "Trombudo Central"
        ],

        "Lages": [
          // Região São José do Cerrito
          "Correia Pinto", "Ponte Alta", "São José do Cerrito",

          // Região Anita Garibaldi
          "Anita Garibaldi", "Campo Belo do Sul", "Capão Alto", "Cerro Negro",

          // Região Urubici
          "Bom Retiro", "Urubici", "Urupema", "Rio Rufino", "São Joaquim",

          // Região Otacílio Costa
          "Bocaina do Sul", "Otacílio Costa", "Palmeira", "Painel",

          // Região Lages
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
