const bcrypt = require('bcrypt');
const dbConnection = require('../config/db');


const registerUser = async (username, email, password) => {
    try {
      // Encrypt Password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
      await dbConnection.promise().query(query, [username, email, hashedPassword]);
  
      return 'User registered successfully';
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error (email or username already exists)
        console.error('Duplicate entry:', err.message);
        throw new Error('User with the same email or username already exists.');
      } else {
        // Handle other database errors
        console.error('Error registering user:', err);
        throw err;
      }
    }
  };

module.exports = {
    registerUser
};

const authenticateUser = async (email, password) => {
    try {
        const [users] = await dbConnection.execute('SELECT * FROM user WHERE email=?', [email]);
        if (users.length > 0) {
            const user = users[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
    registerUser, authenticateUser
};
