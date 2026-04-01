# 🌤️ App de Previsão do Tempo

---

<div align="center"> 
   <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge" /> 
   <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge" /> 
   <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge" /> 
   <img src="https://img.shields.io/badge/Open_Meteo_API-00A4D3?style=for-the-badge&logo=json&logoColor=white" alt="API Badge" />
</div>

<br />

O **App de Previsão do Tempo** é uma aplicação web ágil e responsiva que permite aos usuários consultarem a temperatura atual e a **previsão estendida** de qualquer cidade do mundo. O projeto foi construído do zero com **HTML, CSS e Vanilla JavaScript**, consumindo dados em tempo real através da API meteorológica gratuita do Open-Meteo.

------

## ✨ Funcionalidades

- **Busca Global Rápida:** Encontre o clima atual simplesmente digitando o nome da cidade.
- **Previsão Estendida:** Acompanhe a previsão do tempo detalhada para os próximos 4 dias, com ícones dinâmicos.
- **Temperaturas Extremas:** Exibição da temperatura máxima e mínima diária, tanto para o dia atual quanto para os próximos dias.
- **Tema Dinâmico (Dia/Noite):** A interface adapta automaticamente as cores de fundo (background) com base no horário local (dia ou noite) da cidade pesquisada.
- **Mapeamento Climático Global:** Suporte a 100% dos códigos de condição climática da WMO (Organização Meteorológica Mundial), garantindo precisão visual até em eventos de granizo, chuvas congelantes e nevascas.
- **Consumo de APIs Múltiplas:** - *Geocoding API:* Transforma o nome da cidade em coordenadas (Latitude/Longitude).
  - *Forecast API:* Busca a temperatura atual, indicador de dia/noite e previsão diária completa com base nas coordenadas.
- **Tratamento de Erros:** Alertas visuais amigáveis caso a cidade não seja encontrada ou o campo seja submetido em branco.
- **Acessibilidade & UX (Experiência do Usuário):**
  - Busca facilitada através da tecla `Enter`.
  - Feedback visual no botão durante o carregamento dos dados ("Buscando...").
  - Animações suaves de transição entre telas.
  - Respeito à preferência do sistema do usuário para movimento reduzido (`prefers-reduced-motion`).

------

## 🏗️ Estrutura do Projeto

```text
📁 projeto_clima/
│
├── index.html        # Estrutura e semântica da aplicação
├── style.css         # Estilização fluida e mobile-first
├── api.js            # Regras de negócio, requisições (Fetch API) e DOM
├── package.json      # Configuração do ambiente Node e scripts
│
└── 📁 tests/
    └── api.test.js   # Suíte de testes unitários automatizados
```

------

## 🛠️ Exemplo de Uso

Utilizar a aplicação é extremamente simples e intuitivo:

1. Ao abrir a aplicação, você verá a tela inicial com um campo de texto.
2. Clique no campo de texto e digite o nome da cidade desejada (Ex: `Tóquio`, `Rio de Janeiro`, `Nova York`).
3. Clique no botão **Buscar** ou pressione a tecla `Enter`.
4. A tela fará uma transição suave e exibirá o painel de resultados contendo:
   - A temperatura atual e as máximas/mínimas do dia.
   - O clima atual descrito em texto (ex: "Tempestade com granizo") e seu respectivo ícone.
   - Uma lista com a previsão estendida para os próximos 4 dias.
5. Para fazer uma nova busca, basta clicar no botão azul com o ícone de "Casa" localizado na parte inferior da tela.

------

## 🧪 Qualidade de Código, IA e Testes

O projeto segue padrões avançados de mercado para garantir a estabilidade das funcionalidades:

1. **Desenvolvimento Assistido por IA:** A arquitetura, refatoração e expansão de funcionalidades contaram com o auxílio de inteligência artificial atuando como *pair programming*. Isso garantiu soluções algorítmicas otimizadas, melhores práticas de código limpo e entregas com padrão de qualidade sênior.
2. **Documentação (JSDoc):** Todas as funções JavaScript estão estritamente documentadas com Docstrings, detalhando parâmetros, exceções lançadas e tipos de retorno.
3. **Testes Automatizados (Jest):** O comportamento lógico da API foi totalmente coberto por testes unitários simulados (Mocks). 

**Cenários testados:**
* Sucesso no retorno dos dados e tratamento para cidades inexistentes.
* Validações de campos vazios e quebras de contrato estrutural da API.
* Comportamento perante falhas da API (Erro 500) e excessos de requisições (Status 429).
* Abordagem defensiva contra lentidão de rede (Timeout configurado).

------

## 🛡️ Relatório de Auditoria de Segurança e Privacidade

Durante o desenvolvimento, o projeto passou por uma rigorosa auditoria de segurança com base nas melhores práticas para aplicações Front-End. Abaixo estão os pontos fortes e o plano de mitigação de riscos:

### ✅ Pontos Positivos (Segurança Implementada)
- **Ausência de Chaves de API (API Keys):** O uso da API pública do Open-Meteo zera o risco de vazamento de credenciais via repositórios públicos ou engenharia reversa.
- **Comunicação Criptografada:** Todas as chamadas `fetch` utilizam o protocolo `https://`, prevenindo ataques de interceptação (Man-in-the-Middle).
- **Sanitização de URL:** O input do usuário passa por `encodeURIComponent()` antes da requisição HTTP, evitando malformação de rotas e atuando como uma camada contra injeções de parâmetros.
- **Prevenção Básica contra XSS:** A injeção de dados de texto no DOM é feita majoritariamente via `textContent`, o que neutraliza a execução de scripts maliciosos.

### ⚠️ Riscos Identificados e Plano de Mitigação
1. **Risco de XSS na Previsão Estendida:** O uso de `insertAdjacentHTML` para injetar os cards de previsão diária exige cautela. 
   - *Mitigação (Próximo passo):* Filtrar rigorosamente os dados oriundos do JSON da API ou migrar a construção dos elementos para `document.createElement()`.
2. **Sequestro de CDN (Falta de SRI):** O CSS de terceiros (Weather Icons) está sendo importado sem validação de integridade. 
   - *Mitigação (Próximo passo):* Adicionar os atributos `integrity` e `crossorigin` na tag `<link>` do HTML.
3. **Exaustão de Recursos (DoS Local):** O campo de busca não possui limite de tamanho. 
   - *Mitigação (Próximo passo):* Adicionar `maxlength="100"` na tag `<input>` para evitar o travamento da thread principal do JavaScript com textos massivos.
4. **Privacidade Geográfica:** O sistema envia as intenções de busca para servidores externos na Alemanha. 
   - *Transparência:* A aplicação **não** rastreia a localização do dispositivo do usuário (GPS/Geolocation API), operando de forma 100% dependente do input manual, garantindo um processo de geocodificação anonimizado.

------

## 🚀 Tecnologias e Conceitos Utilizados

- **HTML5:** Estrutura limpa, utilizando semântica e suporte a gráficos SVG embutidos.
- **CSS3:** - Metodologia **Mobile-First**.
  - Tipografia e dimensionamento fluidos utilizando funções matemáticas (`clamp()`, `max()`).
  - Flexbox para alinhamento centralizado perfeito e construção de listas.
  - Variáveis de ambiente e pseudo-classes de estado (`:hover`, `:active`, `:focus`).
- **JavaScript (ES6+):**
  - Assincronismo com `async / await` e blocos `try / catch / finally`.
  - Fetch API para consumo de dados RESTful.
  - Desestruturação de objetos (Destructuring) e manipulação dinâmica do DOM.

------

## 💻 Executando Localmente

Como o projeto utiliza apenas tecnologias front-end nativas e uma API pública, rodar o projeto localmente é um processo totalmente livre de atritos.

### Passos da Instalação e Execução

1. Clone este repositório em sua máquina utilizando o terminal:
   ```bash
   git clone https://github.com/erickystn/projeto_clima.git
   ```

2. Acesse a pasta raiz do projeto:
   ```bash
   cd projeto_clima
   ```

3. **Para executar:** Basta dar um duplo clique no arquivo `index.html` para abri-lo diretamente no seu navegador de preferência.
   > **Dica para Desenvolvedores:** Caso queira editar o código e ver as mudanças em tempo real, abra a pasta do projeto no [Visual Studio Code](https://code.visualstudio.com/) e inicie a extensão **Live Server**.

------

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Se você deseja melhorar o projeto, siga estes passos:

1. Faça um *Fork* do projeto.
2. Crie uma *Branch* para sua modificação (`git checkout -b feature/sua-feature-incrivel`).
3. Faça o commit das suas alterações utilizando *Conventional Commits* (`git commit -m 'feat: adiciona nova funcionalidade incrível'`).
4. Faça o Push para a sua branch (`git push origin feature/sua-feature-incrivel`).
5. Abra um *Pull Request*.

------

## ⚖️ Licenciamento e Conformidade

Este projeto é distribuído sob a licença **MIT**, o que permite uso comercial e não comercial, modificação e distribuição, desde que os avisos de direitos autorais originais sejam mantidos. Consulte o arquivo `LICENSE` no repositório para a versão completa em Inglês e Português.

**Auditoria de Dependências:**
- **Open-Meteo API:** Consumida de forma gratuita. Os dados estão sob a licença *Creative Commons Attribution 4.0 (CC BY 4.0)*, que exige atribuição (fornecida neste repositório e na interface). Para uso comercial em larga escala, os termos da Open-Meteo exigem contratação de plano comercial.
- **Weather Icons:** A fonte de ícones climáticos operada via CDN. Licenciada sob *SIL OFL 1.1* para as fontes e *MIT* para o CSS. Compatível com a licença MIT principal do projeto.
- **Jest (DevDependency):** Framework de testes sob licença *MIT*. Livre de conflitos.

Para mais detalhes sobre os créditos e atribuições legais de terceiros, consulte o arquivo `NOTICE.md`.
