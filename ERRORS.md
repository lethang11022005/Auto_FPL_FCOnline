# 🔧 Troubleshooting Guide

Hướng dẫn xử lý các lỗi thường gặp khi sử dụng Auto EPL FOnline Garena.

---

## 📋 Mục lục

- [Lỗi cài đặt](#lỗi-cài-đặt)
- [Lỗi khi chạy](#lỗi-khi-chạy)
- [Lỗi đăng nhập](#lỗi-đăng-nhập)
- [Lỗi trong game](#lỗi-trong-game)
- [Lỗi hiệu năng](#lỗi-hiệu-năng)
- [Lỗi khác](#lỗi-khác)

---

## Lỗi cài đặt

### ❌ "node: command not found" hoặc "node is not recognized"

**Nguyên nhân:** Chưa cài đặt Node.js hoặc chưa thêm vào PATH.

**Giải pháp:**

1. Tải và cài đặt Node.js từ https://nodejs.org/
2. Chọn phiên bản LTS (Long Term Support)
3. Trong quá trình cài đặt, chọn "Add to PATH"
4. Khởi động lại terminal/command prompt
5. Kiểm tra lại:
   ```bash
   node --version
   npm --version
   ```

---

### ❌ "Cannot find module 'playwright'"

**Nguyên nhân:** Chưa cài đặt dependencies.

**Giải pháp:**

```bash
npm install
```

Nếu vẫn lỗi, thử xóa và cài lại:

```bash
# Xóa node_modules và package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Cài lại
npm install
```

---

### ❌ "Executable doesn't exist at ..."

**Nguyên nhân:** Chưa cài đặt Microsoft Edge browser cho Playwright.

**Giải pháp:**

```bash
npm run install-browser
```

Hoặc:

```bash
npx playwright install msedge
```

Nếu vẫn lỗi, thử cài đặt tất cả browsers:

```bash
npx playwright install
```

---

### ❌ "EACCES: permission denied"

**Nguyên nhân:** Không có quyền ghi file trong thư mục.

**Giải pháp:**

**Windows:**
- Chạy terminal/command prompt với quyền Administrator
- Hoặc di chuyển project đến thư mục khác (ví dụ: Desktop, Documents)

**Linux/Mac:**
```bash
sudo npm install
```

---

## Lỗi khi chạy

### ❌ "Thiếu thông tin đăng nhập!"

**Nguyên nhân:** Chưa cung cấp tài khoản và mật khẩu.

**Giải pháp:**

Chạy với tài khoản và mật khẩu:

```bash
npm start <tài_khoản> <mật_khẩu>
```

Ví dụ:

```bash
npm start myusername mypassword
```

---

### ❌ "Không thể khởi tạo browser"

**Nguyên nhân:** 
- Microsoft Edge chưa được cài đặt đúng
- Browser process bị block bởi antivirus
- Thiếu quyền truy cập

**Giải pháp:**

1. Cài lại browser:
   ```bash
   npx playwright install msedge --force
   ```

2. Tạm thời tắt antivirus/firewall

3. Chạy terminal với quyền Administrator

4. Kiểm tra xem có process Edge nào đang chạy không:
   ```bash
   # Windows
   tasklist | findstr msedge
   
   # Nếu có, kill process:
   taskkill /F /IM msedge.exe
   ```

---

### ❌ "Page đã bị đóng"

**Nguyên nhân:** Browser bị crash hoặc đóng ngoài ý muốn.

**Giải pháp:**

Chương trình có auto recovery, sẽ tự động khởi động lại browser. Nếu vẫn lỗi:

1. Restart chương trình (Ctrl+C rồi chạy lại)
2. Kiểm tra RAM còn đủ không (cần ít nhất 2GB free)
3. Đóng các ứng dụng khác đang chạy

---

## Lỗi đăng nhập

### ❌ "Lỗi khi tự động đăng nhập"

**Nguyên nhân:**
- Tài khoản hoặc mật khẩu sai
- Website thay đổi cấu trúc form đăng nhập
- Kết nối internet không ổn định

**Giải pháp:**

1. Kiểm tra lại tài khoản và mật khẩu
2. Thử đăng nhập thủ công trên browser để xác nhận credentials đúng
3. Kiểm tra kết nối internet
4. Nếu website thay đổi, cập nhật selectors trong `src/config/constants.js`:
   ```javascript
   SELECTORS: {
       USERNAME_INPUT: 'input[type="text"][placeholder*="Tài khoản"]',
       PASSWORD_INPUT: 'input[type="password"][placeholder*="Mật khẩu"]',
       LOGIN_BUTTON: 'button[type="submit"].primary'
   }
   ```

---

### ❌ "Không thể tiếp tục do chưa đăng nhập thành công"

**Nguyên nhân:**
- Đăng nhập thất bại
- Trang redirect quá lâu
- Captcha hoặc 2FA

**Giải pháp:**

1. Chạy ở chế độ hiện browser để xem vấn đề:
   - Chỉnh sửa `src/config/constants.js`:
     ```javascript
     BROWSER: {
         HEADLESS: false,
         // ...
     }
     ```

2. Tăng timeout chờ đăng nhập trong `src/config/constants.js`:
   ```javascript
   RETRY: {
       TIMEOUT_LOGIN: 60000  // Tăng lên 60 giây
   }
   ```

3. Nếu có captcha/2FA, giải quyết thủ công trong browser

---

## Lỗi trong game

### ❌ "Timeout waiting for selector"

**Nguyên nhân:**
- Website load chậm
- Selector đã thay đổi
- Element chưa xuất hiện
- Kết nối internet không ổn định

**Giải pháp:**

1. Tăng timeout trong `src/config/constants.js`:
   ```javascript
   TIMING: {
       PAGE_LOAD: 20000,  // Tăng từ 10s lên 20s
       // ...
   }
   
   RETRY: {
       TIMEOUT_SHORT: 20000,   // Tăng từ 10s lên 20s
       TIMEOUT_MEDIUM: 30000,  // Tăng từ 15s lên 30s
       TIMEOUT_LONG: 60000     // Tăng từ 30s lên 60s
   }
   ```

2. Kiểm tra kết nối internet

3. Chạy ở chế độ hiện browser để xem element có xuất hiện không

4. Nếu selector thay đổi, cập nhật trong `src/config/constants.js`

---

### ❌ "Không thể click nút Chơi"

**Nguyên nhân:**
- Element chưa load xong
- Element bị che bởi element khác
- Selector không chính xác
- Website thay đổi cấu trúc

**Giải pháp:**

1. Chạy ở chế độ hiện browser để debug:
   ```javascript
   BROWSER: {
       HEADLESS: false
   }
   ```

2. Kiểm tra selector trong `src/config/constants.js`:
   ```javascript
   SELECTORS: {
       PLAY_BUTTON: '.spin__play a.btn--red-big'
   }
   ```

3. Tăng thời gian đợi trước khi click:
   ```javascript
   TIMING: {
       SHORT_WAIT: 2000,   // Tăng từ 1s lên 2s
       MEDIUM_WAIT: 3000   // Tăng từ 2s lên 3s
   }
   ```

---

### ❌ "Không thể xác nhận phần thưởng"

**Nguyên nhân:**
- Popup xác nhận chưa xuất hiện
- Selector của nút xác nhận thay đổi
- Animation chưa hoàn tất

**Giải pháp:**

1. Tăng thời gian đợi animation:
   ```javascript
   TIMING: {
       ANIMATION: 15000  // Tăng từ 10s lên 15s
   }
   ```

2. Kiểm tra selector nút xác nhận:
   ```javascript
   SELECTORS: {
       CONFIRM_BUTTON: 'button.swal2-confirm'
   }
   ```

---

### ❌ "Đã gặp 5 lỗi liên tiếp, thử khôi phục..."

**Nguyên nhân:**
- Lỗi liên tục trong game loop
- Browser không ổn định
- Website có vấn đề

**Giải pháp:**

Chương trình sẽ tự động khôi phục browser. Nếu vẫn lỗi:

1. Restart chương trình hoàn toàn (Ctrl+C rồi chạy lại)
2. Kiểm tra website có hoạt động bình thường không
3. Thử đăng nhập và chơi thủ công trên browser để xác nhận
4. Kiểm tra log để xem lỗi cụ thể

---

## Lỗi hiệu năng

### ❌ Chương trình chạy chậm

**Nguyên nhân:**
- RAM không đủ
- CPU quá tải
- Nhiều ứng dụng chạy cùng lúc

**Giải pháp:**

1. Đóng các ứng dụng không cần thiết
2. Kiểm tra RAM usage:
   - Chương trình log memory usage mỗi 10 vòng
   - Mỗi instance nên dùng ~200-300MB
3. Giảm số instance đang chạy
4. Restart máy tính nếu cần

---

### ❌ Memory leak / RAM tăng dần

**Nguyên nhân:**
- Browser context không được cleanup đúng cách
- Quá nhiều vòng lặp liên tục

**Giải pháp:**

1. Restart chương trình định kỳ (mỗi vài giờ)
2. Chương trình có auto cleanup, nhưng nếu vẫn leak:
   - Báo lỗi để được hỗ trợ
   - Tạm thời restart thủ công

---

### ❌ CPU 100%

**Nguyên nhân:**
- Quá nhiều instance chạy cùng lúc
- Browser process bị treo

**Giải pháp:**

1. Giảm số instance
2. Kill các process Edge đang treo:
   ```bash
   taskkill /F /IM msedge.exe
   ```
3. Restart chương trình

---

## Lỗi khác

### ❌ "url.includes is not a function"

**Nguyên nhân:** Lỗi code trong version cũ (đã fix).

**Giải pháp:**

Cập nhật lên version mới nhất. Nếu vẫn gặp, kiểm tra file `src/handlers/gameHandler.js`:

```javascript
// Sai:
await page.waitForURL(url => !url.includes('/user/login'), { ... });

// Đúng:
await page.waitForURL(url => !url.href.includes('/user/login'), { ... });
```

---

### ❌ "ECONNREFUSED" hoặc "Network error"

**Nguyên nhân:**
- Không có kết nối internet
- Website bị chặn bởi firewall
- Website đang bảo trì

**Giải pháp:**

1. Kiểm tra kết nối internet
2. Thử truy cập website trên browser thường
3. Kiểm tra firewall/antivirus có chặn không
4. Đợi website hoạt động trở lại

---

### ❌ "Port already in use"

**Nguyên nhân:** Có instance khác đang chạy.

**Giải pháp:**

Playwright không dùng port cố định, lỗi này hiếm gặp. Nếu gặp:

1. Đóng tất cả terminal đang chạy chương trình
2. Kill tất cả process Edge:
   ```bash
   taskkill /F /IM msedge.exe
   taskkill /F /IM node.exe
   ```
3. Chạy lại

---

### ❌ Chương trình không dừng khi nhấn Ctrl+C

**Nguyên nhân:** Signal handler không hoạt động đúng.

**Giải pháp:**

1. Nhấn Ctrl+C nhiều lần
2. Nếu vẫn không dừng, đóng terminal
3. Kill process thủ công:
   ```bash
   # Tìm process ID
   tasklist | findstr node
   
   # Kill process
   taskkill /F /PID <process_id>
   ```

---

## 🆘 Vẫn gặp lỗi?

Nếu vẫn gặp lỗi sau khi thử các giải pháp trên:

1. **Kiểm tra log chi tiết:**
   - Đọc kỹ thông báo lỗi trong terminal
   - Chụp màn hình lỗi để dễ hỗ trợ

2. **Chạy ở chế độ debug:**
   - Chỉnh sửa `src/config/constants.js`:
     ```javascript
     BROWSER: {
         HEADLESS: false  // Hiện browser để debug
     }
     ```

3. **Kiểm tra version:**
   ```bash
   node --version
   npm --version
   npx playwright --version
   ```

4. **Thử cài đặt lại từ đầu:**
   ```bash
   # Xóa node_modules
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   
   # Cài lại
   npm install
   npm run install-browser
   ```

5. **Báo lỗi:**
   - Mô tả chi tiết lỗi
   - Kèm theo log/screenshot
   - Thông tin hệ thống (OS, Node version, etc.)

---

## 💡 Tips

- Luôn cập nhật lên version mới nhất
- Đọc kỹ thông báo lỗi trước khi hỏi
- Backup code trước khi chỉnh sửa
- Test trên browser thường trước khi chạy automation
- Sử dụng chế độ hiện browser (HEADLESS=false) khi debug

---

[⬆ Quay lại README](README.md)
