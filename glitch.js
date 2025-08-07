export function triggerGlitch(element) {
    if (element.isGlitching) {
        return;
    }
    element.isGlitching = true;

    const originalText = element.dataset.text || element.innerText;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:,.<>/?';

    let interval = null;
    let iteration = 0;

    element.classList.add('decoding-active');

    interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                if(index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("");

        if(iteration >= originalText.length){
            clearInterval(interval);
            element.innerText = originalText;
            element.classList.remove('decoding-active');
            element.isGlitching = false;
        }

        iteration += 1 / 3;
    }, 30);
}

export function applyGlitchEffect(element) {
    element.classList.add('glitch-text');
}

export function removeGlitchEffect(element) {
    element.classList.remove('glitch-text');
}

// Декодування тексту (ефект поступового появлення)
export function decodeTextEffect(element, text, speed = 10, callback) {
    element.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

// Глітч для випадкових рядків (для терміналу)
function getGlitchColors(textColor) {
    switch (textColor) {
        case '#ff0000':
        case 'red':
            return ['#00ff00', '#00aaff']; // зелений і синій
        case '#00ff00':
        case 'green':
            return ['#ff0000', '#00aaff']; // червоний і синій
        case '#00aaff':
        case 'blue':
            return ['#ff0000', '#00ff00']; // червоний і зелений
        default:
            return ['#ff0000', '#00ff00'];
    }
}

export function startRandomGlitch(terminalDiv) {
    return setInterval(() => {
        const lines = terminalDiv.querySelectorAll('.glitch-text');
        if (lines.length > 0) {
            const currentGlitch = terminalDiv.querySelector('.glitch-line-active');
            if (currentGlitch) {
                currentGlitch.classList.remove('glitch-line-active');
            }
            const randomIndex = Math.floor(Math.random() * lines.length);
            const line = lines[randomIndex];
            // Визначаємо поточний колір тексту саме цього рядка!
            let textColor = line.style.color || getComputedStyle(line).color;
            if (textColor.startsWith('rgb')) {
                const rgb = textColor.match(/\d+/g).map(Number);
                textColor = '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
            }
            const [glitch1, glitch2] = getGlitchColors(textColor.toLowerCase());
            line.style.setProperty('--glitch-color-1', glitch1);
            line.style.setProperty('--glitch-color-2', glitch2);
            line.classList.add('glitch-line-active');
        }
    }, 5000);
}

export function stopRandomGlitch(terminalDiv, glitchInterval) {
    clearInterval(glitchInterval);
    const currentGlitch = terminalDiv.querySelector('.glitch-line-active');
    if (currentGlitch) {
        currentGlitch.classList.remove('glitch-line-active');
    }
}

export function decodeLinesSequentially(lines, texts, speed = 30) {
    let i = 0;
    function next() {
        if (i >= lines.length) return;
        decodeTextEffect(lines[i], texts[i], speed, () => {
            i++;
            next();
        });
    }
    next();
}
