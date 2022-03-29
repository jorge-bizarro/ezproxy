const path = require('path');
const fs = require('fs');
const logPath = path.join(process.cwd(), 'log');

if (!fs.existsSync(logPath))
    fs.mkdirSync(logPath)


class Logger {

    static get Severity() {
        return {
            Debug: 'DEBUG',
            Info: 'INFO',
            Error: 'ERROR',
            Fatal: 'FATAL',
        }
    }

    /**
     * Escribir logs
     * 
     * @param {String} content
     * @param {string | null} category
     * @param {string | null} level 
     */
    static writeLog(event, content, severity, idTrace = null) {
        const actualDate = new Date();
        const dateFormatted = `${actualDate.getFullYear()}-${(actualDate.getMonth() + 1).toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`;
        const timeFormatted = `${actualDate.toLocaleTimeString()}.${actualDate.getMilliseconds().toString().padStart(3, 0)}`;
        const pathLogFile = path.join(logPath, `${dateFormatted}.log`);

        let contentLog;

        if (idTrace) {
            contentLog = `[${timeFormatted}] [${severity}] [${idTrace}] (${event}) ${content}\n`;
        } else {
            contentLog = `[${timeFormatted}] [${severity}] (${event}) ${content}\n`;
        }

        fs.appendFile(pathLogFile, contentLog, () => { });
    }
}

module.exports = Logger;
