// @ts-check

const path = require('path');
const fs = require('fs');
const logPath = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}

class Logger {

    static get Severity() {
        return {
            Debug: 'DEBUG',
            Info: 'INFO',
            Error: 'ERROR',
            Fatal: 'FATAL',
            Warning: 'WARNING',
        }
    }

    /**
     * Escribir logs
     * 
     * @param {String} event
     * @param {String} content
     * @param {string} severity
     */
    static writeLog(event, content, severity) {
        const actualDate = new Date();
        const dateFormatted = `${actualDate.getFullYear()}-${(actualDate.getMonth() + 1).toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`;
        const timeFormatted = `${actualDate.toLocaleTimeString()}.${actualDate.getMilliseconds().toString().padStart(3, '0')}`;
        const pathLogFile = path.join(logPath, `${dateFormatted}.log`);
        const contentLog = `[${timeFormatted}] [${severity}] (${event}) ${content}\n`;

        fs.appendFile(pathLogFile, contentLog, _ => { });
    }
}

module.exports = Logger;
