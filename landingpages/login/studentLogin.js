document.querySelector('#login').addEventListener('submit', async function (event) {
    event.preventDefault();

    // const student_face_id = document.querySelector('#sf').value;
    const student_id = document.querySelector('#sid').value.trim();
    const password = document.querySelector('#password').value.trim();

    try {
        const response = await fetch('http://localhost:3000/sidlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, password })
        });

        const result = await response.json();

        if (response.ok) {
            sessionStorage.setItem('loggedInUser', student_id);
            window.location.href = "/studentpages/studentNavbar.html";
        } else {
            alert(result.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please check your connection and try again.');
    }
});
