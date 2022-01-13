const path = require('path');
const fs = require('fs');
const { Buffer } = require('buffer');
const logPath = path.join(process.cwd(), 'log');

// Si no existe crear el directorio
if (!fs.existsSync(logPath))
    fs.mkdirSync(logPath);

/**
 * Escribir logs
 * 
 * @param {String} content
 * @param {string | null} category
 * @param {string | null} level 
 */
const writeLog = (content, category, level) => {
    const actualDate = new Date();
    const formatDate = `${actualDate.getFullYear()}-${(actualDate.getMonth() + 1).toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`;
    const logFilePath = path.join(logPath, `${formatDate}${category ? '-' + category.toUpperCase() : ''}.log`);
    const contentLog = `[${actualDate.toLocaleTimeString()}] [${level ? level.toUpperCase() : 'debug'}] ${content}\n`;
    const dataBuffer = new Uint8Array(Buffer.from(contentLog));
    fs.appendFileSync(logFilePath, dataBuffer);
}

const writeLogCatchException = (exception) => {
    writeLog(exception, null, 'fatal');
}

module.exports = {
    writeLog,
    writeLogCatchException,
}
