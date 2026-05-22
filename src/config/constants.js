/**
 * Constants - Các hằng số cấu hình cho ứng dụng
 * Không chứa thông tin nhạy cảm
 */

module.exports = {
    // URL và endpoint
    WEBSITE_URL: 'https://epl.fconline.garena.vn/',
    
    // Timing configuration (milliseconds)
    TIMING: {
        PAGE_LOAD: 10000,           // Thời gian đợi trang load
        ANIMATION: 10000,            // Thời gian đợi animation game
        AFTER_CONFIRM: 3000,         // Thời gian đợi sau khi xác nhận
        RETRY_DELAY: 2000,           // Thời gian đợi trước khi retry
        LOGIN_WAIT: 10000,           // Thời gian đợi sau login
        RELOAD_WAIT: 10000,          // Thời gian đợi sau reload
        SHORT_WAIT: 1000,            // Thời gian đợi ngắn
        MEDIUM_WAIT: 2000,           // Thời gian đợi trung bình
        ERROR_RECOVERY: 5000         // Thời gian đợi khi gặp lỗi
    },
    
    // Retry configuration
    RETRY: {
        MAX_ATTEMPTS: 3,             // Số lần thử lại tối đa
        TIMEOUT_SHORT: 10000,        // Timeout ngắn (10s)
        TIMEOUT_MEDIUM: 15000,       // Timeout trung bình (15s)
        TIMEOUT_LONG: 30000,         // Timeout dài (30s)
        TIMEOUT_LOGIN: 30000         // Timeout cho login
    },
    
    // Selectors - CSS selectors cho các element
    SELECTORS: {
        PLAY_BUTTON: '.spin__play a.btn--red-big',
        UPDATE_BUTTON: '.spin__play a.btn--green-big',
        LOGIN_LINK: 'a[href="/user/login"]',
        USERNAME_INPUT: 'input[type="text"][placeholder*="Tài khoản"]',
        PASSWORD_INPUT: 'input[type="password"][placeholder*="Mật khẩu"]',
        LOGIN_BUTTON: 'button[type="submit"].primary',
        CONFIRM_BUTTON: 'button.swal2-confirm'
    },
    
    // Browser configuration
    BROWSER: {
        CHANNEL: 'msedge',
        HEADLESS: false,
        USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        ARGS: [
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--no-sandbox'
        ]
    },
    
    // Messages
    MESSAGES: {
        APP_TITLE: 'AUTO EPL FCONLINE GARENA',
        APP_SUBTITLE: 'Sử dụng Microsoft Edge + Playwright'
    }
};
