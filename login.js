document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('dbAdmin')) {
        localStorage.setItem('dbAdmin', JSON.stringify(dbAdmin));
    }

    checkExistingSession();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const inputs = document.querySelectorAll('#email, #password');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const existingError = input.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
                input.classList.remove('border-red-500');
            }
        });
    });

    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    function showError(element, message) {
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red-500 text-xs mt-1';
        errorElement.textContent = message;

        const existingError = element.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }

        element.insertAdjacentElement('afterend', errorElement);
        element.classList.add('border-red-500');

        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
                element.classList.remove('border-red-500');
            }
        }, 1000);
    }

    //! hide/show
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('toggle-password');

    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', function () {
            const isPasswordVisible = passwordInput.type === 'text';
            passwordInput.type = isPasswordVisible ? 'password' : 'text';
            togglePasswordButton.textContent = isPasswordVisible ? 'Show' : 'Hide';
        });
    }
    
    async function handleLogin(e) {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = document.getElementById('remember-me').checked;

        try {
            const dbAdminData = JSON.parse(localStorage.getItem('dbAdmin'));
            if (!dbAdminData || !dbAdminData.admins) {
                showError(emailInput, 'Admin database is not available.');
                return;
            }

            const admin = dbAdminData.admins.find(admin => admin.email === email);

            if (!admin || password !== admin.password) {
                const errorNotification = document.createElement('div');
                errorNotification.className = 'notification bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
                errorNotification.textContent = 'Invalid email or password';
                notificationContainer.appendChild(errorNotification);

                setTimeout(() => {
                    if (errorNotification.parentNode) {
                        errorNotification.remove();
                    }
                }, 1000);
                return;
            }
            //! active/blocked
            if (admin.status !== 'active') {
                showError(emailInput, 'Your account is not active. Please contact the super admin.');
                return;
            }

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('adminLoggedIn', 'true');
            storage.setItem('adminId', admin.id.toString());
            storage.setItem('adminName', admin.name);
            storage.setItem('adminRole', admin.role);

            const adminIndex = dbAdminData.admins.findIndex(a => a.id === admin.id);
            if (adminIndex !== -1) {
                dbAdminData.admins[adminIndex].lastLogin = new Date().toISOString();
                localStorage.setItem('dbAdmin', JSON.stringify(dbAdminData));
            }

            const successNotification = document.createElement('div');
            successNotification.className = 'notification bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
            successNotification.textContent = 'Login successful! Redirecting...';
            notificationContainer.appendChild(successNotification);

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } catch (error) {
            const errorNotification = document.createElement('div');
            errorNotification.className = 'notification bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
            errorNotification.textContent = error.message;
            notificationContainer.appendChild(errorNotification);

            setTimeout(() => {
                if (errorNotification.parentNode) {
                    errorNotification.remove();
                }
            }, 1000);
        }
    }

    //! password 
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();

            const email = prompt('Please enter your email address to reset your password:');
            if (email) {
                alert(`A password reset link has been sent to ${email}. Please check your inbox.`);
            } else {
                alert('Email address is required to reset your password.');
            }
        });
    }
});

function checkExistingSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    const adminId = localStorage.getItem('adminId') || sessionStorage.getItem('adminId');

    if (isLoggedIn && adminId) {
        window.location.href = 'dashboard.html';
    }
}