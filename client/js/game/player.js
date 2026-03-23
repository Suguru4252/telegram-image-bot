/**
 * Rucoy Online Clone - Система игрока
 * Версия: 1.0.0
 * Модуль: Player Class
 * Строк: ~900
 */

class Player {
    constructor(x, y, name) {
        // Базовая позиция
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.size = 32;
        this.speed = 180; // пикселей в секунду
        
        // Движение
        this.moving = false;
        this.moveProgress = 1;
        this.moveDirection = { x: 0, y: 0 };
        
        // Анимация
        this.animationFrame = 0;
        this.animationSpeed = 8;
        this.direction = 'down'; // up, down, left, right
        
        // Характеристики
        this.level = 1;
        this.exp = 0;
        this.expToNext = 100;
        
        // Боевые статы
        this.maxHp = 120;
        this.hp = 120;
        this.maxMp = 60;
        this.mp = 60;
        
        // Атака и защита
        this.baseAttack = 22;
        this.baseDefense = 12;
        this.critChance = 0.05;
        this.critDamage = 1.5;
        
        // Бонусы от экипировки
        this.attackBonus = 0;
        this.defenseBonus = 0;
        
        // Класс
        this.class = 'knight'; // knight, archer, mage
        this.classSkills = {
            knight: {
                name: 'Рыцарь',
                skill: 'Whirlwind',
                description: 'Вихревая атака по всем врагам вокруг'
            },
            archer: {
                name: 'Лучник',
                skill: 'Multi Shot',
                description: 'Выстрел тремя стрелами'
            },
            mage: {
                name: 'Маг',
                skill: 'Fireball',
                description: 'Огненный шар с радиусным уроном'
            }
        };
        
        // Инвентарь
        this.inventory = new Inventory(40); // 40 слотов
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            boots: null,
            gloves: null,
            ring: null,
            necklace: null
        };
        
        // Экономика
        this.gold = 0;
        this.gems = 0;
        
        // Достижения и квесты
        this.achievements = [];
        this.activeQuests = [];
        this.completedQuests = [];
        
        // PvP статы
        this.kills = 0;
        this.deaths = 0;
        this.pvpPoints = 0;
        
        // Гилдия
        this.guild = null;
        this.guildRank = null;
        
        // Настройки
        this.settings = {
            autoLoot: true,
            showNames: true,
            soundVolume: 0.7,
            musicVolume: 0.5
        };
        
        // Временные эффекты
        this.buffs = [];
        this.debuffs = [];
        this.cooldowns = new Map();
        
        // Таймеры
        this.lastAttackTime = 0;
        this.attackCooldown = 0.6; // секунд
        this.lastSkillTime = 0;
        this.skillCooldown = 3;
        
        // Имя
        this.name = name || 'Player';
        
        // Цвета для ников (по гильдии/рангу)
        this.nameColor = '#ffd966';
        
