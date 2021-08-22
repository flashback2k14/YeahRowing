const cookieWrapper = (() => {
  const CONSTANTS = {
    TOKEN: 'token',
  };

  function setCookie(key, value, expiresInDays) {
    const d = new Date();
    d.setTime(d.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${key}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
  }

  function getCookie(key) {
    if (!document.cookie) {
      return null;
    }

    if (document.cookie)
      return document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`))
        .split('=')[1];
  }

  function checkCookie(key) {
    const value = getCookie(key);
    return value !== null;
  }

  function deleteCookie(key) {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `${key}=; ${expires}; path=/; SameSite=Strict; Secure`;
  }

  return {
    CONSTANTS,
    checkCookie,
    getCookie,
    setCookie,
    deleteCookie,
  };
})();
