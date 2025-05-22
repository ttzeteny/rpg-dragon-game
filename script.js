let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.getElementById("text");
const xpText = document.getElementById("xpText");
const healthText = document.getElementById("healthText");
const goldText = document.getElementById("goldText");
const monsterStats = document.getElementById("monsterStats");
const monsterNameText = document.getElementById("monsterName");
const monsterHealthText = document.getElementById("monsterHealth");

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    },
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to Store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go back to town square"],
        "button functions": [buyHealth, buyWeapon, goTownSquare],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight Slime", "Fight Beast", "Go back to town square"],
        "button functions": [fightSlime, fightBeast, goTownSquare],
        text: "You enter the cave and you see some monsters. Want to fight?"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTownSquare],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTownSquare, goTownSquare, easterEgg],
        text: "The monster is dead! You gain XP and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY", "REPLAY", "REPLAY"],
        "button functions": [restart, restart, restart],
        text: "You die."
    },
    {
        name: "win",
        "button text": ["REPLAY", "REPLAY", "REPLAY"],
        "button functions": [restart, restart, restart],
        text: "You win!"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square"],
        "button functions": [pickTwo, pickEight, goTownSquare],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }

];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

//init buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    text.innerText = location.text;

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
}

function goTownSquare() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else {
        text.innerText = "Not enough gold!";
    }
}

function buyWeapon() {
    if (currentWeapon < 3) {
        if (gold >= 30) {
            gold -= 30;
            goldText.innerText = gold;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = `Better weapon bought! Currently equipped: ${newWeapon}.`;
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "Not enough gold!";
        }
    } else {
        text.innerText = "You can't buy, because you already have all of the weapons! Nice!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift(); //removing the first element and returning it in currentweapon variable
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "You can't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = `The ${monsters[fighting].name} attacks you!`;
    text.innerText += `You attack it back with your ${weapons[currentWeapon].name}.`;
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText += " The monster missed!";
    }
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting == 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += "Your " + inventory.pop() + " broke!";
        currentWeapon--;
    }
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    return hit;
}

function dodge() {
    text.innerText = `You dodge the attack from the ${monsters[fighting].name}!`;
}

function defeatMonster() {
    text.innerText = `You defeated the ${monsters[fighting].name}!`;
    xp += monsters[fighting].level;
    xpText.innerText = xp;
    gold += Math.floor(monsters[fighting].level * 6.7);
    goldText.innerText = gold;
    update(locations[4]);
}

function winGame() {
    update(locations[6]);
}

function lose() {
    update(locations[5]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTownSquare();
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ".";
    text.innerText += " The numbers were:\n"

    for(let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.includes(guess)) {
        text.innerText += " Good guess! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}