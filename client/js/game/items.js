/**
 * Rucoy Online Clone - Система предметов
 * Версия: 1.0.0
 * Модуль: Items Database & Equipment System
 * Строк: ~1800
 */

// База данных всех предметов
const ITEMS_DB = {
    // ========== ОРУЖИЕ ==========
    // Деревянное оружие (уровень 1)
    wooden_sword: {
        id: 'wooden_sword',
        name: 'Деревянный Меч',
        type: 'weapon',
        subtype: 'sword',
        level: 1,
        damage: 8,
        attackSpeed: 1.0,
        price: 50,
        rarity: 'common',
        description: 'Простой деревянный меч для начинающих',
        icon: '⚔️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    wooden_bow: {
        id: 'wooden_bow',
        name: 'Деревянный Лук',
        type: 'weapon',
        subtype: 'bow',
        level: 1,
        damage: 6,
        attackSpeed: 1.2,
        range: 150,
        price: 45,
        rarity: 'common',
        description: 'Простой лук для охоты',
        icon: '🏹',
        sellable: true,
        tradeable: true,
        classes: ['archer']
    },
    
    wooden_staff: {
        id: 'wooden_staff',
        name: 'Деревянный Посох',
        type: 'weapon',
        subtype: 'staff',
        level: 1,
        damage: 7,
        attackSpeed: 1.1,
        manaCost: 0,
        price: 55,
        rarity: 'common',
        description: 'Посох начинающего мага',
        icon: '🔮',
        sellable: true,
        tradeable: true,
        classes: ['mage']
    },
    
    // Железное оружие (уровень 5)
    iron_sword: {
        id: 'iron_sword',
        name: 'Железный Меч',
        type: 'weapon',
        subtype: 'sword',
        level: 5,
        damage: 15,
        attackSpeed: 1.0,
        price: 200,
        rarity: 'common',
        description: 'Надежный железный меч',
        icon: '⚔️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    iron_bow: {
        id: 'iron_bow',
        name: 'Железный Лук',
        type: 'weapon',
        subtype: 'bow',
        level: 5,
        damage: 12,
        attackSpeed: 1.2,
        range: 160,
        price: 180,
        rarity: 'common',
        description: 'Усиленный железом лук',
        icon: '🏹',
        sellable: true,
        tradeable: true,
        classes: ['archer']
    },
    
    iron_staff: {
        id: 'iron_staff',
        name: 'Железный Посох',
        type: 'weapon',
        subtype: 'staff',
        level: 5,
        damage: 14,
        attackSpeed: 1.1,
        manaRegen: 2,
        price: 220,
        rarity: 'common',
        description: 'Посох с железным наконечником',
        icon: '🔮',
        sellable: true,
        tradeable: true,
        classes: ['mage']
    },
    
    // Стальное оружие (уровень 10)
    steel_sword: {
        id: 'steel_sword',
        name: 'Стальной Меч',
        type: 'weapon',
        subtype: 'sword',
        level: 10,
        damage: 24,
        attackSpeed: 1.0,
        critChance: 0.05,
        price: 500,
        rarity: 'uncommon',
        description: 'Прочный стальной меч',
        icon: '⚔️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    // Мифриловое оружие (уровень 20)
    mithril_sword: {
        id: 'mithril_sword',
        name: 'Мифриловый Меч',
        type: 'weapon',
        subtype: 'sword',
        level: 20,
        damage: 38,
        attackSpeed: 0.9,
        critChance: 0.08,
        critDamage: 1.6,
        price: 1500,
        rarity: 'rare',
        description: 'Легкий и острый мифриловый клинок',
        icon: '⚔️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    // Эльфийский лук (уровень 20)
    elven_bow: {
        id: 'elven_bow',
        name: 'Эльфийский Лук',
        type: 'weapon',
        subtype: 'bow',
        level: 20,
        damage: 32,
        attackSpeed: 1.1,
        range: 180,
        critChance: 0.1,
        price: 1600,
        rarity: 'rare',
        description: 'Легендарный лук эльфийских мастеров',
        icon: '🏹',
        sellable: true,
        tradeable: true,
        classes: ['archer']
    },
    
    // Посох архимага (уровень 25)
    archmage_staff: {
        id: 'archmage_staff',
        name: 'Посох Архимага',
        type: 'weapon',
        subtype: 'staff',
        level: 25,
        damage: 42,
        attackSpeed: 1.0,
        manaRegen: 5,
        manaMax: 50,
        price: 2500,
        rarity: 'epic',
        description: 'Мощный посох, усиливающий магию',
        icon: '🔮',
        sellable: true,
        tradeable: true,
        classes: ['mage']
    },
    
    // Драконье оружие (уровень 30)
    dragon_sword: {
        id: 'dragon_sword',
        name: 'Драконий Меч',
        type: 'weapon',
        subtype: 'sword',
        level: 30,
        damage: 55,
        attackSpeed: 0.85,
        critChance: 0.12,
        critDamage: 1.8,
        fireDamage: 10,
        price: 5000,
        rarity: 'epic',
        description: 'Меч, выкованный из драконьей чешуи',
        icon: '⚔️',
        sellable: true,
        tradeable: false,
        classes: ['knight']
    },
    
    // ========== БРОНЯ ==========
    leather_armor: {
        id: 'leather_armor',
        name: 'Кожаная Броня',
        type: 'armor',
        subtype: 'light',
        level: 1,
        defense: 5,
        health: 15,
        price: 40,
        rarity: 'common',
        description: 'Легкая кожаная броня',
        icon: '🛡️',
        sellable: true,
        tradeable: true,
        classes: ['knight', 'archer']
    },
    
    iron_armor: {
        id: 'iron_armor',
        name: 'Железная Броня',
        type: 'armor',
        subtype: 'heavy',
        level: 5,
        defense: 12,
        health: 30,
        price: 180,
        rarity: 'common',
        description: 'Прочная железная броня',
        icon: '🛡️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    steel_armor: {
        id: 'steel_armor',
        name: 'Стальная Броня',
        type: 'armor',
        subtype: 'heavy',
        level: 10,
        defense: 20,
        health: 50,
        strength: 2,
        price: 450,
        rarity: 'uncommon',
        description: 'Качественная стальная броня',
        icon: '🛡️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    mithril_armor: {
        id: 'mithril_armor',
        name: 'Мифриловая Броня',
        type: 'armor',
        subtype: 'light',
        level: 20,
        defense: 28,
        health: 70,
        agility: 3,
        price: 1400,
        rarity: 'rare',
        description: 'Легкая и прочная мифриловая броня',
        icon: '🛡️',
        sellable: true,
        tradeable: true,
        classes: ['knight', 'archer']
    },
    
    dragon_armor: {
        id: 'dragon_armor',
        name: 'Драконья Броня',
        type: 'armor',
        subtype: 'heavy',
        level: 30,
        defense: 42,
        health: 120,
        strength: 5,
        fireResist: 30,
        price: 4500,
        rarity: 'epic',
        description: 'Броня из драконьей чешуи',
        icon: '🛡️',
        sellable: true,
        tradeable: false,
        classes: ['knight']
    },
    
    // ========== ШЛЕМЫ ==========
    leather_helmet: {
        id: 'leather_helmet',
        name: 'Кожаный Шлем',
        type: 'helmet',
        level: 1,
        defense: 3,
        price: 25,
        rarity: 'common',
        description: 'Простой кожаный шлем',
        icon: '⛑️',
        sellable: true,
        tradeable: true,
        classes: ['knight', 'archer']
    },
    
    iron_helmet: {
        id: 'iron_helmet',
        name: 'Железный Шлем',
        type: 'helmet',
        level: 5,
        defense: 8,
        health: 20,
        price: 120,
        rarity: 'common',
        description: 'Надежный железный шлем',
        icon: '⛑️',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    // ========== БОТИНКИ ==========
    leather_boots: {
        id: 'leather_boots',
        name: 'Кожаные Сапоги',
        type: 'boots',
        level: 1,
        defense: 2,
        speed: 5,
        price: 20,
        rarity: 'common',
        description: 'Легкие кожаные сапоги',
        icon: '👢',
        sellable: true,
        tradeable: true,
        classes: ['knight', 'archer', 'mage']
    },
    
    iron_boots: {
        id: 'iron_boots',
        name: 'Железные Сапоги',
        type: 'boots',
        level: 5,
        defense: 6,
        speed: 3,
        price: 100,
        rarity: 'common',
        description: 'Тяжелые железные сапоги',
        icon: '👢',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    // ========== КОЛЬЦА ==========
    ring_of_strength: {
        id: 'ring_of_strength',
        name: 'Кольцо Силы',
        type: 'ring',
        level: 10,
        strength: 3,
        damage: 5,
        price: 300,
        rarity: 'uncommon',
        description: 'Кольцо, дарующее силу',
        icon: '💍',
        sellable: true,
        tradeable: true,
        classes: ['knight']
    },
    
    ring_of_agility: {
        id: 'ring_of_agility',
        name: 'Кольцо Ловкости',
        type: 'ring',
        level: 10,
        agility: 3,
        critChance: 0.05,
        price: 320,
        rarity: 'uncommon',
        description: 'Кольцо, увеличивающее ловкость',
        icon: '💍',
        sellable: true,
        tradeable: true,
        classes: ['archer']
    },
    
    ring_of_intellect: {
        id: 'ring_of_intellect',
        name: 'Кольцо Интеллекта',
        type: 'ring',
        level: 10,
        intellect: 3,
        manaRegen: 3,
        price: 280,
        rarity: 'uncommon',
        description: 'Кольцо, усиливающее магию',
        icon: '💍',
        sellable: true,
        tradeable: true,
        classes: ['mage']
    },
    
    // ========== ЗЕЛЬЯ ==========
    small_health_potion: {
        id: 'small_health_potion',
        name: 'Малая Целебная Настойка',
        type: 'consumable',
        subtype: 'health',
        level: 1,
        heal: 50,
        price: 10,
        rarity: 'common',
        description: 'Восстанавливает 50 HP',
        icon: '🧪',
        stackable: true,
        maxStack: 99,
        sellable: true,
        tradeable: true,
        useEffect: (player) => {
            player.hp = Math.min(player.maxHp, player.hp + 50);
        }
    },
    
    medium_health_potion: {
        id: 'medium_health_potion',
        name: 'Средняя Целебная Настойка',
        type: 'consumable',
        subtype: 'health',
        level: 10,
        heal: 150,
        price: 35,
        rarity: 'uncommon',
        description: 'Восстанавливает 150 HP',
        icon: '🧪',
        stackable: true,
        maxStack: 99,
        sellable: true,
        tradeable: true,
        useEffect: (player) => {
            player.hp = Math.min(player.maxHp, player.hp + 150);
        }
    },
    
    large_health_potion: {
        id: 'large_health_potion',
        name: 'Большая Целебная Настойка',
        type: 'consumable',
        subtype: 'health',
        level: 20,
        heal: 350,
        price: 100,
        rarity: 'rare',
        description: 'Восстанавливает 350 HP',
        icon: '🧪',
        stackable: true,
        maxStack: 99,
        sellable: true,
        tradeable: true,
        useEffect: (player) => {
            player.hp = Math.min(player.maxHp, player.hp + 350);
        }
    },
    
    mana_potion: {
        id: 'mana_potion',
        name: 'Настойка Маны',
        type: 'consumable',
        subtype: 'mana',
        level: 5,
        mana: 80,
        price: 25,
        rarity: 'common',
        description: 'Восстанавливает 80 MP',
        icon: '🧪',
        stackable: true,
        maxStack: 99,
        sellable: true,
        tradeable: true,
        useEffect: (player) => {
            player.mp = Math.min(player.maxMp, player.mp + 80);
        }
    },
    
    // ========== РЕСУРСЫ ДЛЯ КРАФТА ==========
    cloth: {
        id: 'cloth',
        name: 'Ткань',
        type: 'material',
        rarity: 'common',
        price: 5,
        description: 'Обычная ткань для крафта',
        icon: '🧵',
        stackable: true,
        maxStack: 999,
        sellable: true,
        tradeable: true
    },
    
    leather: {
        id: 'leather',
        name: 'Кожа',
        type: 'material',
        rarity: 'common',
        price: 8,
        description: 'Выделанная кожа',
        icon: '📜',
        stackable: true,
        maxStack: 999,
        sellable: true,
        tradeable: true
    },
    
    iron_ore: {
        id: 'iron_ore',
        name: 'Железная Руда',
        type: 'material',
        rarity: 'common',
        price: 15,
        description: 'Руда для выплавки железа',
        icon: '⛏️',
        stackable: true,
        maxStack: 999,
        sellable: true,
        tradeable: true
    },
    
    steel_bar: {
        id: 'steel_bar',
        name: 'Стальной Слиток',
        type: 'material',
        rarity: 'uncommon',
        price: 50,
        description: 'Качественная сталь',
        icon: '🔩',
        stackable: true,
        maxStack: 999,
        sellable: true,
        tradeable: true
    },
    
    dragon_scale: {
        id: 'dragon_scale',
        name: 'Драконья Чешуя',
        type: 'material',
        rarity: 'epic',
        price: 500,
        description: 'Чешуя дракона, очень прочный материал',
        icon: '🐉',
        stackable: true,
        maxStack: 99,
        sellable: true,
        tradeable: true
    },
    
    // ========== РЕДКИЕ ПРЕДМЕТЫ ==========
    golden_ring: {
        id: 'golden_ring',
        name: 'Золотое Кольцо',
        type: 'accessory',
        rarity: 'rare',
        price: 200,
        description: 'Красивое золотое кольцо',
        icon: '💍',
        stackable: false,
        sellable: true,
        tradeable: true
    },
    
    ancient_scroll: {
        id: 'ancient_scroll',
        name: 'Древний Свиток',
        type: 'quest_item',
        rarity: 'epic',
        price: 0,
        description: 'Старинный свиток с тайными знаниями',
        icon: '📜',
        stackable: false,
        sellable: false,
        tradeable: false
    }
};

// Класс предмета
class Item {
    constructor(itemId, count = 1) {
        const data = ITEMS_DB[itemId];
        if (!data) throw new Error(`Unknown item: ${itemId}`);
        
        this.id = itemId;
        this.name = data.name;
        this.type = data.type;
        this.subtype = data.subtype;
        this.level = data.level;
        this.rarity = data.rarity;
        this.description = data.description;
        this.icon = data.icon;
        this.stackable = data.stackable || false;
        this.count = Math.min(count, data.maxStack || 1);
        this.maxStack = data.maxStack || 1;
        this.sellable = data.sellable !== false;
        this.tradeable = data.tradeable !== false;
        this.price = data.price || 0;
        
        // Дополнительные атрибуты в зависимости от типа
        if (data.type === 'weapon') {
            this.damage = data.damage;
            this.attackSpeed = data.attackSpeed;
            this.range = data.range || 40;
            this.critChance = data.critChance || 0;
            this.critDamage = data.critDamage || 1.5;
            this.classes = data.classes || [];
        } else if (data.type === 'armor' || data.type === 'helmet' || data.type === 'boots') {
            this.defense = data.defense;
            this.health = data.health || 0;
            this.strength = data.strength || 0;
            this.agility = data.agility || 0;
            this.intellect = data.intellect || 0;
        } else if (data.type === 'consumable') {
            this.heal = data.heal;
            this.mana = data.mana;
            this.useEffect = data.useEffect;
        }
        
        // Дополнительные эффекты
        this.fireDamage = data.fireDamage || 0;
        this.fireResist = data.fireResist || 0;
        this.manaRegen = data.manaRegen || 0;
        this.manaMax = data.manaMax || 0;
        this.speed = data.speed || 0;
    }
    
    use(user) {
        if (this.type !== 'consumable') return { success: false, reason: 'not_consumable' };
        
        if (this.heal) {
            const oldHp = user.hp;
            user.hp = Math.min(user.maxHp, user.hp + this.heal);
            const healed = user.hp - oldHp;
            
            return {
                success: true,
                effect: 'heal',
                amount: healed,
                message: `Вы восстановили ${healed} HP`
            };
        }
        
        if (this.mana) {
            const oldMp = user.mp;
            user.mp = Math.min(user.maxMp, user.mp + this.mana);
            const restored = user.mp - oldMp;
            
            return {
                success: true,
                effect: 'mana',
                amount: restored,
                message: `Вы восстановили ${restored} MP`
            };
        }
        
        if (this.useEffect) {
            this.useEffect(user);
            return { success: true, message: `Вы использовали ${this.name}` };
        }
        
        return { success: false, reason: 'no_effect' };
    }
    
    getValue() {
        return this.price * this.count;
    }
    
    getTooltip() {
        let tooltip = `${this.name}\n`;
        tooltip += `${this.description}\n`;
        tooltip += `Редкость: ${this.getRarityText()}\n`;
        tooltip += `Уровень: ${this.level}\n`;
        
        if (this.damage) tooltip += `Урон: ${this.damage}\n`;
        if (this.defense) tooltip += `Защита: ${this.defense}\n`;
        if (this.heal) tooltip += `Лечение: ${this.heal}\n`;
        if (this.mana) tooltip += `Мана: ${this.mana}\n`;
        
        tooltip += `Цена: ${this.price} золота`;
        
        if (!this.sellable) tooltip += `\n(Не продается)`;
        if (!this.tradeable) tooltip += `\n(Не передается)`;
        
        return tooltip;
    }
    
    getRarityText() {
        const rarities = {
            'common': 'Обычный',
            'uncommon': 'Необычный',
            'rare': 'Редкий',
            'epic': 'Эпический',
            'legendary': 'Легендарный'
        };
        return rarities[this.rarity] || this.rarity;
    }
    
    getRarityColor() {
        const colors = {
            'common': '#ffffff',
            'uncommon': '#44ff44',
            'rare': '#4488ff',
            'epic': '#aa44ff',
            'legendary': '#ffaa44'
        };
        return colors[this.rarity] || '#ffffff';
    }
}

// Торговец
class Merchant {
    constructor(name, items) {
        this.name = name;
        this.items = items.map(itemId => new Item(itemId));
        this.buyMultiplier = 0.5; // Покупает за 50% цены
    }
    
    getBuyPrice(item) {
        return Math.floor(item.price * this.buyMultiplier);
    }
    
    getSellPrice(item) {
        return item.price;
    }
    
    buyFromPlayer(player, slotIndex, count = 1) {
        const item = player.inventory.getItem(slotIndex);
        if (!item) return { success: false, reason: 'no_item' };
        
        const totalPrice = this.getBuyPrice(item) * count;
        player.gold += totalPrice;
        player.inventory.removeItem(slotIndex, count);
        
        return {
            success: true,
            gold: totalPrice,
            item: item.name,
            count: count
        };
    }
    
    sellToPlayer(player, itemId, count = 1) {
        const itemTemplate = ITEMS_DB[itemId];
        if (!itemTemplate) return { success: false, reason: 'no_item' };
        
        const price = this.getSellPrice(new Item(itemId)) * count;
        
        if (player.gold < price) {
            return { success: false, reason: 'not_enough_gold' };
        }
        
        const item = new Item(itemId, count);
        if (!player.inventory.addItem(item)) {
            return { success: false, reason: 'inventory_full' };
        }
        
        player.gold -= price;
        
        return {
            success: true,
            gold: price,
            item: item.name,
            count: count
        };
    }
}

// Крафтинг
class Crafting {
    constructor() {
        this.recipes = {
            iron_sword: {
                name: 'Железный Меч',
                result: 'iron_sword',
                level: 5,
                materials: [
                    { item: 'iron_ore', count: 5 },
                    { item: 'cloth', count: 2 }
                ],
                skill: 'smithing',
                exp: 50
            },
            
            steel_bar: {
                name: 'Стальной Слиток',
                result: 'steel_bar',
                level: 10,
                materials: [
                    { item: 'iron_ore', count: 3 },
                    { item: 'coal', count: 2 }
                ],
                skill: 'smithing',
                exp: 30
            },
            
            steel_sword: {
                name: 'Стальной Меч',
                result: 'steel_sword',
                level: 15,
                materials: [
                    { item: 'steel_bar', count: 4 },
                    { item: 'leather', count: 2 }
                ],
                skill: 'smithing',
                exp: 100
            },
            
            leather_armor: {
                name: 'Кожаная Броня',
                result: 'leather_armor',
                level: 3,
                materials: [
                    { item: 'leather', count: 5 },
                    { item: 'cloth', count: 3 }
                ],
                skill: 'leatherworking',
                exp: 40
            },
            
            small_health_potion: {
                name: 'Малая Целебная Настойка',
                result: 'small_health_potion',
                level: 2,
                materials: [
                    { item: 'herb', count: 2 },
                    { item: 'water', count: 1 }
                ],
                skill: 'alchemy',
                exp: 20
            }
        };
    }
    
    canCraft(player, recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) return { success: false, reason: 'unknown_recipe' };
        
        if (player.level < recipe.level) {
            return { success: false, reason: 'level_too_low', required: recipe.level };
        }
        
        // Проверка материалов
        for (const material of recipe.materials) {
            const hasMaterial = player.inventory.hasItem(material.item, material.count);
            if (!hasMaterial) {
                return { 
                    success: false, 
                    reason: 'missing_material', 
                    material: material.item,
                    required: material.count 
                };
            }
        }
        
        return { success: true };
    }
    
    craft(player, recipeId) {
        const check = this.canCraft(player, recipeId);
        if (!check.success) return check;
        
        const recipe = this.recipes[recipeId];
        
        // Удаление материалов
        for (const material of recipe.materials) {
            player.inventory.removeItemByType(material.item, material.count);
        }
        
        // Создание предмета
        const result = new Item(recipe.result);
        player.inventory.addItem(result);
        
        // Опыт крафта
        player.craftingExp = (player.craftingExp || 0) + recipe.exp;
        
        return {
            success: true,
            item: result.name,
            exp: recipe.exp
        };
    }
}

window.ITEMS_DB = ITEMS_DB;
window.Item = Item;
window.Merchant = Merchant;
window.Crafting = Crafting;
