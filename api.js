/** * @fileoverview Lógica principal do aplicativo de previsão do tempo.
 * Atualizado para suportar a previsão de múltiplos dias (forecast)
 * e o mapeamento completo dos códigos de clima WMO.
 */

// ── Elementos do DOM ───────────────────────────────────
const cityInput    = document.getElementById('cityInput');
const errorBox     = document.getElementById('errorBox');
const searchCard   = document.getElementById('searchCard');
const resultCard   = document.getElementById('resultCard');
const tempValue    = document.getElementById('tempValue');
const cityName     = document.getElementById('cityName');
const searchBtn    = document.getElementById('searchBtn');
const weatherDesc  = document.getElementById('weatherDesc');
const dateTime     = document.getElementById('dateTime');
const weatherIcon  = document.getElementById('weatherIcon');
const bodyElement  = document.body;

// Referências para os elementos do novo layout
const tempMinMax   = document.getElementById('tempMinMax');
const forecastList = document.getElementById('forecastList');

// ── Funções de API ──────────────────────────────────────

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
 * Obtém os dados climáticos (atuais e diários) baseados em latitude e longitude.
 */
async function fetchWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res  = await fetch(url);
  const data = await res.json();

  if (!data.current || !data.daily) {
    throw new Error('Dados climáticos indisponíveis');
  }

  return data;
}

// ── Funções Utilitárias ─────────────────────────────────

/**
 * Converte o código numérico WMO da API em uma descrição e classe de ícone.
 * MUDANÇA: Dicionário `weatherMap` foi expandido com TODOS os códigos WMO do Open-Meteo.
 */
function getWeatherDetails(code, isDay) {
  const weatherMap = {
    0:  { desc: 'Céu Limpo',                    icon: 'wi-day-sunny' },
    1:  { desc: 'Principalmente Limpo',         icon: 'wi-day-sunny-overcast' },
    2:  { desc: 'Parcialmente Nublado',         icon: 'wi-day-cloudy' },
    3:  { desc: 'Nublado',                      icon: 'wi-cloudy' },
    45: { desc: 'Neblina',                      icon: 'wi-fog' },
    48: { desc: 'Nevoeiro',                     icon: 'wi-fog' },
    51: { desc: 'Garoa Leve',                   icon: 'wi-sprinkle' },
    53: { desc: 'Garoa Moderada',               icon: 'wi-sprinkle' },
    55: { desc: 'Garoa Densa',                  icon: 'wi-sprinkle' },
    // MUDANÇA: Adicionados códigos de garoa congelante
    56: { desc: 'Garoa Congelante Leve',        icon: 'wi-sleet' }, 
    57: { desc: 'Garoa Congelante Densa',       icon: 'wi-sleet' },
    61: { desc: 'Chuva Leve',                   icon: 'wi-rain' },
    63: { desc: 'Chuva Moderada',               icon: 'wi-rain' },
    65: { desc: 'Chuva Forte',                  icon: 'wi-rain' },
    // MUDANÇA: Adicionados códigos de chuva congelante
    66: { desc: 'Chuva Congelante Leve',        icon: 'wi-rain-mix' }, 
    67: { desc: 'Chuva Congelante Forte',       icon: 'wi-rain-mix' },
    // MUDANÇA: Adicionados códigos de neve
    71: { desc: 'Neve Leve',                    icon: 'wi-snow' },
    73: { desc: 'Neve Moderada',                icon: 'wi-snow' },
    75: { desc: 'Neve Forte',                   icon: 'wi-snow' },
    77: { desc: 'Grãos de Neve',                icon: 'wi-snow' },
    80: { desc: 'Pancadas de Chuva Leves',      icon: 'wi-showers' },
    // MUDANÇA: Adicionados códigos de pancadas de chuva moderadas e fortes (muito comuns no Brasil)
    81: { desc: 'Pancadas de Chuva',            icon: 'wi-showers' },
    82: { desc: 'Pancadas de Chuva Fortes',     icon: 'wi-showers' },
    // MUDANÇA: Adicionados códigos de pancadas de neve
    85: { desc: 'Pancadas de Neve Leves',       icon: 'wi-snow' },
    86: { desc: 'Pancadas de Neve Fortes',      icon: 'wi-snow' },
    95: { desc: 'Tempestade',                   icon: 'wi-thunderstorm' },
    96: { desc: 'Tempestade com granizo',       icon: 'wi-storm-showers' }, 
    99: { desc: 'Tempestade forte com granizo', icon: 'wi-storm-showers' }
  };

  // Se o código realmente não existir (algo raro agora), mostra desconhecido
  let details = weatherMap[code] || { desc: 'Desconhecido', icon: 'wi-na' };

  // Ajusta o ícone para a versão noturna caso isDay seja false e seja um dos códigos base
  if (!isDay) {
    if (code === 0) details.icon = 'wi-night-clear';
    if (code === 1) details.icon = 'wi-night-alt-partly-cloudy';
    if (code === 2) details.icon = 'wi-night-alt-cloudy';
  }

  return details;
}

