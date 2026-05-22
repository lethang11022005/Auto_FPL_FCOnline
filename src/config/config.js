/**
 * Configuration - Cấu hình ứng dụng
 * Có thể override bằng environment variables
 */

const constants = require('./constants');

class Config {
    constructor() {
        // Load từ environment variables hoặc dùng giá trị mặc định
        this.url = process.env.GAME_URL || constants.WEBSITE_URL;
        this.headless = process.env.HEADLESS === 'false' ? false : constants.BROWSER.HEADLESS;
        this.debug = process.env.DEBUG === 'true';
        
        // Timing có thể điều chỉnh qua env
        this.timing = {
            pageLoad: parseInt(process.env.WAIT_PAGE_LOAD) || constants.TIMING.PAGE_LOAD,
            animation: parseInt(process.env.WAIT_ANIMATION) || constants.TIMING.ANIMATION,
            afterConfirm: parseInt(process.env.WAIT_AFTER_CONFIRM) || constants.TIMING.AFTER_CONFIRM,
            retryDelay: parseInt(process.env.RETRY_DELAY) || constants.TIMING.RETRY_DELAY,
            loginWait: constants.TIMING.LOGIN_WAIT,
            reloadWait: constants.TIMING.RELOAD_WAIT,
            shortWait: constants.TIMING.SHORT_WAIT,
            mediumWait: constants.TIMING.MEDIUM_WAIT,
            errorRecovery: constants.TIMING.ERROR_RECOVERY
        };
        
        // Retry configuration
        this.retry = {
            maxAttempts: parseInt(process.env.MAX_RETRIES) || constants.RETRY.MAX_ATTEMPTS,
            timeoutShort: constants.RETRY.TIMEOUT_SHORT,
            timeoutMedium: constants.RETRY.TIMEOUT_MEDIUM,
            timeoutLong: constants.RETRY.TIMEOUT_LONG,
            timeoutLogin: constants.RETRY.TIMEOUT_LOGIN
        };
        
        // Selectors
        this.selectors = constants.SELECTORS;
        
        // Browser config
        this.browser = {
            channel: constants.BROWSER.CHANNEL,
            headless: this.headless,
            userAgent: constants.BROWSER.USER_AGENT,
            args: constants.BROWSER.ARGS
        };
        
        // Messages
        this.messages = constants.MESSAGES;
    }
    
    /**
     * Validate configuration
     */
    validate() {
        if (!this.url || !this.url.startsWith('http')) {
            throw new Error('Invalid URL configuration');
        }
        
        if (this.timing.pageLoad < 1000 || this.timing.pageLoad > 60000) {
            throw new Error('Invalid page load timing (must be between 1-60 seconds)');
        }
        
        if (this.retry.maxAttempts < 1 || this.retry.maxAttempts > 10) {
            throw new Error('Invalid max retry attempts (must be between 1-10)');
        }
        
        return true;
    }
    
    /**
     * Get configuration summary for logging
     */
    getSummary() {
        return {
            url: this.url,
            headless: this.headless,
            debug: this.debug,
            maxRetries: this.retry.maxAttempts
        };
    }
}

module.exports = new Config();
