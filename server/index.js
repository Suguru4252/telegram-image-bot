/**
 * Rucoy Online Clone - Сервер
 * Версия: 1.0.0
 * Модуль: Game Server
 * Строк: ~1400
 */

const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Конфигурация сервера
const CONFIG = {
    port: 8080,
    maxPlayers: 1000,
    tickRate: 20, // 20 тиков в секунду
    worldWidth: 2000,
    worldHeight: 2000,
    saveInterval: 300000, // 5 минут
    version: '1.0.0'
};

// Класс игрока на сервере
class ServerPlayer {
    constructor(id, ws, name) {
        this.id = id;
        this.ws = ws;
        this.name = name;
        this.x = Math.random() * CONFIG.worldWidth;
        this.y = Math.random() * CONFIG.worldHeight;
        this.direction = 'down';
        this.moving = false;
        
        // Характеристики
        this.level = 1;
        this.exp = 0;
        this.hp = 120;
        this.maxHp = 120;
        this.mp = 60;
        this.maxMp = 60;
        this.attack = 22;
        this.defense = 12;
        this.class = 'knight';
        
        // Экипировка
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            boots: null
        };
        
        // Инвентарь
        this.inventory = [];
        this.gold = 100;
        
        // Статус
        this.alive = true;
        this.lastUpdate = Date.now();
        this.lastAttack = 0;
        this.attackCooldown = 600;
        
        // Группы
        this.guild = null;
        this.party = null;
        
        // IP и время
        this.ip = ws._socket.remoteAddress;
        this.joinTime = Date.now();
    }
    
    takeDamage(damage, source) {
        const actualDamage = Math.max(1, Math.floor(damage - this.defense * 0.3));
        this.hp = Math.max(0, this.hp - actualDamage);
        
        if (this.hp <= 0) {
            this.die(source);
        }
        
        return actualDamage;
    }
    
    die(source) {
        this.alive = false;
        this.hp = 0;
        
        // Потеря опыта
        const expLoss = Math.floor(this.exp * 0.05);
        this.exp = Math.max(0, this.exp - expLoss);
        
        // Телепорт на респавн
        this.x = CONFIG.worldWidth / 2;
        this.y = CONFIG.worldHeight / 2;
        
        // Возрождение через 5 секунд
        setTimeout(() => {
            this.respawn();
        }, 5000);
    }
    
    respawn() {
        this.alive = true;
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        
        // Уведомление клиента
        this.send('respawn', {
            x: this.x,
            y: this.y,
            hp: this.hp,
            mp: this.mp
        });
    }
    
    addExp(amount) {
        this.exp += amount;
        const needExp = 100 + (this.level - 1) * 50;
        
        while (this.exp >= needExp) {
            this.exp -= needExp;
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.maxHp += 25;
        this.hp = this.maxHp;
        this.maxMp += 12;
        this.mp = this.maxMp;
        this.attack += 4;
        this.defense += 2;
        
        this.send('level_up', {
            level: this.level,
            maxHp: this.maxHp,
            maxMp: this.maxMp,
            attack: this.attack,
            defense: this.defense
        });
    }
    
    send(type, payload) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: type,
                payload: payload,
                timestamp: Date.now()
            }));
        }
    }
    
    getData() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            direction: this.direction,
            moving: this.moving,
            level: this.level,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            class: this.class,
            guild: this.guild,
            alive: this.alive
        };
    }
}

// Класс монстра на сервере
class ServerMonster {
    constructor(id, type, x, y) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.hp = this.getMaxHp();
        this.lastAttack = 0;
        this.aggroTarget = null;
        
