/**
 * Main Application Entry Point
 * Auto EPL FOnline Garena
 * 
 * SECURITY NOTES:
 * - Không lưu credentials
 * - Không gửi data ra ngoài
 * - Chỉ chạy local
 * - Không có telemetry/analytics
 */

const config = require('./config/config');
const logger = require('./utils/logger');
const helpers = require('./utils/helpers');
const browserHandler = require('./handlers/browserHandler');
const GameHandler = require('./handlers/gameHandler');

class Application {
    constructor() {
        this.gameHandler = null;
        this.isRunning = false;
    }
    
    /**
     * Parse command line arguments
     */
    parseArguments() {
        const args = process.argv.slice(2);
        return {
            username: args[0] || '',
            password: args[1] || ''
        };
    }
    
    /**
     * Display application header
     */
    displayHeader(credentials) {
        logger.header(
            config.messages.APP_TITLE,
            config.messages.APP_SUBTITLE
        );
        
        logger.success('Đã nhận thông tin đăng nhập từ command line');
        logger.info(`📧 Tài khoản: ${credentials.username}`);
        logger.info(`🔑 Mật khẩu: ${helpers.maskString(credentials.password)}`);
        console.log('');
        
        // Display config summary in debug mode
        if (config.debug) {
            logger.debug('Configuration:', config.getSummary());
        }
    }
    
    /**
     * Validate credentials - REQUIRED
     */
    validateCredentials(credentials) {
        if (!credentials.username || !credentials.password) {
            logger.error('❌ Thiếu thông tin đăng nhập!');
            logger.info('');
            logger.info('📖 Cách sử dụng:');
            logger.info('   npm start <tài_khoản> <mật_khẩu>');
            logger.info('');
            logger.info('📝 Ví dụ:');
            logger.info('   npm start myusername mypassword');
            logger.info('   node src/index.js myusername mypassword');
            logger.info('');
            process.exit(1);
        }
        
        return helpers.validateCredentials(credentials.username, credentials.password);
    }
    
    /**
     * Initialize application
     */
    async initialize() {
        try {
            // Validate configuration
            config.validate();
            
            // Initialize browser
            const success = await browserHandler.initialize();
            if (!success) {
                throw new Error('Không thể khởi tạo browser');
            }
            
            // Create game handler
            this.gameHandler = new GameHandler(browserHandler);
            
            return true;
        } catch (error) {
            logger.error('Lỗi khi khởi tạo ứng dụng:', error.message);
            return false;
        }
    }
    
    /**
     * Run main application flow
     */
    async run() {
        try {
            this.isRunning = true;
            
            // Parse arguments
            const credentials = this.parseArguments();
            
            // Validate credentials first
            const validation = this.validateCredentials(credentials);
            if (!validation.valid) {
                logger.error(validation.error);
                return;
            }
            
            // Display header after validation
            this.displayHeader(credentials);
            
            // Initialize
            const initialized = await this.initialize();
            if (!initialized) {
                logger.error('Không thể khởi động ứng dụng');
                return;
            }
            
            // BƯỚC 1: Mở website
            await this.gameHandler.openWebsite();
            
            // BƯỚC 1.5: Click nút Chơi đầu tiên
            const playClicked = await this.gameHandler.clickInitialPlay();
            if (!playClicked) {
                logger.error('Không thể click nút Chơi đầu tiên');
                return;
            }
            
            // BƯỚC 2: Click đăng nhập Garena
            const loginClicked = await this.gameHandler.clickGarenaLogin();
            if (!loginClicked) {
                logger.error('Không thể click nút đăng nhập');
                return;
            }
            
            // BƯỚC 3: Tự động đăng nhập hoặc chờ người dùng
            const loginSuccess = await this.gameHandler.autoLogin(
                credentials.username,
                credentials.password
            );
            
            if (!loginSuccess) {
                logger.error('Không thể tiếp tục do chưa đăng nhập thành công');
                return;
            }
            
            // BƯỚC 4: Bắt đầu vòng lặp game
            await this.gameHandler.gameLoop();
            
        } catch (error) {
            logger.error('LỖI NGHIÊM TRỌNG:', error.message);
            if (config.debug) {
                console.error(error.stack);
            }
        } finally {
            await this.cleanup();
        }
    }
    
    /**
     * Cleanup resources
     */
    async cleanup() {
        this.isRunning = false;
        
        logger.info('\n⚠️ Chương trình kết thúc');
        
        // Cleanup browser
        await browserHandler.cleanup();
        
        logger.info('💡 Cảm ơn bạn đã sử dụng!');
    }
    
    /**
     * Handle graceful shutdown
     */
    setupSignalHandlers() {
        const shutdown = async (signal) => {
            logger.warn(`\n\n⚠️ Nhận tín hiệu dừng (${signal})`);
            logger.info('🛑 Đang dừng chương trình...');
            
            if (this.isRunning) {
                await this.cleanup();
            }
            
            process.exit(0);
        };
        
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        
        // Handle uncaught errors
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error.message);
            if (config.debug) {
                console.error(error.stack);
            }
            shutdown('uncaughtException');
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection:', reason);
            if (config.debug) {
                console.error('Promise:', promise);
            }
        });
    }
}

// Create and run application
const app = new Application();
app.setupSignalHandlers();
app.run();

module.exports = Application;
