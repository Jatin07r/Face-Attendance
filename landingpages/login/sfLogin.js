const login = document.querySelector('#login');
const invalidStudentSf = document.querySelector('#invalid-sf');
const ins = document.querySelector('#instructions')
const databaseError = document.querySelector('#database-error');

const video = document.getElementById('sf');
navigator.mediaDevices.getUserMedia({ video: true })
 .then((stream) => {
   video.srcObject = stream;
 })
 .catch((err) => {
   console.error('Webcam error:', err);
   alert('Unable to access camera. Please allow permission.');
 });
 
login.addEventListener('submit', async function (event) {
    event.preventDefault();

    const student_fid = document.querySelector('#fid').value;
     try {
        const response = await fetch('http://localhost:3000/sflogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({student_fid}),
            credentials: 'include'
        });

        const result = await response.json();

        if (!result.success && result.error === 'Match Not Found') {
            invalidStudentSf.className = 'form-label text-danger';
            invalidStudentSf.textContent = `*Face not recognized.`;
            ins.className = 'd-block text-muted';
        }
        else if(!result.success && result.error === 'Database error') {
            invalidStudentSf.className = 'd-none';
            databaseError.className = 'd-block text-center text-primary';
        } 
        else if(result.success) {     
        sessionStorage.setItem("loginSuccess", "true");
        window.location.href = '/studentpages/studentNavbar.html';
        }
    } catch (error) {
        alert('An error occurred. Please check your connection and try again.');
    }
});
