/**
 * Rucoy Online Clone - Рендерер
 * Версия: 1.0.0
 * Модуль: Graphics Renderer
 * Строк: ~600
 */

class Renderer {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        }
        
        this.width = width || window.innerWidth;
        this.height = height || window.innerHeight;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        
        // Настройки рендеринга
        this.ctx.imageSmoothingEnabled = false; // Пиксельная графика
        this.ctx.imageSmoothingQuality = 'low';
        
        // Спрайты
        this.sprites = new Map();
        this.spriteSheets = new Map();
        
        // Анимации
        this.animations = new Map();
        
        // Эффекты
        this.shake = 0;
        this.shakeIntensity = 0;
        this.flashEffect = null;
        
        // Загрузка спрайтов
        this.loadingQueue = [];
        this.loadedCount = 0;
        
        console.log(`Renderer инициализирован: ${this.width}x${this.height}`);
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    
    // Загрузка спрайта
    loadSprite(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sprites.set(name, img);
                this.loadedCount++;
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Не удалось загрузить спрайт: ${path}`);
                reject();
            };
            img.src = path;
            this.loadingQueue.push({ name, path });
        });
    }
    
    // Загрузка спрайт-листа
    loadSpriteSheet(name, path, tileWidth, tileHeight) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const sheet = {
                    image: img,
                    tileWidth: tileWidth,
                    tileHeight: tileHeight,
                    tilesX: Math.floor(img.width / tileWidth),
                    tilesY: Math.floor(img.height / tileHeight)
                };
                this.spriteSheets.set(name, sheet);
                this.loadedCount++;
                resolve(sheet);
            };
            img.onerror = reject;
            img.src = path;
        });
    }
    
    // Отрисовка спрайта
    drawSprite(name, x, y, width, height, rotation = 0, flipX = false) {
        const sprite = this.sprites.get(name);
        if (!sprite) return;
        
        const screenX = x + (this.shakeX || 0);
        const screenY = y + (this.shakeY || 0);
        
        this.ctx.save();
        
        if (rotation !== 0) {
            this.ctx.translate(screenX + width / 2, screenY + height / 2);
            this.ctx.rotate(rotation);
            this.ctx.translate(-(screenX + width / 2), -(screenY + height / 2));
        }
        
        if (flipX) {
            this.ctx.translate(screenX + width, screenY);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(screenX + width), -screenY);
        }
        
        this.ctx.drawImage(sprite, screenX, screenY, width, height);
        this.ctx.restore();
    }
    
    // Отрисовка из спрайт-листа
    drawTile(sheetName, tileIndex, x, y, width, height) {
        const sheet = this.spriteSheets.get(sheetName);
        if (!sheet) return;
        
        const tileX = (tileIndex % sheet.tilesX) * sheet.tileWidth;
        const tileY = Math.floor(tileIndex / sheet.tilesX) * sheet.tileHeight;
        
        this.ctx.drawImage(
            sheet.image,
            tileX, tileY,
            sheet.tileWidth, sheet.tileHeight,
            x, y,
            width || sheet.tileWidth,
            height || sheet.tileHeight
        );
    }
    
    // Отрисовка прямоугольника
    drawRect(x, y, width, height, color, filled = true) {
        if (filled) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(x, y, width, height);
        }
    }
    
    // Отрисовка круга
    drawCircle(x, y, radius, color, filled = true) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (filled) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    }
    
    // Отрисовка линии
    drawLine(x1, y1, x2, y2, color, width = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    }
    
    // Отрисовка текста
    drawText(text, x, y, color = '#ffffff', size = 12, align = 'left', font = 'monospace') {
        this.ctx.font = `${size}px ${font}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
    
    // Отрисовка полоски HP
    drawHealthBar(x, y, width, height, current, max, color = '#d44a4a') {
        const percent = Math.max(0, Math.min(1, current / max));
        
        // Фон
        this.drawRect(x, y, width, height, '#3a1f1f', true);
        // Заполнение
        this.drawRect(x, y, width * percent, height, color, true);
        // Рамка
        this.drawRect(x, y, width, height, '#000000', false);
    }
    
    // Эффект тряски камеры
    shakeCamera(intensity = 10, duration = 0.3) {
        this.shakeIntensity = intensity;
        this.shake = duration;
        
        const startTime = performance.now() / 1000;
        const shakeInterval = setInterval(() => {
            const elapsed = (performance.now() / 1000) - startTime;
            if (elapsed >= duration) {
                clearInterval(shakeInterval);
                this.shakeX = 0;
                this.shakeY = 0;
                return;
            }
            
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);
            this.shakeX = (Math.random() - 0.5) * currentIntensity;
            this.shakeY = (Math.random() - 0.5) * currentIntensity;
        }, 16);
    }
    
    // Эффект вспышки
    flash(color = '#ffffff', duration = 0.1) {
        this.flashEffect = {
            color: color,
            duration: duration,
            elapsed: 0,
            active: true
        };
        
        // Автоматическое отключение
        setTimeout(() => {
            if (this.flashEffect) this.flashEffect.active = false;
        }, duration * 1000);
    }
    
    // Обновление эффектов (вызывается каждый кадр)
    updateEffects(deltaTime) {
        if (this.flashEffect && this.flashEffect.active) {
            this.flashEffect.elapsed += deltaTime;
            const alpha = 1 - (this.flashEffect.elapsed / this.flashEffect.duration);
            
            this.ctx.fillStyle = this.flashEffect.color;
            this.ctx.globalAlpha = alpha * 0.5;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
            
            if (this.flashEffect.elapsed >= this.flashEffect.duration) {
                this.flashEffect = null;
            }
        }
    }
    
    // Применение трансформации камеры
    applyCamera(camera) {
        this.ctx.save();
        this.ctx.translate(-camera.x + this.shakeX, -camera.y + this.shakeY);
    }
    
    restoreCamera() {
        this.ctx.restore();
    }
    
    // Получение процента загрузки
    getLoadingProgress() {
        if (this.loadingQueue.length === 0) return 1;
        return this.loadedCount / this.loadingQueue.length;
    }
    
    // Очистка ресурсов
    destroy() {
        this.sprites.clear();
        this.spriteSheets.clear();
        this.animations.clear();
        console.log('Renderer уничтожен');
    }
}

window.Renderer = Renderer;
