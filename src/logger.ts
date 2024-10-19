import winston from "winston";
const { combine, timestamp, label, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
});

export const logger = winston.createLogger({
    format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        label({ label: "WAS" }),
        logFormat
    ),

    transports: [new winston.transports.Console()],
});
