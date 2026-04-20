import winston from "winston";
import { LogMeta } from "../../types/index";


const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const isDev = process.env.NODE_ENV !== "production";


const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level}]: ${stack || message} ${metaString}`;
});

const logger = winston.createLogger({
    level: isDev ? "debug" : "info",
    format: combine(
        timestamp(),
        errors({ stack: true }),
        isDev ? colorize() : json(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),

        new winston.transports.File({
            filename: "logs/combined.log",
        }),
    ],
});


export const log = {
    info: (message: string, meta?: LogMeta) => logger.info(message, meta),
    error: (message: string | Error, meta?: LogMeta) =>
        logger.error(message instanceof Error ? (message.stack || message.message) : message, meta),
    warn: (message: string, meta?: LogMeta) => logger.warn(message, meta),
    debug: (message: string, meta?: LogMeta) => logger.debug(message, meta),
};

export default logger;