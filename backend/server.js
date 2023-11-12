const express = require('express');
const userRouter = require('./routes/users');
const userService = require('./services/userService');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Register Endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate password
        if (!isValidPassword(password)) {
            return res.status(400).send({ error: "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character." });
        }

        // Register User
        const message = await userService.registerUser(username, email, password);
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Authenticate user
//         const user = await userService.authenticateUser(email, password);

//         // TODO: Create JWT Security Token
//         if (!user) {
//             res.status(401).send("Bad credentials");
//         } else {
//             res.status(200).send("Logged in as user: " + user.username);
//         }

//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

app.listen(port, () => {
    console.log(`Backend Server is running on http://localhost:${port}`);
});


function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    return regex.test(password);
}