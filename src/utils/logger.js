/**
 * Logger - Hệ thống logging đơn giản và hiệu quả
 * Không gửi log ra bên ngoài, chỉ console local
 */

class Logger {
    constructor() {
        this.debugMode = process.env.DEBUG === 'true';
    }
    
    /**
     * Format timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('vi-VN', { hour12: false });
    }
    
    /**
     * Info log
     */
    info(message, ...args) {
        console.log(`ℹ️  ${message}`, ...args);
    }
    
    /**
     * Success log
     */
    success(message, ...args) {
        console.log(`✅ ${message}`, ...args);
    }
    
    /**
     * Warning log
     */
    warn(message, ...args) {
        console.log(`⚠️  ${message}`, ...args);
    }
    
    /**
     * Error log
     */
    error(message, ...args) {
        console.error(`❌ ${message}`, ...args);
    }
    
    /**
     * Debug log (chỉ hiện khi DEBUG=true)
     */
    debug(message, ...args) {
        if (this.debugMode) {
            console.log(`🔍 [DEBUG] ${message}`, ...args);
        }
    }
    
    /**
     * Step log (cho các bước thực hiện)
     */
    step(stepNumber, message, ...args) {
        console.log(`\n📌 BƯỚC ${stepNumber}: ${message}`, ...args);
    }
    
    /**
     * Action log (cho các hành động)
     */
    action(emoji, message, ...args) {
        console.log(`${emoji} ${message}`, ...args);
    }
    
    /**
     * Wait log
     */
    wait(seconds, message = '') {
        if (message) {
            console.log(`⏳ ${message} (${seconds}s)...`);
        }
    }
    
    /**
     * Separator
     */
    separator(char = '=', length = 40) {
        console.log(char.repeat(length));
    }
    
    /**
     * Header
     */
    header(title, subtitle = '') {
        this.separator();
        console.log(`🚀 ${title}`);
        if (subtitle) {
            console.log(`🚀 ${subtitle}`);
        }
        this.separator();
        console.log('');
    }
    
    /**
     * Round info
     */
    round(roundNumber) {
        console.log(`\n🎯 ===== VÒNG ${roundNumber} =====`);
    }
    
    /**
     * Game start
     */
    gameStart() {
        console.log('\n🎮 ========================================');
        console.log('🎮 AUTO GAME BẮT ĐẦU');
        console.log('🎮 Nhấn Ctrl+C để dừng chương trình');
        console.log('🎮 ========================================\n');
    }
    
    /**
     * Retry log
     */
    retry(actionName, attempt, maxAttempts) {
        console.log(`🔄 ${actionName} (lần thử ${attempt}/${maxAttempts})...`);
    }
    
    /**
     * Clear sensitive data from logs
     * Đảm bảo không log password/token
     */
    sanitize(data) {
        if (typeof data === 'string') {
            return data.replace(/password|token|secret|key/gi, '[REDACTED]');
        }
        return data;
    }
}

module.exports = new Logger();