        // Параметры в зависимости от типа
        const monsterData = this.getMonsterData();
        this.maxHp = monsterData.hp;
        this.attack = monsterData.attack;
        this.defense = monsterData.defense;
        this.exp = monsterData.exp;
        this.speed = monsterData.speed;
        this.aggroRange = monsterData.aggroRange;
        this.attackRange = monsterData.attackRange;
        this.attackCooldown = monsterData.attackCooldown;
        this.name = monsterData.name;
    }
    
    getMonsterData() {
        const monsters = {
            goblin: { name: 'Гоблин', hp: 45, attack: 16, defense: 3, exp: 35, speed: 80, aggroRange: 150, attackRange: 40, attackCooldown: 1000 },
            wolf: { name: 'Волк', hp: 55, attack: 20, defense: 4, exp: 45, speed: 120, aggroRange: 180, attackRange: 35, attackCooldown: 900 },
            skeleton: { name: 'Скелет', hp: 75, attack: 24, defense: 6, exp: 60, speed: 90, aggroRange: 160, attackRange: 40, attackCooldown: 1100 },
            orc: { name: 'Орк', hp: 110, attack: 28, defense: 8, exp: 95, speed: 85, aggroRange: 170, attackRange: 42, attackCooldown: 1200 },
            minotaur: { name: 'Минотавр', hp: 180, attack: 38, defense: 12, exp: 150, speed: 100, aggroRange: 200, attackRange: 45, attackCooldown: 1300 },
            dragon: { name: 'Дракон', hp: 850, attack: 85, defense: 35, exp: 800, speed: 90, aggroRange: 300, attackRange: 60, attackCooldown: 1800 }
        };
        
        return monsters[this.type] || monsters.goblin;
    }
    
    getMaxHp() {
        return this.getMonsterData().hp;
    }
    
    takeDamage(damage, source) {
        const actualDamage = Math.max(1, Math.floor(damage - this.defense * 0.5));
        this.hp -= actualDamage;
        
        if (this.hp <= 0) {
            this.die(source);
        }
        
        return actualDamage;
    }
    
    die(source) {
        this.alive = false;
        
        // Начисление опыта и золота
        if (source instanceof ServerPlayer) {
            source.addExp(this.exp);
            source.gold += Math.floor(20 + Math.random() * 30);
        }
    }
    
    respawn() {
        this.alive = true;
        this.hp = this.maxHp;
        this.aggroTarget = null;
        
        // Случайная позиция в радиусе
        this.x += (Math.random() - 0.5) * 200;
        this.y += (Math.random() - 0.5) * 200;
        this.x = Math.max(50, Math.min(CONFIG.worldWidth - 50, this.x));
        this.y = Math.max(50, Math.min(CONFIG.worldHeight - 50, this.y));
    }
    
    getData() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            x: this.x,
            y: this.y,
            hp: this.hp,
            maxHp: this.maxHp,
            alive: this.alive
        };
    }
}

// Основной сервер
class GameServer {
    constructor() {
        this.players = new Map();
        this.monsters = [];
        this.nextPlayerId = 1;
        this.nextMonsterId = 1;
        this.wss = null;
        this.server = null;
        this.gameLoop = null;
        this.saveInterval = null;
        
        this.init();
    }
    
