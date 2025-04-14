
const firebaseConfig = {
  apiKey: "AIzaSyB2RNGWJ0VAgDyWRG84CuE_EHktd9ThkXI",
  authDomain: "shrimp-s-first-home.firebaseapp.com",
  databaseURL: "https://shrimp-s-first-home-default-rtdb.firebaseio.com",
  projectId: "shrimp-s-first-home",
  storageBucket: "shrimp-s-first-home.firebasestorage.app",
  messagingSenderId: "674906578968",
  appId: "1:674906578968:web:e7bbdd5261caacd201636d",
  measurementId: "G-MNCCYWXR83"
};

firebase.initializeApp(firebaseConfig);

const visitCounterRef = firebase.database().ref("visitCount");

visitCounterRef.transaction(current => {
  return (current || 0) + 1;
});

visitCounterRef.on("value", snapshot => {
  const count = snapshot.val();
  document.getElementById("visitorCounter").innerText = `參訪人數：${count}`;
});
