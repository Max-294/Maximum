const adminPassword = "1125";
let subscribers = [];

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
}

function navigateToGame() {
  window.location.href = "wordsearch.html";
}

function addSubscriber() {
  const name = document.getElementById('subscriberName').value;
  const password = document.getElementById('adminPassword').value;
  if (password !== adminPassword) {
    alert("密碼錯誤");
    return;
  }
  if (name) {
    subscribers.push(name);
    renderSubscribers();
  }
}

function removeSubscriber(index) {
  const password = prompt("請輸入管理者密碼以刪除：");
  if (password !== adminPassword) {
    alert("密碼錯誤");
    return;
  }
  subscribers.splice(index, 1);
  renderSubscribers();
}

function renderSubscribers() {
  const list = document.getElementById('subscriberList');
  list.innerHTML = "";
  subscribers.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = name;
    const btn = document.createElement('button');
    btn.textContent = "刪除";
    btn.onclick = () => removeSubscriber(index);
    li.appendChild(btn);
    list.appendChild(li);
  });
}