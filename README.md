# 🌤️ App de Previsão do Tempo

---

<div align="center"> 
   <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge" /> 
   <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge" /> 
   <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge" /> 
   <img src="https://img.shields.io/badge/Open_Meteo_API-00A4D3?style=for-the-badge&logo=json&logoColor=white" alt="API Badge" />
</div>

<br />

O **App de Previsão do Tempo** é uma aplicação web ágil e responsiva que permite aos usuários consultarem a temperatura atual de qualquer cidade do mundo. O projeto foi construído do zero com **HTML, CSS e Vanilla JavaScript**, consumindo dados em tempo real através da API meteorológica gratuita do Open-Meteo.

------

## ✨ Funcionalidades

- **Busca Global Rápida:** Encontre o clima atual simplesmente digitando o nome da cidade.
- **Consumo de APIs Múltiplas:** - *Geocoding API:* Transforma o nome da cidade em coordenadas (Latitude/Longitude).
  - *Forecast API:* Busca a temperatura exata com base nas coordenadas.
- **Tratamento de Erros:** Alertas visuais amigáveis caso a cidade não seja encontrada ou o campo seja submetido em branco.
- **Acessibilidade & UX (Experiência do Usuário):**
  - Busca facilitada através da tecla `Enter`.
  - Feedback visual no botão durante o carregamento dos dados ("Buscando...").
  - Animações suaves de transição entre telas.
  - Respeito à preferência do sistema do usuário para movimento reduzido (`prefers-reduced-motion`).

------

## 📁 Estrutura do Projeto

```text
📁 previsao-do-tempo/
│
├── index.html    # Estrutura semântica e interface da aplicação
├── style.css     # Estilização, layout mobile-first e animações
└── api.js        # Lógica de busca, manipulação de DOM e requisições HTTP
```

------

## 🚀 Tecnologias e Conceitos Utilizados

- **HTML5:** Estrutura limpa, utilizando semântica e suporte a gráficos SVG embutidos.
- **CSS3:** - Metodologia **Mobile-First**.
  - Tipografia e dimensionamento fluidos utilizando funções matemáticas (`clamp()`, `max()`).
  - Flexbox para alinhamento centralizado perfeito.
  - Variáveis de ambiente e pseudo-classes de estado (`:hover`, `:active`, `:focus`).
- **JavaScript (ES6+):**
  - Assincronismo com `async / await` e blocos `try / catch / finally`.
  - Fetch API para consumo de dados RESTful.
  - Desestruturação de objetos (Destructuring).
- **APIs Públicas:** [Open-Meteo](https://open-meteo.com/) (Serviço gratuito que não exige chave de autenticação).

------

## 💻 Executando Localmente

Como o projeto utiliza apenas tecnologias front-end nativas e uma API pública sem necessidade de chaves privadas, rodar o projeto localmente é super simples.

### Passos

1. Clone este repositório em sua máquina:
   ```bash
   git clone https://github.com/erickystn/projeto_clima.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd seu-repositorio
   ```

3. Para visualizar a aplicação, basta abrir o arquivo `index.html` diretamente no seu navegador de preferência.
   > **Dica:** Para uma melhor experiência de desenvolvimento, abra o projeto no [Visual Studio Code](https://code.visualstudio.com/) e utilize a extensão **Live Server**.

------

## 💡 Diferenciais do Código

- **Performance Extrema:** Feito puramente com Vanilla JS e sem dependências pesadas de bibliotecas de terceiros.
- **Design Moderno:** Interface de usuário (UI) clean, com uma paleta de cores baseada em tons de azul celeste e cartões com leve efeito de elevação (box-shadow).
- **Código Escalável:** Funções JavaScript bem divididas (geocodificação, busca de clima, handlers de eventos e manipuladores de UI), facilitando manutenções e novas implementações futuras.