    init() {
        // Создание HTTP сервера
        this.server = http.createServer((req, res) => {
            if (req.url === '/status') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(this.getStatus()));
            } else {
                res.writeHead(404);
                res.end();
            }
        });
        
        // Создание WebSocket сервера
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.wss.on('connection', (ws) => this.onConnection(ws));
        
        // Генерация монстров
        this.generateMonsters();
        
        // Запуск сервера
        this.server.listen(CONFIG.port, () => {
            console.log(`Сервер запущен на порту ${CONFIG.port}`);
            console.log(`Версия: ${CONFIG.version}`);
            console.log(`Максимум игроков: ${CONFIG.maxPlayers}`);
        });
        
        // Запуск игрового цикла
        this.startGameLoop();
        
        // Автосохранение
        this.saveInterval = setInterval(() => this.saveData(), CONFIG.saveInterval);
    }
    
    generateMonsters() {
        const monsterTypes = ['goblin', 'wolf', 'skeleton', 'orc', 'minotaur'];
        
        for (let i = 0; i < 150; i++) {
            const type = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
            const x = 100 + Math.random() * (CONFIG.worldWidth - 200);
            const y = 100 + Math.random() * (CONFIG.worldHeight - 200);
            
            const monster = new ServerMonster(this.nextMonsterId++, type, x, y);
            this.monsters.push(monster);
        }
        
        // Боссы
        const dragon = new ServerMonster(this.nextMonsterId++, 'dragon', CONFIG.worldWidth / 2, CONFIG.worldHeight / 2);
        this.monsters.push(dragon);
        
        console.log(`Сгенерировано ${this.monsters.length} монстров`);
    }
    
    onConnection(ws) {
        // Проверка лимита игроков
        if (this.players.size >= CONFIG.maxPlayers) {
            ws.close(1000, 'Сервер переполнен');
            return;
        }
        
        // Создание игрока
        const playerId = this.nextPlayerId++;
        const playerName = `Игрок${playerId}`;
        const player = new ServerPlayer(playerId, ws, playerName);
        
        this.players.set(playerId, player);
        
        console.log(`Игрок ${player.name} (${playerId}) подключился. Всего: ${this.players.size}`);
        
        // Отправка начальных данных
        player.send('connected', {
            playerId: playerId,
            serverName: 'Rucoy Online Server',
            playersOnline: this.players.size,
            version: CONFIG.version
        });
        
        // Отправка данных мира
        player.send('world_data', {
            width: CONFIG.worldWidth,
            height: CONFIG.worldHeight,
            spawnX: player.x,
            spawnY: player.y
        });
        
        // Отправка списка монстров
        player.send('monsters', {
            monsters: this.monsters.filter(m => m.alive).map(m => m.getData())
        });
        
        // Отправка списка других игроков
        const otherPlayers = Array.from(this.players.values())
            .filter(p => p.id !== playerId)
            .map(p => p.getData());
        
        player.send('players', { players: otherPlayers });
        
        // Уведомление всех о новом игроке
        this.broadcast('player_join', player.getData(), playerId);
        
        // Обработчики сообщений
        ws.on('message', (data) => this.onMessage(player, data));
        ws.on('close', () => this.onDisconnect(player));
        ws.on('error', (error) => console.error(`Ошибка игрока ${player.name}:`, error));
    }
    
    onMessage(player, data) {
        try {
            const message = JSON.parse(data);
            const handler = this.messageHandlers[message.type];
            
            if (handler) {
                handler.call(this, player, message.payload);
            } else {
                console.warn(`Неизвестный тип сообщения от ${player.name}: ${message.type}`);
            }
        } catch (error) {
            console.error(`Ошибка обработки сообщения от ${player.name}:`, error);
        }
    }
    
    messageHandlers = {
        handshake: (player, payload) => {
            console.log(`Рукопожатие от ${player.name}, версия: ${payload.version}`);
        },
        
        move: (player, payload) => {
            player.x = payload.x;
            player.y = payload.y;
            player.direction = payload.direction;
            player.moving = payload.moving;
            player.lastUpdate = Date.now();
            
            // Broadcast другим игрокам
            this.broadcast('player_move', {
                id: player.id,
                x: player.x,
                y: player.y,
                direction: player.direction,
                moving: player.moving
            }, player.id);
        },
        
        attack: (player, payload) => {
            const now = Date.now();
            if (now - player.lastAttack < player.attackCooldown) return;
            
            player.lastAttack = now;
            
            // Поиск цели
            let target = null;
            
            // Поиск среди монстров
            for (const monster of this.monsters) {
                if (!monster.alive) continue;
                const dx = monster.x - player.x;
                const dy = monster.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 60 && monster.id === payload.targetId) {
                    target = monster;
                    break;
                }
            }
            
            // Поиск среди игроков (PvP)
            if (!target && payload.targetId) {
                target = this.players.get(payload.targetId);
            }
            
            if (target) {
                const damage = Math.max(5, player.attack - (target.defense || 3) + Math.random() * 15);
                const actualDamage = target.takeDamage(Math.floor(damage), player);
                
                // Уведомление о атаке
                this.broadcast('player_attack', {
                    id: player.id,
                    targetId: target.id,
                    damage: actualDamage
                });
                
                // Если цель умерла
                if (target.hp <= 0) {
                    if (target instanceof ServerMonster) {
                        this.broadcast('monster_die', {
                            id: target.id,
                            killerId: player.id,
                            exp: target.exp,
                            gold: Math.floor(20 + Math.random() * 30)
                        });
                        
                        // Респавн монстра через 30 секунд
                        setTimeout(() => {
                            target.respawn();
                            this.broadcast('monster_spawn', target.getData());
                        }, 30000);
                    } else if (target instanceof ServerPlayer) {
                        this.broadcast('player_death', {
                            id: target.id,
                            name: target.name,
                            killerName: player.name
                        });
                    }
                }
            }
        },
        
        skill: (player, payload) => {
            // Обработка навыков
            this.broadcast('player_skill', {
                id: player.id,
                skill: payload.skillId,
                targets: payload.targets
            });
        },
        
        chat: (player, payload) => {
            this.broadcast('chat_message', {
                id: player.id,
                name: player.name,
                message: payload.message.substring(0, 200)
            });
        },
        
        ping: (player, payload) => {
            player.send('pong', { time: payload.time });
        }
    };
    
    onDisconnect(player) {
        this.players.delete(player.id);
        console.log(`Игрок ${player.name} отключился. Осталось: ${this.players.size}`);
        
        this.broadcast('player_leave', {
            id: player.id,
            name: player.name
        });
    }
    
    broadcast(type, payload, excludeId = null) {
        const message = JSON.stringify({ type: type, payload: payload, timestamp: Date.now() });
        
        for (const player of this.players.values()) {
            if (player.id !== excludeId && player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(message);
            }
        }
    }
    
    startGameLoop() {
        const tickInterval = 1000 / CONFIG.tickRate;
        let lastTick = Date.now();
        
        this.gameLoop = setInterval(() => {
            const now = Date.now();
            const deltaTime = Math.min(0.05, (now - lastTick) / 1000);
            lastTick = now;
            
            this.update(deltaTime);
        }, tickInterval);
    }
    
    update(deltaTime) {
        // Обновление AI монстров
        for (const monster of this.monsters) {
            if (!monster.alive) continue;
            
            // Поиск ближайшего игрока
            let closestPlayer = null;
            let closestDist = monster.aggroRange;
            
            for (const player of this.players.values()) {
                if (!player.alive) continue;
                
                const dx = player.x - monster.x;
                const dy = player.y - monster.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < closestDist) {
                    closestDist = dist;
                    closestPlayer = player;
                }
            }
            
            if (closestPlayer) {
                monster.aggroTarget = closestPlayer;
                
                // Движение к игроку
                if (closestDist > monster.attackRange) {
                    const angle = Math.atan2(closestPlayer.y - monster.y, closestPlayer.x - monster.x);
                    const moveSpeed = monster.speed * deltaTime;
                    monster.x += Math.cos(angle) * moveSpeed;
                    monster.y += Math.sin(angle) * moveSpeed;
                } 
                // Атака
                else if (closestDist <= monster.attackRange) {
                    const now = Date.now();
                    if (now - monster.lastAttack >= monster.attackCooldown) {
                        monster.lastAttack = now;
                        
                        const damage = Math.max(5, monster.attack - closestPlayer.defense + Math.random() * 12);
                        const actualDamage = closestPlayer.takeDamage(Math.floor(damage), monster);
                        
                        // Уведомление
                        closestPlayer.send('player_damage', {
                            damage: actualDamage,
                            newHp: closestPlayer.hp,
                            source: monster.name
                        });
                        
                        this.broadcast('monster_attack', {
                            id: monster.id,
                            targetId: closestPlayer.id,
                            damage: actualDamage
                        }, closestPlayer.id);
                    }
                }
            }
        }
        
        // Обновление позиций для всех игроков (синхронизация)
        if (this.players.size > 0) {
            const playersData = Array.from(this.players.values()).map(p => ({
                id: p.id,
                x: p.x,
                y: p.y,
                direction: p.direction,
                moving: p.moving,
                hp: p.hp,
                maxHp: p.maxHp
            }));
            
            this.broadcast('sync_players', { players: playersData });
        }
    }
    
    saveData() {
        const saveData = {
            timestamp: Date.now(),
            players: Array.from(this.players.values()).map(p => ({
                id: p.id,
                name: p.name,
                level: p.level,
                exp: p.exp,
                gold: p.gold,
                x: p.x,
                y: p.y,
                inventory: p.inventory,
                equipment: p.equipment
            })),
            monsters: this.monsters.map(m => ({
                id: m.id,
                type: m.type,
                x: m.x,
                y: m.y,
                alive: m.alive
            }))
        };
        
        const savePath = path.join(__dirname, 'saves', `save_${Date.now()}.json`);
        const saveDir = path.dirname(savePath);
        
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }
        
        fs.writeFile(savePath, JSON.stringify(saveData, null, 2), (err) => {
            if (err) {
                console.error('Ошибка сохранения:', err);
            } else {
                console.log(`Сохранено: ${savePath}`);
            }
        });
    }
    
    getStatus() {
        return {
            status: 'running',
            version: CONFIG.version,
            players: this.players.size,
            maxPlayers: CONFIG.maxPlayers,
            monsters: this.monsters.filter(m => m.alive).length,
            uptime: process.uptime(),
            timestamp: Date.now()
        };
    }
    
    shutdown() {
        console.log('Остановка сервера...');
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.saveInterval) clearInterval(this.saveInterval);
        
        this.saveData();
        
        // Закрытие всех соединений
        for (const player of this.players.values()) {
            player.send('shutdown', { message: 'Сервер останавливается' });
            player.ws.close();
        }
        
        this.wss.close();
        this.server.close();
        
        console.log('Сервер остановлен');
    }
}

// Обработка завершения
process.on('SIGINT', () => {
    console.log('\nПолучен SIGINT');
    if (global.gameServer) {
        global.gameServer.shutdown();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nПолучен SIGTERM');
    if (global.gameServer) {
        global.gameServer.shutdown();
    }
    process.exit(0);
});

// Запуск
global.gameServer = new GameServer();

// Экспорт для тестирования
module.exports = GameServer;
