/**
 * Browser Handler - Quản lý browser và page lifecycle
 * Xử lý khởi tạo, cleanup, recovery
 */

const { chromium } = require('playwright');
const config = require('../config/config');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');

class BrowserHandler {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.isInitialized = false;
    }
    
    /**
     * Khởi tạo browser
     */
    async initialize() {
        try {
            logger.info('Đang khởi động Microsoft Edge...');
            
            // Launch browser
            this.browser = await chromium.launch({
                channel: config.browser.channel,
                headless: config.browser.headless,
                args: config.browser.args
            });
            
            // Create context
            this.context = await this.browser.newContext({
                userAgent: config.browser.userAgent,
                // Không lưu cookies, localStorage, sessionStorage
                storageState: undefined
            });
            
            // Create page
            this.page = await this.context.newPage();
            
            // Set default timeout
            this.page.setDefaultTimeout(config.retry.timeoutMedium);
            
            // Disable unnecessary features
            await this.page.route('**/*', (route) => {
                const request = route.request();
                const resourceType = request.resourceType();
                
                // Block analytics, tracking, ads
                if (resourceType === 'image' && request.url().includes('analytics')) {
                    route.abort();
                } else if (resourceType === 'image' && request.url().includes('tracking')) {
                    route.abort();
                } else if (resourceType === 'image' && request.url().includes('ads')) {
                    route.abort();
                } else {
                    route.continue();
                }
            });
            
            this.isInitialized = true;
            logger.success('Đã khởi động Edge thành công');
            
            return true;
        } catch (error) {
            logger.error('Lỗi khi khởi động browser:', error.message);
            return false;
        }
    }
    
    /**
     * Navigate to URL
     */
    async goto(url, options = {}) {
        if (!this.page) {
            throw new Error('Browser chưa được khởi tạo');
        }
        
        const defaultOptions = {
            waitUntil: 'domcontentloaded',
            timeout: config.retry.timeoutLong
        };
        
        return await this.page.goto(url, { ...defaultOptions, ...options });
    }
    
    /**
     * Reload page
     */
    async reload(options = {}) {
        if (!this.page) {
            throw new Error('Browser chưa được khởi tạo');
        }
        
        const defaultOptions = {
            waitUntil: 'domcontentloaded',
            timeout: config.retry.timeoutLong
        };
        
        return await this.page.reload({ ...defaultOptions, ...options });
    }
    
    /**
     * Get page instance
     */
    getPage() {
        if (!this.page) {
            throw new Error('Browser chưa được khởi tạo');
        }
        return this.page;
    }
    
    /**
     * Check if page is closed
     */
    isPageClosed() {
        return !this.page || this.page.isClosed();
    }
    
    /**
     * Recover from crash
     */
    async recover() {
        try {
            logger.warn('Đang thử khôi phục browser...');
            
            // Close existing instances
            await this.cleanup(false);
            
            // Re-initialize
            const success = await this.initialize();
            
            if (success) {
                logger.success('Khôi phục browser thành công');
                return true;
            }
            
            return false;
        } catch (error) {
            logger.error('Không thể khôi phục browser:', error.message);
            return false;
        }
    }
    
    /**
     * Cleanup resources
     */
    async cleanup(logMessage = true) {
        try {
            if (logMessage) {
                logger.info('Đang dọn dẹp resources...');
            }
            
            if (this.page && !this.page.isClosed()) {
                await this.page.close().catch(() => {});
            }
            
            if (this.context) {
                await this.context.close().catch(() => {});
            }
            
            if (this.browser) {
                await this.browser.close().catch(() => {});
            }
            
            this.page = null;
            this.context = null;
            this.browser = null;
            this.isInitialized = false;
            
            if (logMessage) {
                logger.success('Đã dọn dẹp resources');
            }
        } catch (error) {
            logger.error('Lỗi khi cleanup:', error.message);
        }
    }
    
    /**
     * Take screenshot (for debugging)
     */
    async screenshot(path) {
        if (!this.page || this.page.isClosed()) {
            return false;
        }
        
        try {
            await this.page.screenshot({ path, fullPage: true });
            logger.debug(`Screenshot saved: ${path}`);
            return true;
        } catch (error) {
            logger.error('Không thể chụp screenshot:', error.message);
            return false;
        }
    }
    
    /**
     * Get current URL
     */
    getCurrentUrl() {
        if (!this.page || this.page.isClosed()) {
            return null;
        }
        return this.page.url();
    }
}

module.exports = new BrowserHandler();
