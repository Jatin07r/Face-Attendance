const login = document.querySelector('#login');
const invalidStudentId = document.querySelector('#invalid-sid');
const invalidPassword = document.querySelector('#invalid-password');
const databaseError = document.querySelector('#database-error');

login.addEventListener('submit', async function (event) {
    event.preventDefault();

    const student_id = document.querySelector('#sid').value.trim();
    const password = document.querySelector('#password').value.trim();

    try {
        const response = await fetch(`${window.location.origin}/sidlogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, password }),
            credentials: 'include'
        });

        const result = await response.json();

        if (!result.success && result.error === 'Invalid student id') {
            invalidStudentId.className = 'd-block text-primary';
            invalidPassword.className = 'd-none';
        }
        else if (!result.success && result.error === 'Invalid password') {
            invalidStudentId.className = 'd-none';
            invalidPassword.className = 'd-block text-primary';
        }
        else if (!result.success && result.error === 'Database error') {
            invalidStudentId.className = 'd-none';
            invalidPassword.className = 'd-none';
            databaseError.className = 'd-block text-center text-primary';
        }
        else if (result.success) {
            localStorage.setItem('loginSuccess', 'true');
            localStorage.setItem("role", "student");
            window.location.href = 'studentNavbar.html';
            history.pushState(null, null, 'studentNavbar.html');
            window.onpopstate = function () {
                history.go(1);
            };
        }
    } catch (error) {
        alert('An error occurred. Please check your connection and try again.');
    }
});
