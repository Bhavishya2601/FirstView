async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        document.querySelector('.quote').innerText = `"${data.content}"`;
        document.querySelector('.author').innerText = `– ${data.author}`;
    } catch (error) {
        document.querySelector('.quote').innerText = '';
        document.querySelector('.author').innerText = '';
    }
}

function randomBackground() {
    const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpeg', '5.jpg', '6.jpeg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('images/${randomImage}')`;
}

function getGreeting() {
    const hour = new Date().getHours();
    const name = localStorage.getItem('firstView') || '';
    if (hour < 12) return `Good morning ${name}.`;
    else if (hour < 17) return `Good afternoon ${name}.`;
    else return `Good evening ${name}.`;
}

function updateTime() {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const greeting = getGreeting()
    document.querySelector(".greeting").innerText = greeting;
    document.querySelector(".time").innerText = time;
}

function init() {
    const name = localStorage.getItem('firstView');
    if (!name) {
        document.querySelector('.mainSection').style.display = 'none';
        document.querySelector('.introSection').style.display = 'flex';
    }
    fetchQuote();
    updateTime();
    randomBackground()
    setInterval(updateTime, 1000);
}
document.addEventListener('DOMContentLoaded', init);

document.querySelector('.headBtn').addEventListener('click', function () {
    const name = document.querySelector('#name').value;
    if (name == '') {
        alert('Please enter your name!')
    } else {
        localStorage.setItem('firstView', name);
        document.querySelector('.mainSection').style.display = 'block';
        document.querySelector('.introSection').style.display = 'none';
    }
})

