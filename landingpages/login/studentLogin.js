document.querySelector('#login').addEventListener('submit', async function(event) {
    event.preventDefault();

    const student_id = document.querySelector('#sid').value;
    const password = document.querySelector('#password').value;

    const response = await fetch('http://localhost:3000/slogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id, password })
    });

    const result = await response.json();

    if (response.ok) {
        alert('login succesfull');
    } else {
        alert(result.error);
    }
});