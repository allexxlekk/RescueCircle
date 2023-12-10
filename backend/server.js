const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const userService = require('./services/userService');
const bodyParser = require('body-parser');

const app = express();
// Use CORS middleware to allow requests from all origins
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use('/users', userRouter);
app.use('/categories', categoriesRouter)
app.use('/items', itemsRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Register Endpoint
app.post('/register', async (req, res) => {
    try {
        const newUser = req.body;

        // Validate password
        if (!isValidPassword(newUser.password)) {
            return res.status(400).send({ error: "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character." });
        }

        // Register User
        const message = await userService.registerUser(newUser);
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Authenticate user
        const authenticated = await userService.authenticateUser(email, password);

        if (!authenticated) {
            res.status(401).send("Bad credentials");
        } else {
            // Generate a JWT token
            const user = await userService.getUserByEmail(req.body.email);
            const token = await userService.generateJwtToken(user);

            // Send the token as a JSON response
            res.json({ token });
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Backend Server is running on http://localhost:${port}`);
});


function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    return regex.test(password);
}