const utils = (() => {
  const CONSTANTS = {
    ROUTE: {
      LOGIN: 'login',
      DASHBOARD: 'dashboard',
    },
    MESSAGE_TYPE: {
      INFO: 'info',
      ERROR: 'error',
    },
  };

  let _snackbarVisibleInterval = null;

  const _constructSnackbar = (
    snackbarElement,
    snackbarTextElement,
    snackbarColorClassname,
    snackbarPrevColorClassname,
    message
  ) => {
    clearInterval(_snackbarVisibleInterval);

    if (snackbarElement.classList.contains(snackbarPrevColorClassname)) {
      snackbarElement.classList.remove(snackbarPrevColorClassname);
    }

    snackbarTextElement.textContent = message;
    snackbarElement.classList.add(snackbarColorClassname, 'show');

    _snackbarVisibleInterval = setInterval(() => {
      snackbarElement.classList.remove(snackbarColorClassname, 'show');
      snackbarTextElement.textContent = '';
    }, 3500);
  };

  const showMessage = (snackbarElement, snackbarTextElement, type) => {
    return (message) => {
      switch (type) {
        case CONSTANTS.MESSAGE_TYPE.INFO:
          _constructSnackbar(snackbarElement, snackbarTextElement, 'snackbar-info', 'snackbar-error', message);
          break;
        case CONSTANTS.MESSAGE_TYPE.ERROR:
          _constructSnackbar(snackbarElement, snackbarTextElement, 'snackbar-error', 'snackbar-info', message);
          break;
        default:
          throw new Error(`unknown type: ${type}`);
      }
    };
  };

  const makeVisible = (element) => {
    if (element.classList.contains('hidden')) {
      element.classList.remove('hidden');
      element.classList.add('visible');
    }
  };

  const makeHidden = (element) => {
    if (element.classList.contains('visible')) {
      element.classList.remove('visible');
      element.classList.add('hidden');
    }
  };

  const navigateTo = (route) => {
    window.history.pushState({}, route, `/${route}`);
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

  const serializeForm = (form) => {
    const obj = {};
    const formData = new FormData(form);

    for (let key of formData.keys()) {
      obj[key] = formData.get(key);
    }

    return obj;
  };

  return {
    CONSTANTS,
    showMessage,
    makeVisible,
    makeHidden,
    navigateTo,
    extractTime,
    extractRecovery,
    serializeForm,
  };
})();
