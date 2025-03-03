//import "./addRequire.js";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Thêm import path
const app = express();


//route
const routes = require("./routes/route"); // Import router từ routes.js

app.use(express.json()); // Sử dụng middleware json trước khi sử dụng router
app.use('/api', routes); //

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Đã xảy ra lỗi!');
});

app.use(cors());
app.use(bodyParser.json());

// Phục vụ các file tĩnh từ thư mục 'Views'
console.log(path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'Views')));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});