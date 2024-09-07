document.addEventListener('DOMContentLoaded', () => {
    const languageIcon = document.getElementById('language-icon');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const status = document.getElementById('status');
    const flipButton = document.getElementById('flip');
    const signalAccuracyElement = document.getElementById('signal-accuracy');
    const countdownElement = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    let currentLanguage = 'en';
    let lastResult = '';
    let accuracy = '+86';
    let cooldownEndTime = 0;
    let isCooldownActive = false;
    let isTailsUp = false;

    const translations = {
        ru: {
            status: 'VORTEX',
            heads: 'ОРЁЛ',
            tails: 'РЕШКА',
            flip: 'Получить Сигнал',
            accuracy: 'Точность сигнала: ',
            countdown: 'Осталось:',
            wait: 'ЖДИТЕ...'
        },
        en: {
            status: 'VORTEX',
            heads: 'HEADS',
            tails: 'TAILS',
            flip: 'Get Signal',
            accuracy: 'Signal Accuracy: ',
            countdown: 'Remaining:',
            wait: 'WAIT...'
        },
        hi: {
            status: 'VORTEX',
            heads: 'सिर',
            tails: 'पूंछ',
            flip: 'सिग्नल प्राप्त करें',
            accuracy: 'सिग्नल सटीकता: ',
            countdown: 'सेकंड बचा:',
            wait: 'रुको...'
        },
        pt: {
            status: 'VORTEX',
            heads: 'CABEÇAS',
            tails: 'CAUDAS',
            flip: 'Receber Sinal',
            accuracy: 'Precisão do sinal: ',
            countdown: 'Restante:',
            wait: 'AGUARDE...'
        },
        es: {
            status: 'VORTEX',
            heads: 'CABEZAS',
            tails: 'CRUZ',
            flip: 'Recibir Señal',
            accuracy: 'Precisión de la señal: ',
            countdown: 'Restantes:',
            wait: 'ESPERE...'
        },
        tr: {
            status: 'VORTEX',
            heads: 'KAFALAR',
            tails: 'YAZI',
            flip: 'Sinyal Al',
            accuracy: 'Sinyal Doğruluğu: ',
            countdown: 'Kaldı:',
            wait: 'BEKLEYIN...'
        }
    };

    function updateSignalAccuracy() {
        signalAccuracyElement.innerText = `${translations[currentLanguage].accuracy}${accuracy}%`;
    }

    function updateCountdown() {
        const now = Date.now();
        const timeLeft = Math.max(0, cooldownEndTime - now);
        const secondsLeft = Math.ceil(timeLeft / 1000);

        if (timeLeft > 0) {
            const progress = 1 - timeLeft / 9000;
            progressBar.style.width = `${(1 - progress) * 100}%`;
            countdownElement.innerText = `${translations[currentLanguage].countdown} ${secondsLeft}s`;
            flipButton.disabled = true;
            flipButton.classList.add('disabled');
            isCooldownActive = true;
        } else {
            progressBar.style.width = '100%';
            countdownElement.innerText = `${translations[currentLanguage].countdown} 0s`;
            flipButton.disabled = false;
            flipButton.classList.remove('disabled');
            isCooldownActive = false;
        }
    }

    function updateLanguage(lang) {
        const translation = translations[lang];
        document.getElementById('status').innerText = lastResult ? (lastResult === 'heads' ? translation.heads : translation.tails) : translation.status;
        document.getElementById('flip').innerText = translation.flip;
        updateSignalAccuracy();

        if (isCooldownActive) {
            flipButton.disabled = true;
            flipButton.classList.add('disabled');
        }
        updateCountdown();
    }

    function toggleDropdown() {
        if (!languageDropdown.classList.contains('show')) {
            languageDropdown.classList.add('show');
        } else {
            languageDropdown.classList.remove('show');
            languageDropdown.style.display = 'none';
        }
    }

    languageIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (languageDropdown.style.display === 'none' || languageDropdown.style.display === '') {
            languageDropdown.style.display = 'grid';
            requestAnimationFrame(() => {
                languageDropdown.classList.add('show');
            });
        } else {
            toggleDropdown();
        }
    });

    document.addEventListener('click', (event) => {
        if (languageDropdown.classList.contains('show') && !languageDropdown.contains(event.target) && event.target !== languageIcon) {
            toggleDropdown();
        }
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = option.dataset.lang;
            if (languageIcon.src.includes(option.src)) {
                toggleDropdown();
                return;
            }

            languageIcon.src = option.src;
            currentLanguage = selectedLang;
            updateLanguage(currentLanguage);
            toggleDropdown();
        });
    });

    function updateCooldown() {
        updateCountdown();
        if (isCooldownActive) {
            requestAnimationFrame(updateCooldown);
        }
    }

    flipButton.addEventListener('click', function () {
        const coin = document.getElementById('coin');

        // Сразу отключаем кнопку
        flipButton.disabled = true;
        flipButton.classList.add('disabled');
        isCooldownActive = true;

        // Устанавливаем статус на "WAIT..."
        status.innerText = translations[currentLanguage].wait;

        // Ожидание 1500 мс перед запуском всех других действий, включая таймер и прогресс бар
        setTimeout(() => {
            // Запускаем таймер обратного отсчета и прогресс бар с задержкой
            cooldownEndTime = Date.now() + 9000;
            requestAnimationFrame(updateCooldown);

            // Запускаем анимацию и обновляем статус
            coin.classList.remove('animate-heads-to-heads', 'animate-heads-to-tails', 'animate-tails-to-tails', 'animate-tails-to-heads');
            coin.style.animation = 'none';
            coin.offsetHeight;
            coin.style.animation = '';

            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            lastResult = result;
            accuracy = Math.floor(Math.random() * (99 - 86 + 1)) + 86;

            let animationClass;
            if (isTailsUp) {
                animationClass = result === 'heads' ? 'animate-tails-to-heads' : 'animate-tails-to-tails';
                isTailsUp = result === 'tails';
            } else {
                animationClass = result === 'heads' ? 'animate-heads-to-heads' : 'animate-heads-to-tails';
                isTailsUp = result === 'tails';
            }

            coin.classList.add(animationClass);

            setTimeout(() => {
                status.innerText = translations[currentLanguage][result];
                updateSignalAccuracy();
                status.classList.add('pulse-once');
                signalAccuracyElement.classList.remove('pulse-once');
                signalAccuracyElement.offsetWidth;
                signalAccuracyElement.classList.add('pulse-once');
            }, 1400);
        }, 1500); // Все события, включая таймер и прогресс бар, срабатывают через 1500 мс
    });

    updateLanguage(currentLanguage);
});