// login.js

// Import user database (mock implementation - replace with actual import)
const userDB = {
    verifyUser: function(email, password) {
      const users = JSON.parse(localStorage.getItem('usersDB')) || [];
      const user = users.find(u => u.email === email);

      if (!user) return null;

      // Note: In production, compare hashed passwords
      if (user.password === password) {
        return user;
      }
      return null;
    }
  };

  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  const emailField = document.getElementById('email');
  const rememberMe = document.getElementById('rememberMe');
  const signupButton = document.getElementById('signupButton');

  // Show/Hide Password Functionality
  togglePassword.addEventListener('click', () => {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  // Redirect to Sign-Up Page
  signupButton.addEventListener('click', () => {
    window.location.href = 'sign-up.html';
  });

  // Email Validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
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
  emailField.addEventListener('input', () => {
    if (!validateEmail(emailField.value)) {
      showError(emailField, 'Please enter a valid email address');
    } else {
      clearError(emailField);
    }
  });

  // Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const remember = rememberMe.checked;

    // Validate fields
    let isValid = true;

    if (!validateEmail(email)) {
      showError(emailField, 'Please enter a valid email address');
      isValid = false;
    }

    if (password.length === 0) {
      showError(passwordField, 'Please enter your password');
      isValid = false;
    }

    if (!isValid) return;

    try {
      // Verify user credentials
      const user = await userDB.verifyUser(email, password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Store user session
      if (remember) {
        // Store in localStorage for persistent login
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          email: user.email,
          username: user.username
        }));
      } else {
        // Store in sessionStorage for session-only login
        sessionStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          email: user.email,
          username: user.username
        }));
      }

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
      successMessage.textContent = 'Login successful! Redirecting...';

      // Insert success message
      loginForm.prepend(successMessage);

      // Redirect to home page after 1 second
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

    } catch (error) {
      // Handle errors
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
      errorMessage.textContent = error.message;
      loginForm.prepend(errorMessage);
    }
  });

  // Check for remembered login
  document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (currentUser) {
      // Auto-fill email if remembered
      const user = JSON.parse(currentUser);
      emailField.value = user.email;
      rememberMe.checked = true;
    }
  });
