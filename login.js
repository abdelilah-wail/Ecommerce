// Show/Hide Password Functionality
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
});
// Redirect to Sign-Up Page
document.getElementById('signupButton').addEventListener('click', () => {
    window.location.href = 'sign-up.html'; // Path to your sign-up page
  });
// Basic Form Validation (Optional Enhancement)
document.getElementById('loginForm').addEventListener('submit', (e) => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    e.preventDefault();
    alert('Please fill in all fields.');
  } else if (!validateEmail(email)) {
    e.preventDefault();
    alert('Please enter a valid email address.');
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
