/**
 * Helpers - Các hàm tiện ích chung
 * Không chứa logic nghiệp vụ
 */

const logger = require('./logger');

class Helpers {
    /**
     * Sleep/Wait function
     */
    async wait(ms, message = '') {
        if (message) {
            logger.wait(ms / 1000, message);
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Retry wrapper với exponential backoff
     */
    async retryWithBackoff(action, actionName, maxRetries = 3, baseDelay = 2000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.retry(actionName, attempt, maxRetries);
                const result = await action();
                logger.success(`${actionName} thành công`);
                return { success: true, result };
            } catch (error) {
                logger.error(`${actionName} thất bại: ${error.message}`);
                
                if (attempt < maxRetries) {
                    // Exponential backoff: 2s, 4s, 8s...
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    await this.wait(delay, `Chờ trước khi thử lại`);
                }
            }
        }
        
        logger.warn(`${actionName} thất bại sau ${maxRetries} lần thử`);
        return { success: false, result: null };
    }
    
    /**
     * Mask sensitive string (password, token, etc.)
     */
    maskString(str, visibleChars = 0) {
        if (!str || str.length === 0) return '';
        if (visibleChars === 0) {
            return '*'.repeat(str.length);
        }
        const visible = str.substring(0, visibleChars);
        const masked = '*'.repeat(str.length - visibleChars);
        return visible + masked;
    }
    
    /**
     * Validate credentials
     */
    validateCredentials(username, password) {
        if (!username || username.trim().length === 0) {
            return { valid: false, error: 'Tài khoản không được để trống' };
        }
        
        if (!password || password.trim().length === 0) {
            return { valid: false, error: 'Mật khẩu không được để trống' };
        }
        
        if (username.length < 3) {
            return { valid: false, error: 'Tài khoản phải có ít nhất 3 ký tự' };
        }
        
        if (password.length < 6) {
            return { valid: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
        }
        
        return { valid: true };
    }
    
    /**
     * Safe JSON stringify (không crash khi có circular reference)
     */
    safeStringify(obj, indent = 2) {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        }, indent);
    }
    
    /**
     * Format error message
     */
    formatError(error) {
        if (error.message) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return 'Unknown error';
    }
    
    /**
     * Check if URL is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Get memory usage (for monitoring)
     */
    getMemoryUsage() {
        const usage = process.memoryUsage();
        return {
            rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
            heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
            heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB'
        };
    }
    
    /**
     * Log memory usage
     */
    logMemoryUsage() {
        const usage = this.getMemoryUsage();
        logger.debug(`Memory: RSS=${usage.rss}, Heap=${usage.heapUsed}/${usage.heapTotal}`);
    }
}

module.exports = new Helpers();
