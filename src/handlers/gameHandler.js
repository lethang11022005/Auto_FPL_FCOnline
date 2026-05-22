/**
 * Game Handler - Xử lý logic game chính
 * Tương tác với các element trên trang game
 */

const config = require('../config/config');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');

class GameHandler {
    constructor(browserHandler) {
        this.browserHandler = browserHandler;
    }
    
    /**
     * Mở website game
     */
    async openWebsite() {
        logger.step(1, 'Mở website');
        
        await this.browserHandler.goto(config.url);
        await helpers.wait(config.timing.pageLoad, 'Đợi trang load hoàn tất');
        
        logger.success('Đã mở website thành công');
        return true;
    }
    
    /**
     * Click nút "Chơi" đầu tiên (trước khi login)
     */
    async clickInitialPlay() {
        logger.step(1.5, 'Click nút Chơi đầu tiên');
        
        const result = await helpers.retryWithBackoff(async () => {
            const page = this.browserHandler.getPage();
            const playButton = await page.locator(config.selectors.PLAY_BUTTON).first();
            await playButton.waitFor({ state: 'visible', timeout: config.retry.timeoutShort });
            await playButton.click();
            await helpers.wait(config.timing.mediumWait);
        }, 'Click nút Chơi đầu tiên', config.retry.maxAttempts, config.timing.retryDelay);
        
        return result.success;
    }
    
    /**
     * Click nút đăng nhập Garena
     */
    async clickGarenaLogin() {
        logger.step(2, 'Click nút đăng nhập Garena');
        
        const result = await helpers.retryWithBackoff(async () => {
            const page = this.browserHandler.getPage();
            const loginLink = await page.locator(config.selectors.LOGIN_LINK).first();
            await loginLink.waitFor({ state: 'visible', timeout: config.retry.timeoutShort });
            await loginLink.click();
            await helpers.wait(config.timing.mediumWait);
        }, 'Click nút đăng nhập Garena', config.retry.maxAttempts, config.timing.retryDelay);
        
        return result.success;
    }
    
    /**
     * Tự động đăng nhập
     */
    async autoLogin(username, password) {
        logger.step(3, 'Đăng nhập');
        await helpers.wait(config.timing.pageLoad, 'Đợi trang login load');
        
        const page = this.browserHandler.getPage();
        
        logger.info('🔐 Tự động điền thông tin đăng nhập...');
        
        try {
            // Điền tài khoản
            const usernameInput = await page.locator(config.selectors.USERNAME_INPUT).first();
            await usernameInput.waitFor({ state: 'visible', timeout: config.retry.timeoutShort });
            await usernameInput.fill(username);
            logger.success('Đã điền tài khoản');
            
            await helpers.wait(config.timing.shortWait);
            
            // Điền mật khẩu
            const passwordInput = await page.locator(config.selectors.PASSWORD_INPUT).first();
            await passwordInput.waitFor({ state: 'visible', timeout: config.retry.timeoutShort });
            await passwordInput.fill(password);
            logger.success('Đã điền mật khẩu');
            
            await helpers.wait(config.timing.shortWait);
            
            // Click nút đăng nhập
            const loginButton = await page.locator(config.selectors.LOGIN_BUTTON).first();
            await loginButton.waitFor({ state: 'visible', timeout: config.retry.timeoutShort });
            await loginButton.click();
            logger.success('Đã click nút đăng nhập');
            
        } catch (error) {
            logger.error('Lỗi khi tự động đăng nhập:', error.message);
            return false;
        }
        
        // Chờ redirect về trang chính
        logger.info('⏳ Đang chờ đăng nhập thành công...');
        
        try {
            // Bước 1: Chờ URL thay đổi (không còn /user/login)
            logger.info('🔄 Chờ redirect về trang chính...');
            await page.waitForURL(url => !url.href.includes('/user/login'), { 
                timeout: config.retry.timeoutLogin 
            });
            logger.success('Đã redirect về trang chính');
            
            // Bước 2: Đợi thêm để trang load hoàn tất
            await helpers.wait(config.timing.loginWait, 'Đợi trang load hoàn tất');
            
            // Bước 3: Kiểm tra element "Chơi" đã xuất hiện chưa
            logger.info('🔍 Kiểm tra nút Chơi đã xuất hiện...');
            const playButton = await page.locator(config.selectors.PLAY_BUTTON).first();
            await playButton.waitFor({ state: 'visible', timeout: config.retry.timeoutMedium });
            
            logger.success('Đăng nhập thành công! Nút Chơi đã sẵn sàng');
            
            // Bước 4: Reload trang 1 lần
            logger.info('🔄 Reload trang để đảm bảo dữ liệu mới nhất...');
            await this.browserHandler.reload();
            await helpers.wait(config.timing.reloadWait, 'Đợi trang reload hoàn tất');
            
            // Kiểm tra lại nút Chơi sau khi reload
            logger.info('🔍 Kiểm tra lại nút Chơi sau reload...');
            await playButton.waitFor({ state: 'visible', timeout: config.retry.timeoutMedium });
            logger.success('Sẵn sàng bắt đầu chơi!');
            
            return true;
        } catch (error) {
            logger.error('Lỗi khi chờ đăng nhập:', error.message);
            logger.warn('Có thể đăng nhập thất bại hoặc trang load quá lâu');
            return false;
        }
    }
    
