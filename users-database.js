// users-database.js

// Initialize users database if it doesn't exist
const initializeUsersDB = () => {
    if (!localStorage.getItem('usersDB')) {
      const initialUsers = [
        {
          id: 'u1',
          username: 'admin',
          email: 'admin@example.com',
          phone: '1234567890',
          password: 'admin123', // Note: In production, never store plain text passwords
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('usersDB', JSON.stringify(initialUsers));
    }
  };

  // Get all users
  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('usersDB')) || [];
  };

  // Get user by ID
  const getUserById = (userId) => {
    const users = getAllUsers();
    return users.find(user => user.id === userId);
  };

  // Get user by email
  const getUserByEmail = (email) => {
    const users = getAllUsers();
    return users.find(user => user.email === email);
  };

  // Create new user
  const createUser = (userData) => {
    const users = getAllUsers();

    // Check if user already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'customer', // Default role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(users));
    return newUser;
  };

  // Update user
  const updateUser = (userId, updateData) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Prevent email duplication
    if (updateData.email && users.some(user => user.email === updateData.email && user.id !== userId)) {
      throw new Error('Email already in use by another account');
    }

    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    localStorage.setItem('usersDB', JSON.stringify(users));
    return updatedUser;
  };

  // Delete user
  const deleteUser = (userId) => {
    const users = getAllUsers();
    const filteredUsers = users.filter(user => user.id !== userId);

    if (users.length === filteredUsers.length) {
      throw new Error('User not found');
    }

    localStorage.setItem('usersDB', JSON.stringify(filteredUsers));
    return true;
  };

  // Verify user credentials
  const verifyUser = (email, password) => {
    const user = getUserByEmail(email);
    if (!user) return null;

    // Note: In production, you should compare hashed passwords
    if (user.password === password) {
      return user;
    }
    return null;
  };

  // Initialize database when this file loads
  initializeUsersDB();

  // Export the functions
  export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    verifyUser
  };
