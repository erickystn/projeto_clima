// ── Elementos Originais ────────────────────────────────
const cityInput  = document.getElementById('cityInput');
const errorBox   = document.getElementById('errorBox');
const searchCard = document.getElementById('searchCard');
const resultCard = document.getElementById('resultCard');
const tempValue  = document.getElementById('tempValue');
const cityName   = document.getElementById('cityName');
const searchBtn  = document.getElementById('searchBtn');

// ── Novos Elementos (Necessários para bater com o print) ──
const weatherDesc  = document.getElementById('weatherDesc');
const dateTime     = document.getElementById('dateTime');
const weatherIcon  = document.getElementById('weatherIcon'); // Supondo que você adicionou <i id="weatherIcon"> no HTML
const bodyElement  = document.body;

// ── Geocodificação: cidade → coordenadas ────────────────
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

// ── Dados climáticos completos via Open-Meteo (Atualizado) ──
// Renomeando de fetchTemperature para fetchWeatherData pois agora pegamos mais dados
async function fetchWeatherData(latitude, longitude) {
  // Mudamos o parâmetro de 'current_weather=true' para pedir os blocos específicos: temperatura, código e dia
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;
  const res  = await fetch(url);
  const data = await res.json();

  // A API Open-Meteo retorna os dados no bloco 'current' quando usamos o formato acima
  if (!data.current) {
    throw new Error('Dados climáticos indisponíveis');
  }

  return data.current; // Retornamos o objeto com temperature_2m, weather_code, etc.
}

// ── Tradutor de Código de Clima e Ícone (Mapeamento WMO) ─────
// Converte o código numérico da API em Texto e Classe do Weather Icons
function getWeatherDetails(code, isDay) {
  // Mapa base baseado nos códigos WMO. Adicione mais se necessário.
  // Referência: https://open-meteo.com/en/docs
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

  // Pega o detalhe ou define como desconhecido se o código não estiver no mapa
  let details = weatherMap[code] || { desc: 'Desconhecido', icon: 'wi-na' };

  // Correção para ícones noturnos (Se não for dia, troca o sol pela lua nos códigos 0, 1 e 2)
  if (!isDay) {
    if (code === 0) details.icon = 'wi-night-clear';
    if (code === 1) details.icon = 'wi-night-alt-partly-cloudy';
    if (code === 2) details.icon = 'wi-night-alt-cloudy';
    // Códigos de chuva/nevoeiro geralmente usam o mesmo ícone dia e noite na Weather Icons
  }

  return details;
}

// ── Formatador de Data (Ex: segunda-feira, 13 de outubro de 2025) ──
function getFormattedDateTime() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // Formata a data atual para o português do Brasil
  return new Date().toLocaleDateString('pt-BR', options);
}

// ── Handler principal ───────────────────────────────────
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
    // 1. Geocodificação
    const { latitude, longitude, name, country } = await geocodeCity(city);
    
    // 2. Busca de dados climáticos completos (usando a função atualizada)
    const weatherData = await fetchWeatherData(latitude, longitude);

    // 3. Extração e Processamento dos dados
    const temp = Math.round(weatherData.temperature_2m);
    const code = weatherData.weather_code;
    const isDay = weatherData.is_day === 1; // API retorna 1 para dia, 0 para noite
  

    // 4. Obtenção da descrição e ícone correspondente
    const details = getWeatherDetails(code, isDay);

    // 5. Atualização da Interface (DOM)
    tempValue.textContent = temp;
    cityName.textContent  = `${name}, ${country}`;
    weatherDesc.textContent = details.desc;
    dateTime.textContent = getFormattedDateTime();
    
    // Atualiza a classe do ícone (wi wi-na -> wi wi-day-sunny, por exemplo)
    if (weatherIcon) {
      weatherIcon.className = `wi ${details.icon}`;
    }

    // 6. Troca de cor de fundo (Dia/Noite) para bater com o print final
    // (Fundo claro de dia, fundo escuro/noturno à noite)
    if (isDay) {
      // Gradiente original (Dia)
      bodyElement.style.background = 'linear-gradient(160deg, #7dd3ea 0%, #a8dff0 40%, #c8edf7 100%)';
    } else {
      // Gradiente Noturno (Baseado no fundo escuro da imagem de exemplo)
      bodyElement.style.background = 'linear-gradient(160deg, #131d2e 0%, #2c4a6e 100%)';
    }

    searchCard.classList.add('hidden');
    resultCard.classList.remove('hidden');

  } catch (err) {
    console.error(err); // Loga o erro real no console para debug
    showError('Cidade não encontrada ou erro na busca. Tente novamente.');
  } finally {
    searchBtn.textContent = 'Buscar';
    searchBtn.disabled = false;
  }
}

// ── Voltar para a tela de busca ─────────────────────────
function goHome() {
  resultCard.classList.add('hidden');
  searchCard.classList.remove('hidden');
  cityInput.value = '';
  hideError();
  // Restaura o fundo original ao voltar para a busca
  bodyElement.style.background = 'linear-gradient(160deg, #7dd3ea 0%, #a8dff0 40%, #c8edf7 100%)';
  cityInput.focus();
}

// ── Helpers ─────────────────────────────────────────────
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

// ── Enter para buscar ────────────────────────────────────
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});