function getFormattedDateTime(apiTime) {
  const date = new Date(apiTime);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; 
  return date.toLocaleDateString('pt-BR', options).toLowerCase(); 
}

/**
 * Função para formatar apenas o dia e a semana para a lista de próximos dias.
 */
function getDailyDateInfo(dateString) {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  
  let weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1); 
  
  const dayStr = date.getDate();
  const monthStr = date.toLocaleDateString('pt-BR', { month: 'long' });

  return {
    weekday: weekday,
    dayMonth: `${dayStr} de ${monthStr}`
  };
}

// ── Controladores de Interface (Handlers) ────────────────

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

function goHome() {
  resultCard.classList.add('hidden');
  searchCard.classList.remove('hidden');
  cityInput.value = '';
  hideError();
  bodyElement.style.background = 'linear-gradient(160deg, #7dd3ea 0%, #a8dff0 40%, #c8edf7 100%)';
  cityInput.focus();
}

/**
 * Constrói o HTML dos próximos 4 dias
 */
function renderForecast(dailyData) {
  forecastList.innerHTML = ''; 

  // O índice 0 é hoje. Vamos iterar do 1 ao 4 (próximos 4 dias)
  for (let i = 1; i <= 4; i++) {
    if (!dailyData.time[i]) break; 

    const dateStr = dailyData.time[i];
    const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
    const minTemp = Math.round(dailyData.temperature_2m_min[i]);
    const code = dailyData.weather_code[i];
    
    const details = getWeatherDetails(code, true); 
    const dateInfo = getDailyDateInfo(dateStr);

    const itemHtml = `
      <div class="forecast-item">
        <div class="forecast-day-info">
          <span class="forecast-weekday">${dateInfo.weekday}</span>
          <span class="forecast-date">${dateInfo.dayMonth}</span>
        </div>
        <div class="forecast-weather-info">
          <i class="wi ${details.icon}"></i>
          <span class="forecast-desc">${details.desc}</span>
        </div>
        <div class="forecast-temps">
          <div class="temp-row">
            <span class="arrow-up">▲</span> ${maxTemp}°
          </div>
          <div class="temp-row">
            <span class="arrow-down">▼</span> ${minTemp}°
          </div>
        </div>
      </div>
    `;
    forecastList.insertAdjacentHTML('beforeend', itemHtml);
  }
}

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

    const current = weatherData.current;
    const daily   = weatherData.daily;

    const temp  = Math.round(current.temperature_2m);
    const code  = current.weather_code;
    const isDay = current.is_day === 1;
    const localTime = current.time;

    const todayMin = Math.round(daily.temperature_2m_min[0]);

    const details = getWeatherDetails(code, isDay);

    tempValue.textContent   = temp;
    tempMinMax.textContent  = `/ ${todayMin}°`; 
    cityName.textContent    = `${name}, ${country}`;
    weatherDesc.textContent = details.desc;
    dateTime.textContent    = getFormattedDateTime(localTime);
    
    if (weatherIcon) {
      weatherIcon.className = `wi ${details.icon}`;
    }

    renderForecast(daily);

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