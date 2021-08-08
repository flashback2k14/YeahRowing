(async () => {
  const loginHolder = document.querySelector('.login-holder');
  const chartHolder = document.querySelector('.chart-holder');
  const txtUsername = document.getElementById('username');
  const txtPassword = document.getElementById('password');
  const btnLogin = document.getElementById('login');
  const errorText = document.getElementById('errorText');

  let _errorTextInterval = null;

  const showError = (message) => {
    clearInterval(_errorTextInterval);
    errorText.textContent = message;
    _errorTextInterval = setInterval(() => {
      errorText.textContent = '';
    }, 3500);
  };

  const getBase64 = () => {
    if (!txtUsername.value) {
      throw new Error('username not set');
    }

    if (!txtPassword.value) {
      throw new Error('password not set');
    }

    return window.btoa(`${txtUsername.value}:${txtPassword.value}`);
  };

  const changeVisibility = () => {
    if (loginHolder.classList.contains('visible')) {
      loginHolder.classList.remove('visible');
      loginHolder.classList.add('hidden');
    }

    if (chartHolder.classList.contains('hidden')) {
      chartHolder.classList.remove('hidden');
      chartHolder.classList.add('visible');
    }
  };

  const extractTime = (timeString) => {
    const parts = timeString.split(':');
    return Number.parseInt(parts[0], 10);
  };

  const extractRecovery = (recoveryString) => {
    if (typeof recoveryString === 'number') {
      return recoveryString;
    }

    const part = recoveryString.substring(1);
    return Number.parseInt(part, 10);
  };

  const transform = (data) => {
    const result = {
      labels: [],
      time: [],
      spm: [],
      distance: [],
      totalStrokes: [],
      calories: [],
      recovery: [],
    };

    data.forEach((entry) => {
      result.labels = [...result.labels, entry.date];
      result.time = [...result.time, extractTime(entry.time)];
      result.spm = [...result.spm, entry.spm];
      result.distance = [...result.distance, entry.distance];
      result.totalStrokes = [...result.totalStrokes, entry.totalStrokes];
      result.calories = [...result.calories, entry.calories];
      result.recovery = [...result.recovery, extractRecovery(entry.recovery)];
    });

    return result;
  };

  const initChart = (data) => {
    const chart = new Chart(document.getElementById('chart'), {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.recovery,
            borderColor: '#ff5722',
            backgroundColor: 'rgba(255, 138, 80, 0.2)',
            fill: true,
            label: 'recovery',
            yAxisID: 'yLeftSmall',
          },
          {
            data: data.spm,
            borderColor: '#9c27b0',
            backgroundColor: 'rgba(208, 92, 227, 0.2)',
            fill: true,
            label: 'SPM',
            yAxisID: 'yLeftSmall',
          },
          {
            data: data.time,
            borderColor: '#f44336',
            backgroundColor: 'rgba(255, 121, 97, 0.2)',
            fill: true,
            label: 'time',
            yAxisID: 'yLeftSmall',
          },
          {
            data: data.totalStrokes,
            borderColor: '#009688',
            backgroundColor: 'rgba(82, 199, 184, 0.2)',
            fill: true,
            label: 'total strokes',
            yAxisID: 'yLeft',
          },
          {
            data: data.calories,
            borderColor: '#cddc39',
            backgroundColor: 'rgba(255, 255, 110, 0.2)',
            fill: true,
            label: 'calories',
            yAxisID: 'yLeft',
          },
          {
            data: data.distance,
            borderColor: '#2196f3',
            backgroundColor: 'rgba(110, 198, 255, 0.2)',
            fill: true,
            label: 'distance',
            yAxisID: 'yRight',
          },
        ],
      },
      options: {
        legend: { display: true },
        maintainAspectRatio: false,
        responsive: true,
        stacked: false,
        scales: {
          yLeft: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          yLeftSmall: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          yRight: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  };

  const load = async () => {
    try {
      const response = await fetch('/api/training/get-all', {
        headers: {
          authorization: `Basic ${getBase64()}`,
        },
      });

      const data = await response.json();
      if (!data) {
        throw new Error('not data');
      }

      changeVisibility();

      const transformedData = transform(data);
      initChart(transformedData);
    } catch (error) {
      showError(`ERROR: ${error.message}`);
    }
  };

  const init = () => {
    btnLogin.addEventListener('click', async () => load());
  };

  init();
})();
