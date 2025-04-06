// script.js
let visitCount = localStorage.getItem('visitCount') || 0;
visitCount++;
localStorage.setItem('visitCount', visitCount);
document.getElementById('visitorCounter').innerText = `參訪人數：${visitCount}`;

const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
renderSubscribers();

function addSubscriber() {
  const name = document.getElementById('subscriberName').value;
  const password = prompt("請輸入管理者密碼：");
  if (password !== "1125") {
    alert("密碼錯誤");
    return;
  }
  if (name && !subscribers.includes(name)) {
    subscribers.push(name);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    renderSubscribers();
    document.getElementById('subscriberName').value = '';
  }
}

function removeSubscriber(name) {
  const password = prompt("請輸入管理者密碼：");
  if (password !== "1125") {
    alert("密碼錯誤");
    return;
  }
  const index = subscribers.indexOf(name);
  if (index !== -1) {
    subscribers.splice(index, 1);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    renderSubscribers();
  }
}

function renderSubscribers() {
  const list = document.getElementById('subscriberList');
  list.innerHTML = '';
  subscribers.forEach(name => {
    const li = document.createElement('li');
    li.innerHTML = `${name} <button onclick="removeSubscriber('${name}')">刪除</button>`;
    list.appendChild(li);
  });
}