        console.log(`Игрок ${this.name} создан на позиции (${this.x}, ${this.y})`);
    }
    
    // Получение общего урона
    get totalAttack() {
        let bonus = this.attackBonus;
        if (this.equipment.weapon) bonus += this.equipment.weapon.damage;
        return this.baseAttack + bonus;
    }
    
    // Получение общей защиты
    get totalDefense() {
        let bonus = this.defenseBonus;
        if (this.equipment.armor) bonus += this.equipment.armor.defense;
        if (this.equipment.helmet) bonus += this.equipment.helmet.defense;
        if (this.equipment.boots) bonus += this.equipment.boots.defense;
        if (this.equipment.gloves) bonus += this.equipment.gloves.defense;
        return this.baseDefense + bonus;
    }
    
    // Обновление игрока
    update(deltaTime) {
        // Движение
        this.updateMovement(deltaTime);
        
        // Анимация
        this.animationFrame += deltaTime * this.animationSpeed;
        if (this.animationFrame > Math.PI * 2) this.animationFrame -= Math.PI * 2;
        
        // Обновление баффов
        this.updateBuffs(deltaTime);
        
        // Регенерация
        this.updateRegeneration(deltaTime);
        
        // Обновление кулдаунов
        this.updateCooldowns(deltaTime);
    }
    
    updateMovement(deltaTime) {
        // Если есть целевая позиция и игрок не мертв
        if ((this.targetX !== this.x || this.targetY !== this.y) && this.hp > 0) {
            if (!this.moving) {
                this.moving = true;
                this.moveProgress = 0;
                
                // Определяем направление для анимации
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.direction = dx > 0 ? 'right' : 'left';
                } else {
                    this.direction = dy > 0 ? 'down' : 'up';
                }
            }
            
            // Плавное движение
            const step = this.speed * deltaTime;
            this.moveProgress += step / this.getDistanceToTarget();
            
            if (this.moveProgress >= 1) {
                // Достигли цели
                this.x = this.targetX;
                this.y = this.targetY;
                this.moving = false;
                this.moveProgress = 1;
            } else {
                // Интерполяция
                this.x = this.x + (this.targetX - this.x) * this.moveProgress;
                this.y = this.y + (this.targetY - this.y) * this.moveProgress;
            }
        } else {
            this.moving = false;
        }
    }
    
    getDistanceToTarget() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    updateBuffs(deltaTime) {
        for (let i = 0; i < this.buffs.length; i++) {
            const buff = this.buffs[i];
            buff.duration -= deltaTime;
            if (buff.duration <= 0) {
                this.buffs.splice(i, 1);
                i--;
                this.removeBuffEffect(buff);
            }
        }
        
        for (let i = 0; i < this.debuffs.length; i++) {
            const debuff = this.debuffs[i];
            debuff.duration -= deltaTime;
            if (debuff.duration <= 0) {
                this.debuffs.splice(i, 1);
                i--;
                this.removeDebuffEffect(debuff);
            }
        }
    }
    
    updateRegeneration(deltaTime) {
        // HP реген (1% в секунду)
        if (this.hp < this.maxHp && this.hp > 0) {
            const regen = Math.max(2, this.maxHp * 0.01 * deltaTime);
            this.hp = Math.min(this.maxHp, this.hp + regen);
        }
        
        // MP реген
        if (this.mp < this.maxMp && this.hp > 0) {
            let regen = 3 * deltaTime;
            if (this.class === 'mage') regen *= 1.5;
            this.mp = Math.min(this.maxMp, this.mp + regen);
        }
    }
    
    updateCooldowns(deltaTime) {
        for (const [skill, time] of this.cooldowns) {
            const newTime = time - deltaTime;
            if (newTime <= 0) {
                this.cooldowns.delete(skill);
            } else {
                this.cooldowns.set(skill, newTime);
            }
        }
    }
    
    addBuff(buff) {
        this.buffs.push(buff);
        this.applyBuffEffect(buff);
    }
    
    applyBuffEffect(buff) {
        switch (buff.type) {
            case 'damage':
                this.attackBonus += buff.value;
                break;
            case 'defense':
                this.defenseBonus += buff.value;
                break;
            case 'speed':
                this.speed *= buff.value;
                break;
        }
    }
    
    removeBuffEffect(buff) {
        switch (buff.type) {
            case 'damage':
                this.attackBonus -= buff.value;
                break;
            case 'defense':
                this.defenseBonus -= buff.value;
                break;
            case 'speed':
                this.speed /= buff.value;
                break;
        }
    }
    
    removeDebuffEffect(debuff) {
        // Аналогично баффам, но обратный эффект
    }
    
    // Атака
    attack(target) {
        const now = Date.now() / 1000;
        if (now - this.lastAttackTime < this.attackCooldown) {
            return { success: false, reason: 'cooldown' };
        }
        
        if (this.hp <= 0) {
            return { success: false, reason: 'dead' };
        }
        
        // Расчет урона
        let damage = this.totalAttack - target.defense;
        damage += (Math.random() - 0.5) * 10;
        
        // Критический удар
        let isCrit = false;
        if (Math.random() < this.critChance) {
            damage *= this.critDamage;
            isCrit = true;
        }
        
        damage = Math.max(5, Math.floor(damage));
        
        // Применение урона
        const result = target.takeDamage(damage, this);
        
        this.lastAttackTime = now;
        
        return {
            success: true,
            damage: damage,
            isCrit: isCrit,
            targetHp: target.hp,
            targetDied: result.died
        };
    }
    
    // Получение урона
    takeDamage(damage, source) {
        const actualDamage = Math.max(1, Math.floor(damage - this.totalDefense * 0.3));
        this.hp = Math.max(0, this.hp - actualDamage);
        
        if (this.hp <= 0) {
            this.die(source);
        }
        
        return {
            damage: actualDamage,
            died: this.hp <= 0,
            remainingHp: this.hp
        };
    }
    
    // Смерть
    die(killer) {
        console.log(`${this.name} погиб от ${killer ? killer.name : 'неизвестно'}`);
        
        // Потеря опыта (5%)
        const expLoss = Math.floor(this.exp * 0.05);
        this.exp = Math.max(0, this.exp - expLoss);
        
        // Телепорт на респавн
        this.respawn();
        
        // Событие смерти
        if (window.gameEngine) {
            window.gameEngine.events.emit('playerDeath', { player: this, killer: killer });
        }
    }
    
    respawn() {
        // Респавн в центре карты
        this.x = 500;
        this.y = 500;
        this.targetX = this.x;
        this.targetY = this.y;
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.moving = false;
        
        console.log(`${this.name} возродился`);
    }
    
    // Использование навыка
    useSkill(skillName, target) {
        const now = Date.now() / 1000;
        
        if (this.cooldowns.has(skillName)) {
            return { success: false, reason: 'cooldown' };
        }
        
        switch (skillName) {
            case 'whirlwind':
                return this.skillWhirlwind();
            case 'multiShot':
                return this.skillMultiShot(target);
            case 'fireball':
                return this.skillFireball(target);
            default:
                return { success: false, reason: 'unknown_skill' };
        }
    }
    
    skillWhirlwind() {
        if (this.mp < 20) return { success: false, reason: 'no_mana' };
        
        this.mp -= 20;
        this.cooldowns.set('whirlwind', 5);
        
        // Возвращаем радиус и урон для обработки в мире
        return {
            success: true,
            skill: 'whirlwind',
            radius: 80,
            damage: this.totalAttack * 1.5
        };
    }
    
    skillMultiShot(target) {
        if (this.mp < 15) return { success: false, reason: 'no_mana' };
        
        this.mp -= 15;
        this.cooldowns.set('multiShot', 4);
        
        return {
            success: true,
            skill: 'multiShot',
            damage: this.totalAttack * 1.2,
            arrows: 3
        };
    }
    
    skillFireball(target) {
        if (this.mp < 25) return { success: false, reason: 'no_mana' };
        
        this.mp -= 25;
        this.cooldowns.set('fireball', 6);
        
        return {
            success: true,
            skill: 'fireball',
            radius: 60,
            damage: this.totalAttack * 1.8
        };
    }
    
    // Добавление опыта
    addExp(amount) {
        this.exp += amount;
        
        // Проверка повышения уровня
        while (this.exp >= this.expToNext) {
            this.levelUp();
        }
        
        // Обновление UI
        if (window.gameEngine) {
            window.gameEngine.events.emit('expGained', { player: this, amount: amount });
        }
    }
    
    levelUp() {
        this.exp -= this.expToNext;
        this.level++;
        
        // Увеличение характеристик
        this.maxHp += 25;
        this.hp = this.maxHp;
        this.maxMp += 10;
        this.mp = this.maxMp;
        this.baseAttack += 4;
        this.baseDefense += 2;
        
        // Пересчет опыта до следующего уровня
        this.expToNext = Math.floor(100 + (this.level - 1) * 45);
        
        console.log(`LEVEL UP! Теперь ${this.level} уровень!`);
        
        // Событие повышения уровня
        if (window.gameEngine) {
            window.gameEngine.events.emit('playerLevelUp', { player: this, level: this.level });
        }
    }
    
    // Смена класса
    changeClass(newClass) {
        if (!this.classSkills[newClass]) return false;
        
        this.class = newClass;
        
        // Сброс навыков
        this.cooldowns.clear();
        
        console.log(`Класс изменен на ${this.classSkills[newClass].name}`);
        
        return true;
    }
    
    // Движение к точке
    moveTo(x, y) {
        // Проверка, что точка не занята и проходима
        this.targetX = x;
        this.targetY = y;
        this.moving = false; // Сброс для пересчета движения
    }
    
    // Рендер игрока
    render(renderer, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Тень
        renderer.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        renderer.ctx.beginPath();
        renderer.ctx.ellipse(screenX + this.size/2, screenY + this.size - 4, this.size/3, 6, 0, 0, Math.PI*2);
        renderer.ctx.fill();
        
        // Тело
        renderer.ctx.fillStyle = '#3a6ea5';
        renderer.ctx.fillRect(screenX + 4, screenY + 8, this.size - 8, this.size - 8);
        
        // Голова (с анимацией)
        const bobY = Math.sin(this.animationFrame) * 2;
        renderer.ctx.fillStyle = '#f9c87a';
        renderer.ctx.beginPath();
        renderer.ctx.arc(screenX + this.size/2, screenY + this.size/2 - 6 + bobY, 10, 0, Math.PI*2);
        renderer.ctx.fill();
        
        // Глаза
        renderer.ctx.fillStyle = '#000000';
        renderer.ctx.fillRect(screenX + this.size/2 - 6, screenY + this.size/2 - 8 + bobY, 3, 3);
        renderer.ctx.fillRect(screenX + this.size/2 + 3, screenY + this.size/2 - 8 + bobY, 3, 3);
        
        // Экипировка (оружие)
        if (this.equipment.weapon) {
            renderer.ctx.fillStyle = '#ccccaa';
            if (this.direction === 'right') {
                renderer.ctx.fillRect(screenX + this.size - 8, screenY + this.size/2 - 4, 12, 5);
            } else if (this.direction === 'left') {
                renderer.ctx.fillRect(screenX - 4, screenY + this.size/2 - 4, 12, 5);
            } else {
                renderer.ctx.fillRect(screenX + this.size/2 - 6, screenY + this.size - 8, 12, 5);
            }
        }
        
        // Имя игрока
        if (this.settings.showNames) {
            renderer.ctx.font = 'bold 12px monospace';
            renderer.ctx.fillStyle = this.nameColor;
            renderer.ctx.shadowBlur = 2;
            renderer.ctx.shadowColor = '#000000';
            renderer.ctx.fillText(this.name, screenX + this.size/2 - 20, screenY - 5);
            renderer.ctx.shadowBlur = 0;
        }
        
        // HP бар
        const hpPercent = this.hp / this.maxHp;
        renderer.drawHealthBar(screenX + 4, screenY - 10, this.size - 8, 4, this.hp, this.maxHp);
        
        // Эффект движения
        if (this.moving) {
            renderer.ctx.globalAlpha = 0.5;
            renderer.ctx.fillStyle = '#ffffff';
            renderer.ctx.fillRect(screenX + this.size/2 - 2, screenY + this.size - 4, 4, 4);
            renderer.ctx.globalAlpha = 1;
        }
    }
    
    // Сохранение состояния
    serialize() {
        return {
            x: this.x,
            y: this.y,
            level: this.level,
            exp: this.exp,
            hp: this.hp,
            mp: this.mp,
            class: this.class,
            gold: this.gold,
            inventory: this.inventory.serialize(),
            equipment: this.equipment,
            name: this.name
        };
    }
    
    // Загрузка состояния
    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.targetX = data.x;
        this.targetY = data.y;
        this.level = data.level;
        this.exp = data.exp;
        this.hp = data.hp;
        this.mp = data.mp;
        this.class = data.class;
        this.gold = data.gold;
        if (data.inventory) this.inventory.deserialize(data.inventory);
        if (data.equipment) this.equipment = data.equipment;
        this.name = data.name;
        
        // Пересчет опыта до следующего уровня
        this.expToNext = Math.floor(100 + (this.level - 1) * 45);
    }
}

// Класс инвентаря
class Inventory {
    constructor(size) {
        this.size = size;
        this.items = new Array(size).fill(null);
        this.maxStack = 99;
    }
    
    addItem(item) {
        // Проверка на стакаемость
        if (item.stackable) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i] && this.items[i].id === item.id && this.items[i].count < this.maxStack) {
                    const canAdd = Math.min(item.count, this.maxStack - this.items[i].count);
                    this.items[i].count += canAdd;
                    item.count -= canAdd;
                    if (item.count === 0) return true;
                }
            }
        }
        
        // Поиск пустого слота
        const emptySlot = this.items.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.items[emptySlot] = item;
            return true;
        }
        
        return false; // Инвентарь полон
    }
    
    removeItem(slot, count = 1) {
        if (!this.items[slot]) return false;
        
        if (this.items[slot].count > count) {
            this.items[slot].count -= count;
        } else {
            this.items[slot] = null;
        }
        
        return true;
    }
    
    getItem(slot) {
        return this.items[slot];
    }
    
    serialize() {
        return this.items.map(item => item ? { ...item } : null);
    }
    
    deserialize(data) {
        this.items = data.map(item => item ? { ...item } : null);
    }
}

window.Player = Player;
window.Inventory = Inventory;
