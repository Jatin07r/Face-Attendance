const login = document.querySelector('#login');
const invalidEmail = document.querySelector('#invalid-email');
const invalidPassword = document.querySelector('#invalid-password');
const databaseError = document.querySelector('#database-error');

login.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    try {
        const response = await fetch(`${window.location.origin}/alogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const result = await response.json();

        if (!result.success && result.error === 'Invalid email') {
            invalidEmail.className = 'd-block text-primary';
            invalidPassword.className = 'd-none';
        }
        else if (!result.success && result.error === 'Invalid password') {
            invalidEmail.className = 'd-none';
            invalidPassword.className = 'd-block text-primary';
        }
        else if (!result.success && result.error === 'Database error') {
            invalidEmail.className = 'd-none';
            invalidPassword.className = 'd-none';
            databaseError.className = 'd-block text-center text-primary';
        }
        else if (result.success) {
            localStorage.setItem('loginSuccess', 'true');
            localStorage.setItem('role', 'admin');
            window.location.href = '/adminpages/adminNavbar.html';

            history.pushState(null, null, '/adminpages/adminNavbar.html');
            window.onpopstate = function () {
                history.go(1);
            };
        }
    } catch (error) {
        alert('An error occurred. Please check your connection and try again.');
    }
});
