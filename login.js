
// Import user database (mock implementation - replace with actual import)
const userDB = {
    verifyUser: function (email, password) {
      const users = JSON.parse(localStorage.getItem("usersDB")) || [];
      const user = users.find((u) => u.email === email);

      if (!user) return null;

      // Note: In production, compare hashed passwords
      if (user.password === password) {
        return user;
      }
      return null;
    },
  };

  // Create notification container
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'notification-container fixed top-4 right-4 z-50 space-y-2';
  document.body.appendChild(notificationContainer);

  // DOM Elements
  const loginForm = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  const emailField = document.getElementById("email");
  const rememberMe = document.getElementById("rememberMe");
  const signupButton = document.getElementById("signupButton");

  // Show/Hide Password Functionality
  togglePassword.addEventListener("click", () => {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "Show" : "Hide";
  });

  // Redirect to Sign-Up Page
  signupButton.addEventListener("click", () => {
    window.location.href = "sign-up.html";
  });

  // Email Validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Display Error Message (for inline form errors)
  function showError(element, message) {
    const errorElement = document.createElement("p");
    errorElement.className = "error-message text-red-500 text-xs mt-1";
    errorElement.textContent = message;

    // Remove existing error if any
    const existingError = element.nextElementSibling;
    if (existingError && existingError.classList.contains("error-message")) {
      existingError.remove();
    }

    element.insertAdjacentElement("afterend", errorElement);
    element.classList.add("border-red-500");

    // Remove error after 1 second
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
        element.classList.remove("border-red-500");
      }
    }, 1000);
  }

  // Clear Error Message
  function clearError(element) {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.remove();
    }
    element.classList.remove("border-red-500");
  }

  // Show Notification (for top-right notifications)
  function showNotification(message, type = 'error') {
    const notification = document.createElement("div");
    notification.className = `notification px-4 py-2 rounded shadow-lg animate-fade-in ${
      type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
    }`;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 1000);
  }

  // Real-time Validation
  emailField.addEventListener("input", () => {
    if (!validateEmail(emailField.value)) {
      showError(emailField, "Please enter a valid email address");
    } else {
      clearError(emailField);
    }
  });

  // Form Submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const remember = rememberMe.checked;

    // Validate fields
    let isValid = true;

    if (!validateEmail(email)) {
      showError(emailField, "Please enter a valid email address");
      isValid = false;
    }

    if (password.length === 0) {
      showError(passwordField, "Please enter your password");
      isValid = false;
    }

    if (!isValid) return;

    try {
      // Verify user credentials
      const user = await userDB.verifyUser(email, password);

      if (!user) {
        showNotification("Invalid email or password", 'error');
        return;
      }

      // Store user session
      if (remember) {
        // Store in localStorage for persistent login
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            username: user.username,
          })
        );
      } else {
        // Store in sessionStorage for session-only login
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            username: user.username,
          })
        );
      }

      // Show success message
      showNotification("Login successful! Redirecting...", 'success');

      // Get return URL from query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');

      // Redirect to return URL or home page after 1 second
      setTimeout(() => {
        window.location.href = returnUrl ? decodeURIComponent(returnUrl) : "index.html";
      }, 1000);
    } catch (error) {
      // Handle errors
      showNotification(error.message, 'error');
    }
  });

  // Check for remembered login
  document.addEventListener("DOMContentLoaded", () => {
    const currentUser =
      localStorage.getItem("currentUser") ||
      sessionStorage.getItem("currentUser");

    if (currentUser) {
      // Auto-fill email if remembered
      const user = JSON.parse(currentUser);
      emailField.value = user.email;
      rememberMe.checked = true;
    }
  });
