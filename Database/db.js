const mysql = require('mysql2/promise'); // Sử dụng mysql2/promise

// Tạo pool kết nối
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'FarmManagerDB',
    waitForConnections: true,
    connectionLimit: 10, // Số lượng kết nối tối đa trong pool
    queueLimit: 0
});

// Hàm kiểm tra kết nối (tùy chọn)
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database Connected');
        connection.release(); // Trả kết nối về pool
    } catch (err) {
        console.error('Connect Error:', err);
    }
}

testConnection(); // Gọi hàm kiểm tra kết nối

module.exports = pool; // Export pool để sử dụng trong các file khác