    /**
     * Click nút "Chơi" trong game
     */
    async clickPlay() {
        const result = await helpers.retryWithBackoff(async () => {
            const page = this.browserHandler.getPage();
            const playButton = await page.locator(config.selectors.PLAY_BUTTON).first();
            await playButton.waitFor({ state: 'visible', timeout: config.retry.timeoutShort });
            await playButton.click();
        }, 'Click nút Chơi', config.retry.maxAttempts, config.timing.retryDelay);
        
        return result.success;
    }
    
    /**
     * Click nút "Xác nhận" phần thưởng
     */
    async confirmReward() {
        const result = await helpers.retryWithBackoff(async () => {
            const page = this.browserHandler.getPage();
            const confirmButton = await page.locator(config.selectors.CONFIRM_BUTTON).first();
            await confirmButton.waitFor({ state: 'visible', timeout: config.retry.timeoutMedium });
            await confirmButton.click();
        }, 'Click nút Xác nhận', config.retry.maxAttempts, config.timing.retryDelay);
        
        return result.success;
    }
    
    /**
     * Vòng lặp game chính
     */
    async gameLoop() {
        logger.step(4, 'Bắt đầu vòng lặp auto chơi game');
        logger.gameStart();
        
        let roundCount = 0;
        let consecutiveErrors = 0;
        const MAX_CONSECUTIVE_ERRORS = 5;
        
        while (true) {
            try {
                // Check if page is still alive
                if (this.browserHandler.isPageClosed()) {
                    logger.error('Page đã bị đóng, thử khôi phục...');
                    const recovered = await this.browserHandler.recover();
                    if (!recovered) {
                        logger.error('Không thể khôi phục, dừng chương trình');
                        break;
                    }
                    continue;
                }
                
                roundCount++;
                logger.round(roundCount);
                
                // Log memory usage mỗi 10 vòng
                if (roundCount % 10 === 0) {
                    helpers.logMemoryUsage();
                }
                
                // Bước 1: Click "Chơi"
                logger.action('1️⃣', 'Click nút Chơi...');
                const playSuccess = await this.clickPlay();
                if (!playSuccess) {
                    logger.warn('Không thể click Chơi, thử lại vòng sau...');
                    consecutiveErrors++;
                    await helpers.wait(config.timing.errorRecovery);
                    continue;
                }
                
                // Bước 2: Đợi animation
                await helpers.wait(config.timing.animation, '2️⃣ Đợi animation game quay');
                
                // Bước 3: Click "Xác nhận"
                logger.action('3️⃣', 'Click nút Xác nhận...');
                const confirmSuccess = await this.confirmReward();
                if (!confirmSuccess) {
                    logger.warn('Không thể xác nhận, thử lại vòng sau...');
                    consecutiveErrors++;
                    await helpers.wait(config.timing.errorRecovery);
                    continue;
                }
                
                // Bước 4: Đợi trước khi vòng tiếp theo
                await helpers.wait(config.timing.afterConfirm, '4️⃣ Đợi trước khi chơi tiếp');
                
                logger.success(`Hoàn thành vòng ${roundCount}`);
                
                // Reset consecutive errors counter
                consecutiveErrors = 0;
                
            } catch (error) {
                logger.error(`Lỗi trong vòng ${roundCount}: ${error.message}`);
                logger.info('🔄 Tiếp tục vòng tiếp theo...');
                
                consecutiveErrors++;
                
                // Nếu lỗi liên tiếp quá nhiều, thử recover
                if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                    logger.warn(`Đã gặp ${consecutiveErrors} lỗi liên tiếp, thử khôi phục...`);
                    const recovered = await this.browserHandler.recover();
                    if (!recovered) {
                        logger.error('Không thể khôi phục, dừng chương trình');
                        break;
                    }
                    consecutiveErrors = 0;
                }
                
                await helpers.wait(config.timing.errorRecovery);
            }
        }
    }
}

module.exports = GameHandler;
