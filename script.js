// Função que retorna um número aleatório entre os valores 'min' e 'max'
function getRandomData(min, max) {
    return Math.random() * (max - min) + min;
}

// Função que atualiza os dados dos sensores na interface do usuário
function updateSensorData() {
    // Atualiza a temperatura para um valor aleatório entre 20 e 30, com 1 casa decimal
    document.getElementById('temperature').textContent = getRandomData(20, 30).toFixed(1) + '°C';
    
    // Atualiza a umidade para um valor aleatório entre 30 e 70, com 1 casa decimal
    document.getElementById('humidity').textContent = getRandomData(30, 70).toFixed(1) + '%';
    
    // Atualiza a qualidade do ar (AQI) para um valor inteiro aleatório entre 0 e 500
    document.getElementById('airQuality').textContent = Math.floor(getRandomData(0, 500));
    
    // Atualiza o nível de ruído para um valor inteiro aleatório entre 30 e 90, seguido de 'dB'
    document.getElementById('noiseLevel').textContent = Math.floor(getRandomData(30, 90)) + ' dB';
}

// Chama a função 'updateSensorData' a cada 5 segundos (5000 ms)
setInterval(updateSensorData, 5000);

// Chama a função 'updateSensorData' uma vez imediatamente ao carregar o script
updateSensorData();

// Define uma lista com os tipos de sensores que serão usados para criar gráficos
const charts = ['temperature', 'humidity', 'airQuality', 'noiseLevel'];

// Objeto para armazenar os dados dos gráficos
const chartData = {};

// Objeto que contém as configurações de cada gráfico, como rótulo, valor mínimo e máximo
const chartConfigs = {
    temperature: { label: 'Temperatura (°C)', min: 0, max: 40 },
    humidity: { label: 'Umidade (%)', min: 0, max: 100 },
    airQuality: { label: 'Qualidade do Ar (AQI)', min: 0, max: 500 },
    noiseLevel: { label: 'Nível de Ruído (dB)', min: 0, max: 120 }
};

// Para cada tipo de sensor na lista 'charts', cria-se um gráfico correspondente
charts.forEach(sensorType => {
    // Seleciona o contexto 2D do elemento canvas correspondente ao gráfico do sensor
    const ctx = document.getElementById(sensorType + 'Chart').getContext('2d');
    
    // Inicializa os dados do gráfico, com um conjunto vazio de rótulos e dados
    chartData[sensorType] = {
        labels: [], // Rótulos do eixo x (tempo)
        datasets: [{
            label: chartConfigs[sensorType].label, // Rótulo do dataset (ex: "Temperatura (°C)")
            data: [], // Dados do eixo y (valores dos sensores)
            borderColor: '#4CAF50', // Cor da linha do gráfico
            tension: 0.1 // Curvatura da linha do gráfico
        }]
    };

    // Cria um novo gráfico do tipo 'line' usando a biblioteca Chart.js
    new Chart(ctx, {
        type: 'line',
        data: chartData[sensorType],
        options: {
            scales: {
                y: {
                    beginAtZero: true, // O eixo y começa do zero
                    min: chartConfigs[sensorType].min, // Valor mínimo do eixo y
                    max: chartConfigs[sensorType].max  // Valor máximo do eixo y
                }
            },
            animation: {
                duration: 0 // Desabilita a animação para que o gráfico atualize imediatamente
            }
        }
    });
});

// Função para atualizar os gráficos com os dados dos sensores
function updateCharts() {
    // Obtém o horário atual no formato horas:minutos:segundos
    const now = new Date();
    const timeString = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    
    // Para cada tipo de sensor, atualiza os dados no gráfico
    charts.forEach(sensorType => {
        // Obtém o valor atual do sensor a partir da interface
        const value = parseFloat(document.getElementById(sensorType).textContent);
        
        // Adiciona o horário atual como rótulo no gráfico
        chartData[sensorType].labels.push(timeString);
        
        // Adiciona o valor do sensor como dado no gráfico
        chartData[sensorType].datasets[0].data.push(value);
        
        // Limita o gráfico a exibir no máximo 10 pontos de dados
        if (chartData[sensorType].labels.length > 10) {
            chartData[sensorType].labels.shift(); // Remove o rótulo mais antigo
            chartData[sensorType].datasets[0].data.shift(); // Remove o dado mais antigo
        }
        
        // Atualiza o gráfico correspondente
        Chart.getChart(sensorType + 'Chart').update();
    });
}

// Chama a função 'updateCharts' a cada 5 segundos para atualizar os gráficos com novos dados
setInterval(updateCharts, 5000);

// Função para inicializar um mapa SVG com a localização dos sensores
function initMap() {
    // Seleciona o elemento 'map' do documento HTML
    const mapElement = document.getElementById('map');
    
    // Cria um novo elemento SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    // Define a largura e altura do SVG para ocupar 100% do elemento 'map'
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    // Define o conteúdo do SVG (um fundo cinza e três círculos representando os sensores)
    svg.innerHTML = `
        <rect width="100%" height="100%" fill="#e5e5e5"/>
        <circle cx="50" cy="50" r="10" fill="#4CAF50"/>
        <circle cx="150" cy="100" r="10" fill="#4CAF50"/>
        <circle cx="250" cy="150" r="10" fill="#4CAF50"/>
        <text x="50" y="70" font-family="Arial" font-size="12" fill="#333">Sensor 1</text>
        <text x="150" y="120" font-family="Arial" font-size="12" fill="#333">Sensor 2</text>
        <text x="250" y="170" font-family="Arial" font-size="12" fill="#333">Sensor 3</text>
    `;
    
    // Adiciona o SVG ao elemento 'map'
    mapElement.appendChild(svg);
}

// Chama a função 'initMap' para inicializar o mapa
initMap();
