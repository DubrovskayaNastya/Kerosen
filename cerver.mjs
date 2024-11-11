import express from 'express';
import sql from 'mssql';
import path from 'path';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const config = {
    user: 'roots',      // ваше имя пользователя
    password: 'Iwiwi2006pickme',   // ваш пароль
    server: 'localhost',       // адрес сервера
    database: 'kerosene',   // имя вашей базы данных
    options: {
        encrypt: true,           
        trustServerCertificate: true 
    }
};  

const JWT_SECRET_KEY = '2006';

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Определяем порт
const port = 3000;

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name , password: user.password},
        JWT_SECRET_KEY,
        { expiresIn: '1h' } // Токен будет действителен 1 час
    );
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Токен не предоставлен' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Неавторизованный доступ' });
        }
        req.user = decoded; // Сохраняем информацию о пользователе в объекте запроса
        next();
    });
};



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'kerosene.html'));
});

// Получение данных
app.get('/data', async (req, res) => {
    let connection;
    try {
        console.log('Connecting to the database...');
        connection = await sql.connect(config);
        
        const result = await connection.request().query('SELECT name, COUNT(*) as count FROM car GROUP BY name');
        console.log(result.recordset); // Log the result

        // Отправка результата как JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('Connection error:', err);
        res.status(500).send('Database connection error');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// Получение всех автомобилей
app.get('/products', async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(config);
        
        const result = await connection.request().query('SELECT * FROM car');
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение конкретного автомобиля по ID
app.get('/products/:id', async (req, res) => {   
    let connection;
    try {
        connection = await sql.connect(config); 
        const productId = req.params.id;

        const result = await connection.request()
            .input('id', sql.Int, productId) 
            .query('SELECT * FROM car WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        if (connection) {
            connection.close();
        }
    }
});

// Защищенные данные
app.get('/protected-data', verifyToken, (req, res) => {
    res.json({ data: 'Это защищенные данные', user: req.user});
});

// Проверка учетных данных
app.post('/check-credentials', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: "Логин и пароль обязательны" });
    }

    let connection;
    try {
        connection = await sql.connect(config);
        const query = `
            SELECT id, name, password FROM client 
            WHERE name = @name AND password = @password
        `;
        
        const request = connection.request();
        request.input('name', sql.VarChar, name);
        request.input('password', sql.VarChar, password);

        const result = await request.query(query);
        
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            console.log('Пользователь найден:', user);
            const token = generateToken(user);
            return res.json({ success: true, message: 'Авторизация успешна', token ,
                user:{name: user.name, password: user.password }});
        } else {
            return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// Регистрация нового пользователя
app.post('/register', async (req, res) => {
    const { username, password, phone, car, passport } = req.body;

    if (!username || !password || !phone || !car || !passport) {
        return res.status(400).json({ error: "Все поля обязательны для заполнения." });
    }

    let connection;
    try {
        connection = await sql.connect(config);

        // Проверка на существование пользователя
        const checkQuery = `
            SELECT COUNT(*) AS count FROM client
            WHERE name = @name OR passport = @passport OR car = @car
        `;
        const checkRequest = connection.request();
        checkRequest.input('name', sql.VarChar, username);
        checkRequest.input('passport', sql.VarChar, passport);
        checkRequest.input('car', sql.VarChar, car);

        const checkResult = await checkRequest.query(checkQuery);

        if (checkResult.recordset[0].count > 0) {
            return res.status(400).json({ error: "Пользователь уже существует." });
        }

        // Вставка нового пользователя
        const insertQuery = `
            INSERT INTO client (name, phone, car, passport, password)
            VALUES (@name, @phone, @car, @passport, @password)
        `;
        const insertRequest = connection.request();
        insertRequest.input('name', sql.VarChar, username);
        insertRequest.input('phone', sql.VarChar, phone);
        insertRequest.input('car', sql.VarChar, car);
        insertRequest.input('passport', sql.VarChar, passport);
        insertRequest.input('password', sql.VarChar, password);

        await insertRequest.query(insertQuery);

        // Получаем id пользователя после вставки
        const user = { username, id: insertRequest.parameters.name.value ,password};
        const token = generateToken(user);

        return res.json({ success: true, message: "Пользователь успешно зарегистрирован.", token,user:{name: user.name, password: user.password } });
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});



app.post('/add-review', async (req, res) => {
    const { name, reviews } = req.body; // Обратите внимание на изменение: теперь поле называется 'review'

    if (!name || !reviews) {
        return res.status(400).json({ error: 'Имя и отзыв обязательны.' });
    }

    let connection;
    try {
        connection = await sql.connect(config);

        // SQL-запрос для вставки данных
        const result = await connection.request()
            .input('name', sql.NVarChar, name)
            .input('reviews', sql.NVarChar, reviews) // Используем 'review' для соответствия переданным данным
            .query('INSERT INTO reviews (name, reviews) VALUES (@name, @reviews)');

        res.status(201).json({ message: 'Отзыв добавлен успешно' });
    } catch (error) {
        console.error('Ошибка при записи отзыва:', error);
        res.status(500).json({ error: 'Ошибка сервера при записи отзыва' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// Эндпойнт для получения всех отзывов
app.get('/get-reviews', async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(config);
        const result = await connection.request().query('SELECT name, reviews FROM reviews');
        
        res.json(result.recordset); // Возвращаем записи
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении отзывов' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});





app.listen(port, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
    } else {
        console.log(`Server running at http://127.0.0.1:${port}`);
    }
});
