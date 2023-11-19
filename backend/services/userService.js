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

// const authenticateUser = async (email, password) => {
//     try {
//         const [users] = await dbConnection.execute('SELECT * FROM user WHERE email=?', [email]);
//         if (users.length > 0) {
//             const user = users[0];
//             const isPasswordMatch = await bcrypt.compare(password, user.password);
//             if (isPasswordMatch) {
//                 return user;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };


// given a username, checks to see if it already exists in the database
const usernameAvailable = async (username) => {
  try {
    const query = 'SELECT COUNT(*) AS count FROM user WHERE username = ?';
    const [result] = await dbConnection.promise().query(query, [username]);

    // If the count is 0, the username is available; otherwise, it's already taken
    return result[0].count === 0;
  } catch (err) {
    console.error('Error checking username availability:', err);
    throw err;
  }
};

// given an email, checks to see if it already exists in the database
const emailAvailable = async (username) => {
  try {
    const query = 'SELECT COUNT(*) AS count FROM user WHERE email = ?';
    const [result] = await dbConnection.promise().query(query, [username]);

    // If the count is 0, the email is available; otherwise, it's already taken
    return result[0].count === 0;
  } catch (err) {
    console.error('Error checking email availability:', err);
    throw err;
  }
};

const getUsersByRole = async (role) => {
  try {
    const query = 'SELECT * FROM user WHERE role = ?';
    const [result] = await dbConnection.promise().query(query, [role]);
    return result;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

module.exports = {
    registerUser, usernameAvailable, emailAvailable, getUsersByRole //,authenticateUser
};
