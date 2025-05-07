async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        document.querySelector('.quote').innerText = `"${data.content}"`;
        document.querySelector('.author').innerText = `- ${data.author}`;
    } catch (error) {
        document.querySelector('.quote').innerText = '';
        document.querySelector('.author').innerText = '';
    }
}

function randomBackground() {
    const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpeg', '5.jpg', '6.jpeg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    if (localStorage.getItem('selectedBackground') !== 'random') {
        document.body.style.backgroundImage = `url('images/${localStorage.getItem('selectedBackground')}')`;
        return;
    }
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('images/${randomImage}')`;
}

function getGreeting() {
    const hour = new Date().getHours();
    const name = localStorage.getItem('firstView') || '';
    if (hour < 12) return `Good morning ${name}`;
    else if (hour < 17) return `Good afternoon ${name}`;
    else return `Good evening ${name}`;
}

function updateTime() {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const greeting = getGreeting()
    document.querySelector(".greeting").innerText = greeting;
    document.querySelector(".time").innerText = time;
}

document.querySelector('.headBtn').addEventListener('click', function () {
    const name = document.querySelector('#name').value;
    if (name == '') {
        alert('Please enter your name!')
    } else {
        localStorage.setItem('firstView', name);
        document.querySelector('.container').style.display = 'block';
        document.querySelector('.introSection').style.display = 'none';
    }
})

document.querySelector('.settings').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.mainSection').classList.toggle('shrinked');
});

function displayAllBackgrounds() {
    const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpeg', '5.jpg', '6.jpeg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
    const container = document.querySelector('.photo');

    let selectedImage = localStorage.getItem('selectedBackground');
    if (!selectedImage) {
        localStorage.setItem('selectedBackground', 'random');
    }

    images.forEach(image => {
        const img = document.createElement('img');
        img.src = `images/${image}`;
        img.classList.add('background-image');

        if (image === selectedImage) {
            img.style.border = '2px solid #fff';
        }

        img.addEventListener('click', () => {
            document.querySelectorAll('.background-image').forEach(img => {
                img.style.border = 'none';
            });

            img.style.border = '2px solid #fff';

            document.body.style.backgroundImage = `url('images/${image}')`;
            localStorage.setItem('selectedBackground', image);
        });
        container.appendChild(img);
    });
}

document.querySelector('.random').addEventListener('click', () => {
    localStorage.setItem('selectedBackground', 'random');
    document.querySelectorAll('.background-image').forEach(img => {
        img.style.border = 'none';
    });
    document.querySelector('.random').style.border = '2px solid #fff';
});

function init() {
    const name = localStorage.getItem('firstView');
    if (!name) {
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.introSection').style.display = 'flex';
    }
    if (localStorage.getItem('selectedBackground') === 'random') {
        document.querySelector('.random').style.border = '2px solid #fff';
    }
    fetchQuote();
    updateTime();
    randomBackground()
    displayAllBackgrounds();
    setInterval(updateTime, 1000);
}

document.addEventListener('DOMContentLoaded', init);