// script.js - Tất cả hiệu ứng sống động!

// === PARTICLE BACKGROUND ===
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 100;

class Particle {
    constructor()) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = 'rgba(79, 172, 254, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(79, 172, 254, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// === CHAT LOGIC ===
const chatContainer = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const loading = document.getElementById('loading');
const typing = document.getElementById('typing');

const aiResponses = [
    "Ồ, câu hỏi hay đấy! Hãy để tôi giải thích chi tiết hơn... 🚀",
    "Theo tôi biết, điều đó có thể đúng. Bạn nghĩ sao? 🤔",
    "Tôi là AI siêu việt! Câu trả lời là: Có! 🎉",
    "Haha, vui nhỉ! Hãy thử hỏi thêm nhé. 😄",
    "Dữ liệu cho thấy kết quả sẽ tuyệt vời! 📊",
    "Bạn thông minh lắm! Ý kiến của tôi là... 💡",
    "AI đây! Tôi có thể làm mọi thứ! ⚡",
    "Cảm ơn! Tiếp tục chat nào! 🔥"
];

function addMessage(text, type) {
    const message = document.createElement('div');
    message.classList.add('message', type + '-message');
    message.innerHTML = text;
    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getAIResponse() {
    return new Promise(resolve => {
        setTimeout(() => {
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            resolve(randomResponse);
        }, 1500 + Math.random() * 2000);
    });
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    loading.style.display = 'none';
    typing.style.display = 'flex';

    const response = await getAIResponse();
    typing.style.display = 'none';
    addMessage(response, 'ai');
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// === VOICE INPUT ===
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.textContent = '🎙️';
    });

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        voiceBtn.textContent = '🎤';
        sendMessage();
    };

    recognition.onerror = () => {
        voiceBtn.textContent = '🎤';
        alert('Lỗi giọng nói!');
    };

    recognition.onend = () => {
        voiceBtn.textContent = '🎤';
    };
} else {
    voiceBtn.style.display = 'none';
}

// === THEME TOGGLE ===
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
});

// === AUTO GREETING ===
setTimeout(() => {
    addMessage('Tôi đã được nâng cấp với particle, voice input, typing animation và theme toggle! 🎊', 'ai');
}, 2000);

