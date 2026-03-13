class MobileAutoClicker {
    constructor() {
        this.isRunning = false;
        this.clickCount = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.clickInterval = null;
        this.circles = [];
        this.maxCircles = 5;
        this.minCircles = 1;
        this.clickSpeed = 10; // кликов в секунду
        this.clickType = 'single';
        this.menuMinimized = false;
        
        // Для перетаскивания
        this.dragging = false;
        this.dragCircle = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        // Для пасхалки
        this.easterEggClickCount = 0;
        this.keysPressed = {};
        
        this.initializeElements();
        this.attachEventListeners();
        this.createCircles();
        this.initEasterEgg();
    }

    initializeElements() {
        // Меню
        this.floatingMenu = document.getElementById('floatingMenu');
        this.menuContent = document.getElementById('menuContent');
        this.toggleMenuBtn = document.getElementById('toggleMenuBtn');
        this.quickAccess = document.getElementById('quickAccess');
        
        // Управление скоростью
        this.speedValue = document.getElementById('speedValue');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedDown = document.getElementById('speedDown');
        this.speedUp = document.getElementById('speedUp');
        
        // Управление кружками
        this.circleCount = document.getElementById('circleCount');
        this.addCircle = document.getElementById('addCircle');
        this.removeCircle = document.getElementById('removeCircle');
        
        // Тип клика
        this.typeBtns = document.querySelectorAll('.type-btn');
        
        // Кнопки действий
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        
        // Статистика
        this.clickCountEl = document.getElementById('clickCount');
        this.timerEl = document.getElementById('timer');
        
        // Контейнер для кружков
        this.circlesContainer = document.getElementById('circlesContainer');
        
        // Пасхалка
        this.easterEgg = document.getElementById('easterEgg');
        
        // Уведомление
        this.notification = document.createElement('div');
        this.notification.className = 'notification';
        document.body.appendChild(this.notification);
    }

    attachEventListeners() {
        // Сворачивание меню
        this.toggleMenuBtn.addEventListener('click', () => this.toggleMenu());
        
        // Быстрый доступ
        this.quickAccess.addEventListener('click', () => {
            this.menuMinimized = false;
            this.floatingMenu.classList.remove('minimized');
            this.quickAccess.classList.remove('visible');
        });
        
        // Управление скоростью
        this.speedSlider.addEventListener('input', (e) => {
            this.clickSpeed = parseInt(e.target.value);
            this.speedValue.textContent = this.clickSpeed;
        });
        
        this.speedDown.addEventListener('click', () => {
            if (this.clickSpeed > 1) {
                this.clickSpeed--;
                this.speedSlider.value = this.clickSpeed;
                this.speedValue.textContent = this.clickSpeed;
            }
        });
        
        this.speedUp.addEventListener('click', () => {
            if (this.clickSpeed < 30) {
                this.clickSpeed++;
                this.speedSlider.value = this.clickSpeed;
                this.speedValue.textContent = this.clickSpeed;
            }
        });
        
        // Добавление/удаление кружков
        this.addCircle.addEventListener('click', () => this.addNewCircle());
        this.removeCircle.addEventListener('click', () => this.removeLastCircle());
        
        // Тип клика
        this.typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.typeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.clickType = btn.dataset.type;
            });
        });
        
        // Кнопки старт/стоп
        this.startBtn.addEventListener('click', () => this.startClicking());
        this.stopBtn.addEventListener('click', () => this.stopClicking());
        
        // Обработка касаний всего экрана для перетаскивания
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Предотвращаем стандартные жесты
        document.addEventListener('touchmove', (e) => {
            if (this.dragging) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    createCircles() {
        // Создаем кружки в разных частях экрана
        const positions = [
            { x: 30, y: 50 },
            { x: 70, y: 40 },
            { x: 50, y: 60 },
            { x: 20, y: 70 },
            { x: 80, y: 30 }
        ];
        
        for (let i = 0; i < this.minCircles; i++) {
            this.createCircle(positions[i % positions.length]);
        }
        
        this.updateCircleCount();
    }

    createCircle(pos) {
        const circle = document.createElement('div');
        circle.className = 'click-circle';
        circle.dataset.index = this.circles.length;
        
        // Устанавливаем позицию в процентах от экрана
        circle.style.left = pos.x + '%';
        circle.style.top = pos.y + '%';
        
        // Внутренность кружка
        const inner = document.createElement('div');
        inner.className = 'circle-inner';
        
        const number = document.createElement('span');
        number.className = 'circle-number';
        number.textContent = this.circles.length + 1;
        
        inner.appendChild(number);
        circle.appendChild(inner);
        
        // Добавляем на страницу
        this.circlesContainer.appendChild(circle);
        this.circles.push({
            element: circle,
            x: pos.x,
            y: pos.y
        });
    }

    addNewCircle() {
        if (this.circles.length < this.maxCircles) {
            // Случайная позиция
            const pos = {
                x: 20 + Math.random() * 60,
                y: 20 + Math.random() * 60
            };
            this.createCircle(pos);
            this.updateCircleCount();
            this.showNotification('➕ Кружок добавлен');
        } else {
            this.showNotification(`❌ Максимум ${this.maxCircles} кружков`);
        }
    }

    removeLastCircle() {
        if (this.circles.length > this.minCircles) {
            const circle = this.circles.pop();
            circle.element.remove();
            this.updateCircleCount();
            this.showNotification('➖ Кружок удален');
        } else {
            this.showNotification('❌ Должен быть хотя бы 1 кружок');
        }
    }

    updateCircleCount() {
        this.circleCount.textContent = this.circles.length;
        
        // Обновляем номера на кружках
        this.circles.forEach((circle, index) => {
            const number = circle.element.querySelector('.circle-number');
            if (number) {
                number.textContent = index + 1;
            }
        });
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        const target = e.target;
        
        // Проверяем, нажали ли на кружок
        if (target.closest('.click-circle')) {
            const circle = target.closest('.click-circle');
            this.dragging = true;
            this.dragCircle = circle;
            
            // Вычисляем смещение
            const rect = circle.getBoundingClientRect();
            this.dragOffsetX = touch.clientX - rect.left - rect.width / 2;
            this.dragOffsetY = touch.clientY - rect.top - rect.height / 2;
            
            circle.classList.add('dragging');
            
            // Показываем подсказку
            this.showDragIndicator();
            
            e.preventDefault();
        }
    }

    handleTouchMove(e) {
        if (!this.dragging || !this.dragCircle) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        
        // Получаем координаты в процентах
        const x = (touch.clientX / window.innerWidth) * 100;
        const y = (touch.clientY / window.innerHeight) * 100;
        
        // Ограничиваем, чтобы кружок не уходил за край
        const boundedX = Math.max(5, Math.min(95, x));
        const boundedY = Math.max(5, Math.min(95, y));
        
        // Перемещаем кружок
        this.dragCircle.style.left = boundedX + '%';
        this.dragCircle.style.top = boundedY + '%';
        
        // Обновляем данные
        const index = parseInt(this.dragCircle.dataset.index);
        if (this.circles[index]) {
            this.circles[index].x = boundedX;
            this.circles[index].y = boundedY;
        }
    }

    handleTouchEnd(e) {
        if (this.dragging && this.dragCircle) {
            this.dragCircle.classList.remove('dragging');
            this.dragging = false;
            this.dragCircle = null;
        }
    }

    showDragIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'drag-indicator';
        indicator.textContent = '👆 Перемести кружок';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 1000);
    }

    toggleMenu() {
        this.menuMinimized = !this.menuMinimized;
        
        if (this.menuMinimized) {
            this.floatingMenu.classList.add('minimized');
            this.toggleMenuBtn.textContent = '+';
            this.quickAccess.classList.add('visible');
        } else {
            this.floatingMenu.classList.remove('minimized');
            this.toggleMenuBtn.textContent = '−';
            this.quickAccess.classList.remove('visible');
        }
    }

    startClicking() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now() - (this.clickCount * (1000 / this.clickSpeed));
        
        // Обновляем кнопки
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        
        this.showNotification('✅ Автокликер запущен');
        
        // Запускаем клики
        const interval = 1000 / this.clickSpeed;
        this.clickInterval = setInterval(() => {
            this.performClick();
        }, interval);
        
        // Запускаем таймер
        this.timerInterval = setInterval(() => this.updateTimer(), 10);
    }

    stopClicking() {
        this.isRunning = false;
        
        // Очищаем интервалы
        clearInterval(this.clickInterval);
        clearInterval(this.timerInterval);
        
        // Обновляем кнопки
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        
        this.showNotification('⏹ Автокликер остановлен');
    }

    performClick() {
        // Анимируем каждый кружок
        this.circles.forEach(circle => {
            circle.element.classList.add('clicked');
            
            setTimeout(() => {
                circle.element.classList.remove('clicked');
            }, 200);
        });
        
        // Увеличиваем счетчик
        this.clickCount += this.circles.length * (this.clickType === 'double' ? 2 : 1);
        this.clickCountEl.textContent = this.clickCount;
        
        // Вибрация (если поддерживается)
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        this.timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showNotification(message) {
        this.notification.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 1500);
    }

    // Пасхалка
    initEasterEgg() {
        // По клику на заголовок меню
        const menuTitle = document.querySelector('.menu-title');
        menuTitle.addEventListener('click', () => {
            this.easterEggClickCount++;
            
            if (this.easterEggClickCount >= 5) {
                this.showEasterEgg();
                this.easterEggClickCount = 0;
            } else if (this.easterEggClickCount === 3) {
                this.showNotification('🤔 Что-то тут есть...');
            }
        });
        
        // Комбинация клавиш
        document.addEventListener('keydown', (e) => {
            this.keysPressed[e.key.toLowerCase()] = true;
            
            // ВАНЯ
            if (this.keysPressed['в'] && this.keysPressed['а'] && this.keysPressed['н'] && this.keysPressed['я']) {
                this.showEasterEgg();
                this.keysPressed = {};
            }
            
            // DEXTER
            if (this.keysPressed['d'] && this.keysPressed['e'] && this.keysPressed['x'] && 
                this.keysPressed['t'] && this.keysPressed['e'] && this.keysPressed['r']) {
                this.showEasterEgg();
                this.keysPressed = {};
            }
        });
        
        document.addEventListener('keyup', (e) => {
            delete this.keysPressed[e.key.toLowerCase()];
        });
    }

    showEasterEgg() {
        this.easterEgg.classList.add('visible');
        
        // Конфетти
        this.createConfetti();
        
        // Вибрация
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
        
        setTimeout(() => {
            this.easterEgg.classList.remove('visible');
        }, 4000);
    }

    createConfetti() {
        const emojis = ['⚡', '🎮', '📱', '👆', '🎯', '⭐', '👾', '🤫', '🔍'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-20px';
                confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
                confetti.style.zIndex = '10000';
                confetti.style.pointerEvents = 'none';
                confetti.style.animation = `float ${Math.random() * 3 + 2}s linear forwards`;
                confetti.style.opacity = Math.random() * 0.8 + 0.2;
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }
}

// Добавляем стиль для анимации конфетти
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new MobileAutoClicker();
});
