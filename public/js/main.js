(async (COOKIEWRAPPER, UTILS) => {
  const loginHolder = document.querySelector('.login-holder');
  const chartHolder = document.querySelector('.chart-holder');
  const addHolder = document.querySelector('.add-holder');
  const logoutHolder = document.querySelector('.logout-holder');
  const txtUsername = document.getElementById('username');
  const txtPassword = document.getElementById('password');
  const btnLogin = document.getElementById('login');
  const btnSave = document.getElementById('save');
  const snackbar = document.querySelector('.snackbar');
  const snackbarText = document.getElementById('snackbarText');
  const addDialog = document.getElementById('addDialog');

  const showError = UTILS.showMessage(snackbar, snackbarText, UTILS.CONSTANTS.MESSAGE_TYPE.ERROR);
  const showInfo = UTILS.showMessage(snackbar, snackbarText, UTILS.CONSTANTS.MESSAGE_TYPE.INFO);

  let chart;
  let nextId;

  const getToken = () => {
    if (COOKIEWRAPPER.checkCookie(COOKIEWRAPPER.CONSTANTS.TOKEN)) {
      const token = COOKIEWRAPPER.getCookie(COOKIEWRAPPER.CONSTANTS.TOKEN);
      return token;
    }

    if (!txtUsername.value) {
      throw new Error('Username not entered.');
    }

    if (!txtPassword.value) {
      throw new Error('Password not entered.');
    }

    const token = window.btoa(`${txtUsername.value}:${txtPassword.value}`);
    COOKIEWRAPPER.setCookie(COOKIEWRAPPER.CONSTANTS.TOKEN, token, 1);
    return token;
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
      result.time = [...result.time, UTILS.extractTime(entry.time)];
      result.spm = [...result.spm, entry.spm];
      result.distance = [...result.distance, entry.distance];
      result.totalStrokes = [...result.totalStrokes, entry.totalStrokes];
      result.calories = [...result.calories, entry.calories];
      result.recovery = [...result.recovery, UTILS.extractRecovery(entry.recovery)];
    });

    nextId = data.length + 1;

    return result;
  };

  const initChart = (data) => {
    const datasets = [
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
    ];

    const scales = {
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
    };

    const zoom = {
      pan: {
        enabled: true,
      },
      zoom: {
        drag: {
          enabled: true
        },
        mode: 'xy',
      },
    };

    chart = new Chart(document.getElementById('chart'), {
      type: 'line',
      data: {
        labels: data.labels,
        datasets,
      },
      options: {
        legend: { display: true },
        maintainAspectRatio: false,
        responsive: true,
        stacked: false,
        scales,
        // plugins: {
        //   zoom
        // }
      },
    });
  };

  const load = async () => {
    try {
      showInfo('Loading...');

      const response = await fetch('/api/training/get-all', {
        headers: {
          authorization: `Basic ${getToken()}`,
        },
      });

      const data = await response.json();
      if (!data) {
        throw new Error('No data returned.');
      }

      if (chart) {
        chart.destroy();
      }

      UTILS.navigateTo(UTILS.CONSTANTS.ROUTE.DASHBOARD);
      UTILS.makeHidden(loginHolder);
      UTILS.makeVisible(addHolder);
      UTILS.makeVisible(logoutHolder);
      UTILS.makeVisible(chartHolder);

      const transformedData = transform(data);
      initChart(transformedData);
    } catch (error) {
      showError(error.message);
    }
  };

  const save = async () => {
    try {
      const response = await fetch('/api/training/add', {
        method: 'POST',
        headers: {
          authorization: `Basic ${getToken()}`,
        },
        body: JSON.stringify({
          nextId,
          ...UTILS.serializeForm(document.forms.addForm),
        }),
      });
      if (response.ok) {
        document.forms.addForm.reset();
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const addNewEntry = async () => {
    if (!document.forms.addForm.reportValidity()) {
      return;
    }

    showInfo('Saving...');
    await save();
    addDialog.close();
    load();
  };

  const logout = () => {
    showInfo('logging out...');
    COOKIEWRAPPER.deleteCookie(COOKIEWRAPPER.CONSTANTS.TOKEN);
    UTILS.navigateTo(UTILS.CONSTANTS.ROUTE.LOGIN);
    UTILS.makeHidden(addHolder);
    UTILS.makeHidden(logoutHolder);
    UTILS.makeHidden(chartHolder);
    UTILS.makeVisible(loginHolder);
  };

  const initHandler = () => {
    btnLogin.addEventListener('click', async () => load());
    addHolder.addEventListener('click', () => addDialog.showModal());
    logoutHolder.addEventListener('click', () => logout());
    btnSave.addEventListener('click', async () => addNewEntry());

    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/service-worker.js');
    // }
  };

  const initUi = () => {
    if (COOKIEWRAPPER.checkCookie(COOKIEWRAPPER.CONSTANTS.TOKEN)) {
      load();
    } else {
      UTILS.navigateTo(UTILS.CONSTANTS.ROUTE.LOGIN);
      UTILS.makeHidden(addHolder);
      UTILS.makeHidden(logoutHolder);
      UTILS.makeHidden(chartHolder);
      UTILS.makeVisible(loginHolder);
    }
  };

  const init = () => {
    initHandler();
    initUi();
  };

  init();
})(cookieWrapper, utils);
