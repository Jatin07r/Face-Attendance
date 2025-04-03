document.querySelector('#login').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    try {
        const response = await fetch('http://localhost:3000/alogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            sessionStorage.setItem('loggedInUser', email);
            sessionStorage.setItem('userType', 'admin');
            window.location.href = "/adminpages/adminNavbar.html";
        } else {
            alert(result.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please check your connection and try again.');
    }
});
