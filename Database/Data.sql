/*ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
FLUSH PRIVILEGES;*/

-- Tạo cơ sở dữ liệu FarmManagerDB (nếu chưa tồn tại)
drop database if exists FarmManagerDB;
create database FarmManagerDB;
use FarmManagerDB;

-- Tạo bảng Loại sản phẩm (ProductTypes)
CREATE TABLE ProductTypes (
    product_type_id INT PRIMARY KEY AUTO_INCREMENT,
    product_type_name VARCHAR(255)
);

-- Tạo bảng Loại khách hàng (CustomerTypes)
CREATE TABLE CustomerTypes (
    customer_type_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_type_name VARCHAR(255)
);

-- Tạo bảng Sản phẩm (Products)
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255),
    product_type_id INT,
    description TEXT,
    FOREIGN KEY (product_type_id) REFERENCES ProductTypes(product_type_id)
);

-- Tạo bảng Khách hàng (Customers)
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255),
    customer_type_id INT,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    FOREIGN KEY (customer_type_id) REFERENCES CustomerTypes(customer_type_id)
);

-- Tạo bảng Xuất kho (Exports)
CREATE TABLE Exports (
    export_id INT PRIMARY KEY AUTO_INCREMENT,
    export_date DATE,
    product_id INT,
    customer_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Tạo bảng Inventory (Tồn kho)
CREATE TABLE Inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    quantity_in_stock INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Tạo bảng Invoices (Hóa đơn)
CREATE TABLE Invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    invoice_date DATE NOT NULL,
    order_total DECIMAL(10, 2),
    notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Tạo bảng ProductPrices
CREATE TABLE ProductPrices (
    product_price_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_type_id INT,
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (customer_type_id) REFERENCES CustomerTypes(customer_type_id)
);

-- Thêm dữ liệu mẫu vào bảng ProductTypes
INSERT INTO ProductTypes (product_type_name) VALUES
('Rau ăn lá'),
('Rau ăn củ'),
('Động vật'),
('Cây ăn quả'),
('Rau gia vị'),
('Nấm'),
('Hoa');

-- Thêm dữ liệu mẫu vào bảng CustomerTypes
INSERT INTO CustomerTypes (customer_type_name) VALUES
('Khách lẻ'),
('Khách sỉ'),
('Nhà hàng'),
('Siêu thị'),
('Chợ đầu mối'),
('Cửa hàng thực phẩm');

-- Thêm dữ liệu mẫu vào bảng Products
INSERT INTO Products (product_name, product_type_id, description) VALUES
('Rau muống', 1, 'Rau muống tươi xanh.'),
('Khoai tây', 2, 'Khoai tây Đà Lạt.'),
('Gà ta', 3, 'Gà ta thả vườn.'),
('Táo Mỹ', 4, 'Táo Mỹ nhập khẩu.'),
('Hành tím', 5, 'Hành tím Lý Sơn.'),
('Nấm kim châm', 6, 'Nấm kim châm tươi.'),
('Hoa hồng Đà Lạt', 7, 'Hoa hồng Đà Lạt nhiều màu.'),
('Cải thìa baby', 1, 'Cải thìa baby non.'),
('Cà rốt', 2, 'Cà rốt ngọt.'),
('Heo rừng', 3, 'Heo rừng lai.'),
('Bưởi da xanh', 4, 'Bưởi da xanh Bến Tre.'),
('Sả cây', 5, 'Sả cây thơm.'),
('Nấm đùi gà', 6, 'Nấm đùi gà dai.'),
('Hoa cúc', 7, 'Hoa cúc vàng.'),
('Rau diếp cá', 1, 'Rau diếp cá tươi mát'),
('Củ cải trắng', 2, 'Củ cải trắng giòn ngọt'),
('Vịt xiêm', 3, 'Vịt xiêm thịt chắc'),
('Thanh long ruột đỏ', 4, 'Thanh long ruột đỏ ngon ngọt'),
('Rau húng quế', 5, 'Rau húng quế thơm nồng'),
('Nấm linh chi', 6, 'Nấm linh chi dược liệu'),
('Hoa hướng dương', 7, 'Hoa hướng dương rực rỡ');

-- Thêm dữ liệu mẫu vào bảng Customers
INSERT INTO Customers (customer_name, customer_type_id, address, phone, email) VALUES
('Nguyễn Văn A', 1, '123 Đường ABC, Quận 1', '0901234567', 'nguyenvana@example.com'),
('Trần Thị B', 2, '456 Đường XYZ, Quận 2', '0912345678', 'tranthib@example.com'),
('Nhà hàng C', 3, '789 Đường MNO, Quận 3', '0923456789', 'nhahangc@example.com'),
('Siêu thị D', 4, '10 Đường PQR, Quận 4', '0934567890', 'sieuthid@example.com'),
('Chợ Bình Điền', 5, 'Kinh Dương Vương, Quận 6', '0945678901', 'binhdien@market.com'),
('Cửa hàng Xanh', 6, 'Nguyễn Trãi, Quận 5', '0956789012', 'xanhstore@food.com'),
('Cô Ba', 1, 'Lê Văn Sỹ, Quận 3', '0967890123', 'coba@gmail.com');

-- Thêm dữ liệu mẫu vào bảng Exports
INSERT INTO Exports (export_date, product_id, customer_id, quantity, notes) VALUES
('2023-10-27', 1, 1, 2, 'Đơn hàng đầu tiên'),
('2024-10-27', 2, 2, 5, 'Đơn hàng cho khách sỉ'),
('2024-12-27', 3, 3, 10, 'Đơn hàng cho nhà hàng'),
('2025-01-28', 14, 4, 20, 'Đơn hàng cho siêu thị'),
('2024-11-05', 17, 2, 5, 'Đơn hàng cho cửa hàng thực phẩm.'),
('2024-11-10', 18, 3, 3,'Đơn hàng nhỏ lẻ.'),
('2024-12-01', 8, 4, 10, 'Đơn hàng lớn cho siêu thị.'),
('2024-11-01', 16, 1, 10, 'Đơn hàng cho chợ đầu mối.');

-- Thêm dữ liệu mẫu vào bảng Inventory
INSERT INTO Inventory (product_id, quantity_in_stock) VALUES
(1, 100),
(2, 150),
(3, 200),
(14, 50),
(20, 200),
(9, 150),
(12, 120),
(7, 300),
(15, 70),
(16, 500),
(17, 300),
(18, 100),
(19, 80);

-- Thêm dữ liệu mẫu vào bảng Invoices
INSERT INTO Invoices (customer_id, invoice_date, order_total) VALUES
(1, '2023-10-27', 30000),
(2, '2024-10-27', 75000),
(3, '2024-12-27', 100000),
(4, '2025-01-28', 360000),
(1, '2024-11-01', 45000),
(2, '2024-11-05', 27500),
(3, '2024-11-10', 84000),
(4, '2024-12-01', 200000);

-- Thêm dữ liệu vào bảng ProductPrices
INSERT INTO ProductPrices (product_id, customer_type_id, unit_price) VALUES
(1, 1, 8000),  -- Rau muống, Khách lẻ
(1, 2, 7500),  -- Rau muống, Khách sỉ
(1, 3, 7000),  -- Rau muống, Nhà hàng
(1, 4, 6500),  -- Rau muống, Siêu thị
(2, 1, 12000), -- Khoai tây, Khách lẻ
(2, 2, 11500), -- Khoai tây, Khách sỉ
(2, 3, 11000), -- Khoai tây, Nhà hàng
(2, 4, 10500), -- Khoai tây, Siêu thị
(3, 1, 150000),-- Gà ta, Khách lẻ
(3, 2, 140000),-- Gà ta, Khách sỉ
(3, 3, 130000),-- Gà ta, Nhà hàng
(3, 4, 120000),-- Gà ta, Siêu thị
(4, 1, 30000), -- Táo Mỹ, Khách lẻ
(4, 2, 29000), -- Táo Mỹ, Khách sỉ
(4, 3, 28000), -- Táo Mỹ, Nhà hàng
(4, 4, 27000), -- Táo Mỹ, Siêu thị
(5, 1, 15000), -- Hành tím, Khách lẻ
(5, 2, 14500), -- Hành tím, Khách sỉ
(5, 3, 14000), -- Hành tím, Nhà hàng
(5, 4, 13500), -- Hành tím, Siêu thị
(6, 1, 25000), -- Nấm kim châm, Khách lẻ
(6, 2, 24000), -- Nấm kim châm, Khách sỉ
(6, 3, 23000), -- Nấm kim châm, Nhà hàng
(6, 4, 22000), -- Nấm kim châm, Siêu thị
(7, 1, 20000), -- Hoa hồng Đà Lạt, Khách lẻ
(7, 2, 19000), -- Hoa hồng Đà Lạt, Khách sỉ
(7, 3, 18000), -- Hoa hồng Đà Lạt, Nhà hàng
(7, 4, 17000), -- Hoa hồng Đà Lạt, Siêu thị
(8, 1, 10000), -- Cải thìa baby, Khách lẻ
(8, 2, 9500),  -- Cải thìa baby, Khách sỉ
(8, 3, 9000),  -- Cải thìa baby, Nhà hàng
(8, 4, 8500),  -- Cải thìa baby, Siêu thị
(9, 1, 9000),  -- Cà rốt, Khách lẻ
(9, 2, 8500),  -- Cà rốt, Khách sỉ
(9, 3, 8000),  -- Cà rốt, Nhà hàng
(9, 4, 7500),  -- Cà rốt, Siêu thị
(10, 1, 200000),-- Heo rừng, Khách lẻ
(10, 2, 190000),-- Heo rừng, Khách sỉ
(10, 3, 180000),-- Heo rừng, Nhà hàng
(10, 4, 170000),-- Heo rừng, Siêu thị
(11, 1, 40000), -- Bưởi da xanh, Khách lẻ
(11, 2, 39000), -- Bưởi da xanh, Khách sỉ
(11, 3, 38000), -- Bưởi da xanh, Nhà hàng
(11, 4, 37000), -- Bưởi da xanh, Siêu thị
(12, 1, 7000),  -- Sả cây, Khách lẻ
(12, 2, 6500),  -- Sả cây, Khách sỉ
(12, 3, 6000),  -- Sả cây, Nhà hàng
(12, 4, 5500),  -- Sả cây, Siêu thị
(13, 1, 35000), -- Nấm đùi gà, Khách lẻ
(13, 2, 34000), -- Nấm đùi gà, Khách sỉ
(13, 3, 33000), -- Nấm đùi gà, Nhà hàng
(13, 4, 32000), -- Nấm đùi gà, Siêu thị
(14, 1, 18000), -- Hoa cúc, Khách lẻ
(14, 2, 17000), -- Hoa cúc, Khách sỉ
(14, 3, 16000), -- Hoa cúc, Nhà hàng
(14, 4, 15000), -- Hoa cúc, Siêu thị
(15, 1, 11000), -- Rau diếp cá, Khách lẻ
(15, 2, 10500), -- Rau diếp cá, Khách sỉ
(15, 3, 10000), -- Rau diếp cá, Nhà hàng
(15, 4, 9500),  -- Rau diếp cá, Siêu thị
(16, 1, 13000), -- Củ cải trắng, Khách lẻ
(16, 2, 12500), -- Củ cải trắng, Khách sỉ
(16, 3, 12000), -- Củ cải trắng, Nhà hàng
(16, 4, 11500), -- Củ cải trắng, Siêu thị
(17, 1, 180000),-- Vịt xiêm, Khách lẻ
(17, 2, 170000),-- Vịt xiêm, Khách sỉ
(17, 3, 160000),-- Vịt xiêm, Nhà hàng
(17, 4, 150000),-- Vịt xiêm, Siêu thị
(18, 1, 35000), -- Thanh long ruột đỏ, Khách lẻ
(18, 2, 34000), -- Thanh long ruột đỏ, Khách sỉ
(18, 3, 33000), -- Thanh long ruột đỏ, Nhà hàng
(18, 4, 32000), -- Thanh long ruột đỏ, Siêu thị
(19, 1, 8000),  -- Rau húng quế, Khách lẻ
(19, 2, 7500),-- Rau húng quế, Khách sỉ
(19, 3, 7000),  -- Rau húng quế, Nhà hàng
(19, 4, 6500),  -- Rau húng quế, Siêu thị
(20, 1, 50000), -- Nấm linh chi, Khách lẻ
(20, 2, 49000), -- Nấm linh chi, Khách sỉ
(20, 3, 48000), -- Nấm linh chi, Nhà hàng
(20, 4, 47000), -- Nấm linh chi, Siêu thị
(21, 1, 22000), -- Hoa hướng dương, Khách lẻ
(21, 2, 21000), -- Hoa hướng dương, Khách sỉ
(21, 3, 20000), -- Hoa hướng dương, Nhà hàng
(21, 4, 19000); -- Hoa hướng dương, Siêu thị

-- Cập nhật unit_price và total_amount trong bảng Exports dựa trên ProductPrices
UPDATE Exports e
JOIN ProductPrices pp ON e.product_id = pp.product_id
JOIN Customers c ON e.customer_id = c.customer_id
SET e.unit_price = pp.unit_price, e.total_amount = e.quantity * pp.unit_price
WHERE pp.customer_type_id = c.customer_type_id;

-- Cập nhật order_total trong bảng Invoices

ALTER TABLE Exports
ADD COLUMN invoice_id INT,
ADD FOREIGN KEY (invoice_id) REFERENCES Invoices(invoice_id);

UPDATE Exports e
JOIN Invoices i ON e.customer_id = i.customer_id AND e.export_date = i.invoice_date
SET e.invoice_id = i.invoice_id
WHERE e.invoice_id IS NULL;

UPDATE Invoices i
SET i.order_total = (SELECT SUM(total_amount) FROM Exports WHERE invoice_id = i.invoice_id);

-- select * from Invoices