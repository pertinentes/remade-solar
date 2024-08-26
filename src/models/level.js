const fs = require('fs').promises;

function calculateRequiredXP(level) {
    return Math.floor(1000 * Math.pow(1.2, level - 1));
}

async function getLevelInfo(guildId, userId) {
    const filePath = `./src/level/${guildId}.json`;
    let data;
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        data = JSON.parse(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            data = { users: {} };
        } else if (error instanceof SyntaxError) {
            console.error('Error parsing JSON:', error);
            data = { users: {} };
        } else {
            throw error;
        }
    }

    if (!data.users[userId]) {
        data.users[userId] = { xp: 0, level: 1 };
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    const userXP = data.users[userId].xp;
    const userLevel = data.users[userId].level;
    const rank = Object.values(data.users).sort((a, b) => b.xp - a.xp).findIndex(user => user.xp === userXP) + 1;
    const requiredXP = calculateRequiredXP(userLevel);

    return { xp: userXP, level: userLevel, rank, requiredXP };
}

async function updateXP(guildId, userId) {
    const filePath = `./src/level/${guildId}.json`;
    let data;
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        data = JSON.parse(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            data = { users: {} };
        } else if (error instanceof SyntaxError) {
            console.error('Error parsing JSON:', error);
            data = { users: {} };
        } else {
            throw error;
        }
    }

    if (!data.users[userId]) {
        data.users[userId] = { xp: 0, level: 1 };
    }

    const oldLevel = data.users[userId].level;
    data.users[userId].xp += Math.floor(Math.random() * 10) + 15;

    let levelUp = false;
    const requiredXP = calculateRequiredXP(data.users[userId].level);
    if (data.users[userId].xp >= requiredXP) {
        data.users[userId].level++;
        data.users[userId].xp -= requiredXP;
        levelUp = true;
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return { newLevel: data.users[userId].level, levelUp };
}

module.exports = { getLevelInfo, updateXP };