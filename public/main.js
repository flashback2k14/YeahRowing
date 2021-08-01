(async () => {
  const txtUsername = document.getElementById('username');
  const txtPassword = document.getElementById('password');
  const btnLogin = document.getElementById('login');
  const dataHolder = document.getElementsByClassName('holder')[0];

  const createLi = (data) => {
    const li = document.createElement('li');
    li.textContent = data;
    return li;
  };

  const render = (data) => {
    const ul = document.createElement('ul');

    data.forEach((entry) => {
      const li = document.createElement('li');
      li.textContent = entry.date;
      li.id = entry.pid;

      const ulul = document.createElement('ul');
      ulul.id = entry.rid;

      ulul.appendChild(createLi(data.time));
      ulul.appendChild(createLi(entry.spm));
      ulul.appendChild(createLi(entry.distance));
      ulul.appendChild(createLi(entry.totalStrokes));
      ulul.appendChild(createLi(entry.calories));
      ulul.appendChild(createLi(entry.recovery));

      li.appendChild(ulul);
      ul.appendChild(li);
    });

    dataHolder.appendChild(ul);
  };

  const load = async () => {
    const base64 = btoa(`${txtUsername.value}:${txtPassword.value}`);

    const response = await fetch('/api/training/data', {
      headers: {
        authorization: `Basic ${base64}`,
      },
    });
    const data = await response.json();
    console.log(data);
    render(data);
  };

  const init = () => {
    btnLogin.addEventListener('click', async () => load());
  };

  init();
})();
