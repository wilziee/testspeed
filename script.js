/* =================================================
   XAERISOFT SPEED TEST CORE ENGINE
   Copyright © 2026 WillXD. All Rights Reserved.
   ================================================= */

// 1. CUSTOM SMOOTH CURSOR (Lerp Animation)
const cursorDot = document.getElementById('cursor-dot');
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Lerp (Linear Interpolation) for smooth follow
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Interactive element hover effect for cursor
const interactiveElements = document.querySelectorAll('button, a');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '60px';
        cursorGlow.style.height = '60px';
        cursorGlow.style.backgroundColor = 'rgba(168, 85, 247, 0.4)';
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '40px';
        cursorGlow.style.height = '40px';
        cursorGlow.style.backgroundColor = 'transparent';
    });
});

// 2. 60FPS CANVAS STAR ENGINE (Parallax & Shooting Stars)
const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.baseAlpha = Math.random() * 0.5 + 0.1;
        this.alpha = this.baseAlpha;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = (Math.random() * 0.2) + 0.05;
        this.parallaxFactor = Math.random() * 0.02;
    }
    update() {
        this.phase += 0.02;
        this.alpha = this.baseAlpha + Math.sin(this.phase) * 0.3;
        
        // Slow float
        this.y -= this.speed;
        
        // Parallax effect based on mouse
        let targetX = this.x + (mouseX - canvas.width/2) * this.parallaxFactor;
        let targetY = this.y + (mouseY - canvas.height/2) * this.parallaxFactor;

        if (this.y < 0) this.reset();
        
        ctx.beginPath();
        ctx.arc(targetX, targetY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha)})`;
        ctx.fill();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width * 1.5;
        this.y = 0;
        this.len = Math.random() * 80 + 20;
        this.speed = Math.random() * 10 + 15;
        this.angle = Math.PI / 4; // 45 degrees
        this.active = false;
        this.delay = Math.random() * 200 + 100;
        this.timer = 0;
    }
    update() {
        if (!this.active) {
            this.timer++;
            if (this.timer > this.delay) {
                this.active = true;
                this.timer = 0;
            }
            return;
        }

        this.x -= this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.len * Math.cos(this.angle), this.y - this.len * Math.sin(this.angle));
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (this.x < 0 || this.y > canvas.height) this.reset();
    }
}

for (let i = 0; i < 200; i++) stars.push(new Star());
for (let i = 0; i < 2; i++) shootingStars.push(new ShootingStar());

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => s.update());
    shootingStars.forEach(s => s.update());
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// 3. DEVICE & BROWSER DETECTION
function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown";
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera M(obi|ini)/.test(ua)) return "Mobile";
    return "Desktop";
}

document.getElementById('info-browser').innerText = getBrowserInfo();
document.getElementById('info-device').innerText = getDeviceType();

function updateNetworkInfo() {
    document.getElementById('info-online').innerText = navigator.onLine ? "Online" : "Offline";
    document.getElementById('info-online').style.color = navigator.onLine ? "#10B981" : "#EF4444";
    
    let connType = "Unknown";
    if (navigator.connection) {
        connType = navigator.connection.effectiveType ? navigator.connection.effectiveType.toUpperCase() : "WIFI";
    }
    document.getElementById('info-connection').innerText = connType;
}
window.addEventListener('online', updateNetworkInfo);
window.addEventListener('offline', updateNetworkInfo);
updateNetworkInfo();

// 4. SPEED TEST SIMULATION ENGINE
// Note: Pure Client-Side simulation based on realistic fluctuation algorithms
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnCopy = document.getElementById('btn-copy');
const btnDownload = document.getElementById('btn-download');

const gaugeProgress = document.getElementById('gauge-progress');
const needleGroup = document.getElementById('needle-group');
const liveValue = document.getElementById('live-value');
const liveLabel = document.getElementById('live-label');

let isTesting = false;
let testAnimationId;
let testStartTime;
let durationInterval;

let finalResults = { ping: 0, download: 0, upload: 0, status: "" };

const GAUGE_MAX = 251.2; // stroke-dasharray

function updateGauge(value, max = 100) {
    let percentage = Math.min(value / max, 1);
    // Stroke dashoffset: 251.2 is 0%, 0 is 100%
    let offset = GAUGE_MAX - (GAUGE_MAX * percentage);
    gaugeProgress.style.strokeDashoffset = offset;
    
    // Needle rotation: -90deg is 0%, 90deg is 100%
    let angle = -90 + (180 * percentage);
    needleGroup.style.transform = `translate(100px, 100px) rotate(${angle}deg)`;
}

function calculateStatus(dl) {
    if (dl >= 50) return { text: "🟢 Login Bang", raw: "Excellent" };
    if (dl >= 20) return { text: "🟡 Bagus", raw: "Good" };
    if (dl >= 5) return { text: "🟠 lumayan lah", raw: "Average" };
    if (dl >= 1) return { text: "🔴 jangan main ml🥀", raw: "Slow" };
    return { text: "⚫ Very Slow", raw: "Very Slow" };
}

// Generate realistic fluctuating target based on base connection if available
function getTargetSpeed() {
    let base = navigator.connection && navigator.connection.downlink ? navigator.connection.downlink * 8 : 45; // Mbps
    return base + (Math.random() * 20); // Add randomness
}

async function runPhase(label, durationMs, targetValue, isPing = false) {
    return new Promise(resolve => {
        liveLabel.innerText = label;
        let startTime = performance.now();
        let currentValue = 0;
        
        function update(time) {
            if (!isTesting) return resolve(null); // Aborted
            let elapsed = time - startTime;
            let progress = elapsed / durationMs;
            
            if (progress >= 1) {
                // Final value
                let finalVal = (targetValue + (Math.random() * 2 - 1)).toFixed(2);
                if (isPing) finalVal = Math.floor(targetValue);
                resolve(finalVal);
                return;
            }

            // Fluctuation math (Ease out + Perlin-like noise)
            let easeOut = 1 - Math.pow(1 - progress, 3);
            let noise = (Math.random() * 0.1 - 0.05) * targetValue;
            currentValue = (targetValue * easeOut) + noise;
            if (currentValue < 0) currentValue = 0;

            liveValue.innerText = isPing ? Math.floor(currentValue) : currentValue.toFixed(2);
            updateGauge(currentValue, isPing ? 100 : 100); // Scale gauge to max 100

            testAnimationId = requestAnimationFrame(update);
        }
        testAnimationId = requestAnimationFrame(update);
    });
}

function updateDuration() {
    if (!isTesting) return;
    let sec = ((Date.now() - testStartTime) / 1000).toFixed(1);
    document.getElementById('info-duration').innerText = `${sec}s`;
}

async function startTest() {
    if (isTesting) return;
    isTesting = true;
    
    // UI Reset
    btnStart.disabled = true;
    btnStop.disabled = false;
    btnCopy.disabled = true;
    btnDownload.disabled = true;
    document.getElementById('val-ping').innerText = "--";
    document.getElementById('val-download').innerText = "--";
    document.getElementById('val-upload').innerText = "--";
    document.getElementById('val-status').innerText = "Testing...";
    
    testStartTime = Date.now();
    durationInterval = setInterval(updateDuration, 100);

    let targetDl = getTargetSpeed();
    let targetUl = targetDl * 0.4; // Upload usually slower
    let targetPing = Math.random() * 20 + 8; // 8-28ms

    // Phase 1: Ping (1.5s)
    let pingRes = await runPhase("Testing Ping...", 1500, targetPing, true);
    if(pingRes === null) return;
    finalResults.ping = pingRes;
    document.getElementById('val-ping').innerText = pingRes;

    // Phase 2: Download (4s)
    let dlRes = await runPhase("Downloading...", 4000, targetDl, false);
    if(dlRes === null) return;
    finalResults.download = dlRes;
    document.getElementById('val-download').innerText = dlRes;

    // Phase 3: Upload (4s)
    let ulRes = await runPhase("Uploading...", 4000, targetUl, false);
    if(ulRes === null) return;
    finalResults.upload = ulRes;
    document.getElementById('val-upload').innerText = ulRes;

    finishTest();
}

function finishTest() {
    isTesting = false;
    clearInterval(durationInterval);
    
    let status = calculateStatus(parseFloat(finalResults.download));
    finalResults.status = status.raw;
    
    document.getElementById('val-status').innerText = status.text;
    liveLabel.innerText = "Completed";
    liveValue.innerText = "-";
    updateGauge(0);
    
    btnStart.disabled = false;
    btnStart.innerText = "Test Again";
    btnStop.disabled = true;
    btnCopy.disabled = false;
    btnDownload.disabled = false;
}

function stopTest() {
    if (!isTesting) return;
    isTesting = false;
    cancelAnimationFrame(testAnimationId);
    clearInterval(durationInterval);
    
    liveLabel.innerText = "Aborted";
    updateGauge(0);
    
    btnStart.disabled = false;
    btnStop.disabled = true;
}

btnStart.addEventListener('click', startTest);
btnStop.addEventListener('click', stopTest);

// Output Actions
function getResultString() {
    return `Xaerisoft Speed Test Results:
Ping: ${finalResults.ping} ms
Download: ${finalResults.download} Mbps
Upload: ${finalResults.upload} Mbps
Status: ${finalResults.status}
Device: ${getDeviceType()} | Browser: ${getBrowserInfo()}`;
}

btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(getResultString()).then(() => {
        let originalText = btnCopy.innerText;
        btnCopy.innerText = "Copied!";
        setTimeout(() => btnCopy.innerText = originalText, 2000);
    });
});

btnDownload.addEventListener('click', () => {
    const blob = new Blob([getResultString()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xaerisoft-speedtest-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
