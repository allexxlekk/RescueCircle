const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/users');
const adminWarehouseManagementRouter = require('./routes/admin/wareHouseManagement')
const adminInventoryStatusRouter = require('./routes/admin/inventoryStatus')
const adminRescuerManagementRouter = require('./routes/admin/rescuerManagement')
const adminOverviewRouter = require('./routes/admin/overview')
const rescuersRouter = require('./routes/rescuers');
const offersRouter = require('./routes/offers');
const statisticsRouter = require('./routes/admin/statistics');
const rescuerRouter = require('./routes/rescuerBusiness');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const requestsRouter = require('./routes/requests');
const announcementsRouter = require('./routes/announcements');
const userService = require('./services/userService');
const locationService = require('./services/locationService');
const bodyParser = require('body-parser');
const path = require('path');
const authenticateToken = require('./middleware/auth')
const cookieParser = require('cookie-parser');

const app = express();
// Use CORS middleware to allow requests from all origins
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 3000;

app.use('/users', userRouter);
app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);
app.use('/requests', requestsRouter);
app.use('/announcements', announcementsRouter);
app.use('/rescuers', rescuersRouter);
app.use('/rescuer', rescuerRouter);
app.use('/offers', offersRouter);
app.use('/admin/warehouse-management', adminWarehouseManagementRouter);
app.use('/admin/statistics', statisticsRouter);
app.use('/admin/inventory-status', adminInventoryStatusRouter);
app.use('/admin/rescuer-management', adminRescuerManagementRouter);
app.use('/admin/overview', adminOverviewRouter);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/login');
});

app.get('/', authenticateToken, (req, res) => {
    if (!req.authenticated) {
        return res.redirect('/login');
    }

    // User is authenticated, redirect based on role
    switch (req.user.role) {
        case 'ADMIN':
            res.redirect('/admin/overview');
            break;
        case 'CITIZEN':
            res.redirect('/citizen/requests');
            break;
        default:
            res.redirect('/rescuer');
    }
});

app.get('/citizen/requests', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'CITIZEN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/citizen/requests/requests.html'));

});

app.get('/rescuer', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'RESCUER') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/rescuer/rescuer.html'));

});

app.get('/citizen/offers', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'CITIZEN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/citizen/offers/offers.html'));

});

app.get('/admin/overview', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'ADMIN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/admin/overview/overview.html'));

});

app.get('/admin/warehouse-management', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'ADMIN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/admin/warehouse-management/warehouse-management.html'));

});

app.get('/admin/inventory-status', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'ADMIN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/admin/inventory-status/inventory-status.html'));

});

app.get('/admin/rescuer-management', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'ADMIN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/admin/rescuer-management/rescuer-management.html'));

});

app.get('/admin/statistics', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'ADMIN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/admin/statistics/statistics.html'));

});


app.get('/admin/announcement-management', authenticateToken, (req, res) => {
    if (!req.authenticated || req.user.role !== 'ADMIN') {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../frontend/admin/announcement-management/announcement-management.html'));

});

// Register Endpoint
app.post('/register', async (req, res) => {
    try {
        const newUser = req.body;

        // Validate password
        if (!isValidPassword(newUser.password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
            });
        }

        // Register User
        const message = await userService.registerUser(newUser);

        // If registration is successful, redirect to login
        res.status(201).json({
            message: message,
            redirect: '/login'
        });
    } catch (err) {
        // If there's an error (e.g., user already exists), send an error response
        res.status(500).json({error: err.message});
    }
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/citizen/register/register.html'));
});

app.get('/login', authenticateToken, (req, res) => {
    if (req.authenticated) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../frontend/login/login.html'));
});


app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Authenticate user
        const authenticated = await userService.authenticateUser(email, password);

        if (!authenticated) {
            return res.status(401).json({message: "Bad credentials"});
        }

        // Get user details
        const user = await userService.getUserByEmail(email);

        // Generate a JWT token
        const token = await userService.generateJwtToken(user);

        // Set the token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 24 hours
        });


        // Send response with redirect URL
        res.status(200).json({
            message: 'Authentication successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token: token // Including token for debugging
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal server error", error: err.message});
    }
});


app.listen(port, () => {
    console.log(`Backend Server is running on http://localhost:${port}`);
});


app.get('/baseLocation', async (req, res) => {
    res.send(await locationService.baseLocation());
});

function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    return regex.test(password);
}
