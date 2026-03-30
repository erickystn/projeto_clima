/** * @fileoverview Lógica principal do aplicativo de previsão do tempo.
 * Responsável pela manipulação do DOM, requisições HTTP para a API Open-Meteo
 * e formatação dos dados meteorológicos.
 */

// ── Elementos do DOM ───────────────────────────────────
const cityInput  = document.getElementById('cityInput');
const errorBox   = document.getElementById('errorBox');
const searchCard = document.getElementById('searchCard');
const resultCard = document.getElementById('resultCard');
const tempValue  = document.getElementById('tempValue');
const cityName   = document.getElementById('cityName');
const searchBtn  = document.getElementById('searchBtn');
const weatherDesc  = document.getElementById('weatherDesc');
const dateTime     = document.getElementById('dateTime');
const weatherIcon  = document.getElementById('weatherIcon');
const bodyElement  = document.body;

// ── Funções de API ──────────────────────────────────────

/**
 * Busca as coordenadas geográficas de uma cidade utilizando a API Open-Meteo.
 *
 * @async
 * @param {string} city - O nome da cidade a ser buscada.
 * @returns {Promise<{latitude: number, longitude: number, name: string, country: string}>} Objeto contendo coordenadas e informações do local.
 * @throws {Error} Lança um erro se a cidade não for encontrada ou a API falhar.
 * @example
 * const coords = await geocodeCity("São Paulo");
 * // Retorna: { latitude: -23.5475, longitude: -46.6361, name: "São Paulo", country: "Brazil" }
 */
async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
  const res  = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada');
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

/**
 * Obtém os dados climáticos atuais baseados em latitude e longitude.
 *
 * @async
 * @param {number} latitude - A latitude do local.
 * @param {number} longitude - A longitude do local.
 * @returns {Promise<Object>} Objeto contendo a temperatura, código do clima, tempo e se é dia ou noite.
 * @throws {Error} Lança um erro se os dados não estiverem disponíveis.
 */
async function fetchWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;
  const res  = await fetch(url);
  const data = await res.json();

  if (!data.current) {
    throw new Error('Dados climáticos indisponíveis');
  }

  return data.current;
}

// ── Funções Utilitárias ─────────────────────────────────

/**
 * Converte o código numérico WMO da API em uma descrição legível e a respectiva classe de ícone.
 *
 * @param {number} code - O código do clima fornecido pela API.
 * @param {boolean} isDay - Indica se é dia (true) ou noite (false).
 * @returns {{desc: string, icon: string}} Objeto contendo a descrição e a classe CSS do ícone (Weather Icons).
 * @example
 * const clima = getWeatherDetails(0, true);
 * // Retorna: { desc: "Céu Limpo", icon: "wi-day-sunny" }
 */
function getWeatherDetails(code, isDay) {
  const weatherMap = {
    0:  { desc: 'Céu Limpo',          icon: 'wi-day-sunny' },
    1:  { desc: 'Principalmente Limpo', icon: 'wi-day-sunny-overcast' },
    2:  { desc: 'Parcialmente Nublado', icon: 'wi-day-cloudy' },
    3:  { desc: 'Encoberto',           icon: 'wi-cloudy' },
    45: { desc: 'Nevoeiro',            icon: 'wi-fog' },
    48: { desc: 'Nevoeiro Deposicional',icon: 'wi-fog' },
    51: { desc: 'Garoa Leve',         icon: 'wi-sprinkle' },
    53: { desc: 'Garoa Moderada',     icon: 'wi-sprinkle' },
    55: { desc: 'Garoa Densa',        icon: 'wi-sprinkle' },
    61: { desc: 'Chuva Leve',         icon: 'wi-rain' },
    63: { desc: 'Chuva Moderada',     icon: 'wi-rain' },
    65: { desc: 'Chuva Forte',        icon: 'wi-rain' },
    80: { desc: 'Pancadas de Chuva',  icon: 'wi-showers' },
    95: { desc: 'Tempestade',          icon: 'wi-thunderstorm' },
  };

  let details = weatherMap[code] || { desc: 'Desconhecido', icon: 'wi-na' };

  if (!isDay) {
    if (code === 0) details.icon = 'wi-night-clear';
    if (code === 1) details.icon = 'wi-night-alt-partly-cloudy';
    if (code === 2) details.icon = 'wi-night-alt-cloudy';
  }

  return details;
}

/**
 * Formata a data e hora retornada pela API para o formato local brasileiro.
 *
 * @param {string} apiTime - String de data e hora no formato ISO fornecido pela API (ex: "2026-03-30T15:30").
 * @returns {string} String formatada, ex: "segunda-feira, 30 de março de 2026 - 15:30".
 */
function getFormattedDateTime(apiTime) {
  const date = new Date(apiTime);
  
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('pt-BR', options).replace(',', ' -'); 
}

// ── Controladores de Interface (Handlers) ────────────────

/**
 * Exibe a mensagem de erro na interface do usuário.
 *
 * @param {string} msg - A mensagem de erro a ser exibida.
 */
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

/**
 * Oculta a caixa de mensagem de erro da interface.
 */
function hideError() {
  errorBox.classList.add('hidden');
}

/**
 * Restaura o estado inicial da aplicação, voltando para a tela de busca.
 */
function goHome() {
  resultCard.classList.add('hidden');
  searchCard.classList.remove('hidden');
  cityInput.value = '';
  hideError();
  bodyElement.style.background = 'linear-gradient(160deg, #7dd3ea 0%, #a8dff0 40%, #c8edf7 100%)';
  cityInput.focus();
}

/**
 * Função principal disparada ao clicar no botão de busca ou pressionar Enter.
 * Coordena a validação, requisições de API e atualização do DOM.
 *
 * @async
 * @returns {Promise<void>}
 */
async function handleSearch() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Por favor, digite o nome de uma cidade.');
    return;
  }

  hideError();
  searchBtn.textContent = 'Buscando…';
  searchBtn.disabled = true;

  try {
    const { latitude, longitude, name, country } = await geocodeCity(city);
    const weatherData = await fetchWeatherData(latitude, longitude);

    const temp = Math.round(weatherData.temperature_2m);
    const code = weatherData.weather_code;
    const isDay = weatherData.is_day === 1;
    const localTime = weatherData.time;

    const details = getWeatherDetails(code, isDay);

    tempValue.textContent = temp;
    cityName.textContent  = `${name}, ${country}`;
    weatherDesc.textContent = details.desc;
    dateTime.textContent = getFormattedDateTime(localTime);
    
    if (weatherIcon) {
      weatherIcon.className = `wi ${details.icon}`;
    }

    if (isDay) {
      bodyElement.style.background = 'linear-gradient(160deg, #7dd3ea 0%, #a8dff0 40%, #c8edf7 100%)';
    } else {
      bodyElement.style.background = 'linear-gradient(160deg, #131d2e 0%, #2c4a6e 100%)';
    }

    searchCard.classList.add('hidden');
    resultCard.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    showError('Cidade não encontrada ou erro na busca. Tente novamente.');
  } finally {
    searchBtn.textContent = 'Buscar';
    searchBtn.disabled = false;
  }
}

// ── Event Listeners ─────────────────────────────────────
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});