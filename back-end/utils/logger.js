import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'server-app' }),
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console(),
        ...(process.env.NODE_ENV !== 'production'
            ? [new transports.File({ filename: 'logs/server.log' })]
            : [])
        ]
});

export default logger;