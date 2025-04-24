// signup.js

// Import the user database functions
// Note: For browser implementation, you might need to use modules or combine files
const userDB = {
    // Mock implementation - replace with actual users-database.js import
    createUser: function(userData) {
      const users = JSON.parse(localStorage.getItem('usersDB')) || [];

      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('usersDB', JSON.stringify(users));
      return newUser;
    }
  };

  // DOM Elements
  const signupForm = document.getElementById('signupForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  const usernameField = document.getElementById('username');
  const emailField = document.getElementById('email');
  const phoneField = document.getElementById('phone');

  // Show/Hide Password Functionality
  togglePassword.addEventListener('click', () => {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  // Form Validation Helpers
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validateUsername(username) {
    return username.length >= 3;
  }

  // Display Error Message
  function showError(element, message) {
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message text-red-500 text-xs mt-1';
    errorElement.textContent = message;

    // Remove existing error if any
    const existingError = element.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
      existingError.remove();
    }

    element.insertAdjacentElement('afterend', errorElement);
    element.classList.add('border-red-500');
  }

  // Clear Error Message
  function clearError(element) {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
    element.classList.remove('border-red-500');
  }

  // Real-time Validation
  usernameField.addEventListener('input', () => {
    if (!validateUsername(usernameField.value)) {
      showError(usernameField, 'Username must be at least 3 characters');
    } else {
      clearError(usernameField);
    }
  });

  emailField.addEventListener('input', () => {
    if (!validateEmail(emailField.value)) {
      showError(emailField, 'Please enter a valid email address');
    } else {
      clearError(emailField);
    }
  });

  phoneField.addEventListener('input', () => {
    if (!validatePhone(phoneField.value)) {
      showError(phoneField, 'Please enter a valid phone number (10-15 digits)');
    } else {
      clearError(phoneField);
    }
  });

  passwordField.addEventListener('input', () => {
    if (!validatePassword(passwordField.value)) {
      showError(passwordField, 'Password must be at least 6 characters');
    } else {
      clearError(passwordField);
    }
  });

  // Form Submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const username = usernameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();
    const password = passwordField.value.trim();

    // Validate all fields
    let isValid = true;

    if (!validateUsername(username)) {
      showError(usernameField, 'Username must be at least 3 characters');
      isValid = false;
    }

    if (!validateEmail(email)) {
      showError(emailField, 'Please enter a valid email address');
      isValid = false;
    }

    if (!validatePhone(phone)) {
      showError(phoneField, 'Please enter a valid phone number (10-15 digits)');
      isValid = false;
    }

    if (!validatePassword(password)) {
      showError(passwordField, 'Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    try {
      // Create new user
      const newUser = await userDB.createUser({
        username,
        email,
        phone,
        password // Note: In production, hash this password first
      });

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
      successMessage.innerHTML = `
        <strong>Success!</strong> Account created successfully.
        <p>Redirecting to login page...</p>
      `;

      // Insert success message
      signupForm.prepend(successMessage);

      // Clear form
      signupForm.reset();

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

    } catch (error) {
      // Handle errors (like duplicate email)
      if (error.message.includes('Email already registered')) {
        showError(emailField, 'This email is already registered');
      } else {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorMessage.textContent = `Error: ${error.message}`;
        signupForm.prepend(errorMessage);
      }
    }
  });

  // Initialize the users database if empty
  if (!localStorage.getItem('usersDB')) {
    localStorage.setItem('usersDB', JSON.stringify([]));
  }
