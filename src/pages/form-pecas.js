// Extracted from form-pecas.html
document.addEventListener("DOMContentLoaded", () => {
      // Preenche data atual
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
  "Rio do Sul": [
    "BRUNA CRISTINA CANANI ANTUNES",
    "FABIANA DE SOUZA SALES L PIRAN",
    "ALAN ROSSONI DE MELO",
    "BRUNO ALVES ANTUNES",
    "DARLON ABREU DE MELO",
    "LUCAS RANSONI CAMPOS MORAIS",
    "RONALDO MATEUS LOPES LEITE",
    "FABIANO DE CARVALHO SOUSA",
    "LUCAS SILVA DE ANDRADE",
    "PAULO FERNANDO FERREIRA",
    "DOUGLAS SAMIR PEREIRA",
    "FERNANDA DA SILVA DE SOUZA",
    "JEFERSON VARELA CARVALHO",
    "JONAS MATEUS DE SOUZA ALMEIDA",
    "MARCIO DIOGO SILVA SOARES",
    "PABLO MOREIRA AMARAL",
    "PEDRO OTAVIO DA SILVA"
  ],
  "Campos Novos": [
    "CARIANA FLORES FERNANDES",
    "EDINA DIAS FLORES",
    "ESTER PADILHA PEGORARO",
    "GABRIELE DO N DE BRITO",
    "MAIARA TEREZINHA CAMARGO",
    "DIEGO RIBEIRO LOPES",
    "GEANE DE DEUS E SILVA CELSO",
    "HUGO LUIS DA SILVA",
    "LEANDRO CRESCENCIO",
    "LUCAS KRAEMER",
    "MICHELE ALVES",
    "PABLO EDUARDO MOREIRA FAGUNDES",
    "REGINALDO PEDRINHO B BIOLCHI",
    "SERGIO LUIZ CALEGARI JUNIOR",
    "EDSON LUCIANO DA SILVA",
    "JOVANIL RODRIGUES DA SILVA",
    "ANGELO MURILO ALVES",
    "CARLOS ANTONIO LAZZARI",
    "CARLOS EDUARDO MELLO ANTUNES",
    "DIMITRI MARATEU XAVIER",
    "GUSTAVO LUIZ FERREIRA",
    "GUSTAVO PADILHA DE JESUS",
    "MATHEUS CESAR VARELA RODRIGUES",
    "SANDRO DA SILVA",
    "VITOR LOPES",
    "ANDRE LUIZ PANVLAK",
    "ALESSANDRO ZIBETTI",
    "ALIANDRA DOS SANTOS FAGUNDES",
    "MAURO TREVISOL CRUZ DA SILVA",
    "SUELLEN SONAGLIO",
    "ALEXANDRE SCHUSTER",
    "CARLOS ALEXANDER B CARUSO",
    "DANIEL CARLOS FRANÇA",
    "EDER JOSE THIBES",
    "GILMAR PINHEIRO",
    "HARLEN DANIEL PINHEIRO",
    "JOSÉ OTÁVIO SANTIN",
    "LUIZ HENRIQUE GONÇALVES",
    "LUIZ HENRIQUE PAGANINI",
    "MARCIO TREVISOL CRUZ DA SILVA",
    "MARCO ANTONIO SILVA",
    "TRINITI PADILHA DE MELLO",
    "VALDEMAR RODRIGUES INACIO"
  ],
  "Lages": [
    "FRANCISCA DA SILVA SOUZA",
    "KEILA MAIARA SANDRI VARELA",
    "TAINÁ LUANA VALLE",
    "FABIO SCHULTZ",
    "GIAN PABLO GADOTTI",
    "SILVIO MEES",
    "ANDRE MARCOS PIRES DE LIMA",
    "GABRIEL MONDINI",
    "RICARDO PICKLER RODRIGUES",
    "RUBENS STAHNKE",
    "RUDINEI BEIGER",
    "CEZAR AUGUSTO WATRAS",
    "DIEGO CARLOS PEREIRA",
    "OSVALDINO SOARES FILHO",
    "ADEMIR KAMMER",
    "ALAN DIRKSEN",
    "ALDO FELAU NETO ROSSETTI",
    "ANDREONE BUZZI",
    "ANDRÉ WILL",
    "DEIVIS FERNANDO FERREIRA",
    "DEIVIS VALMIR WERMEISTER PAHL",
    "FILIPE GUNTHER",
    "MARCOS YAN SIEVES",
    "RODRIGO BENTO",
    "VITOR SOFKA JUNIOR"
  ]
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
