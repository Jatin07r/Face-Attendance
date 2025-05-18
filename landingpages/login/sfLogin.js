const verifyButton = document.querySelector('#verify');

async function verifyFace() {
    const video = document.querySelector('#sf');
    const invalidStudentSf = document.querySelector('#invalid-sf');
    const ins = document.querySelector('#instructions');
    const databaseError = document.querySelector('#database-error');
    verifyButton.disabled = true;
    try {
        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            ins.className ='d-block text-danger';
            databaseError.className = 'd-none';
            invalidStudentSf.className = 'd-none';
            return;
        }


        const descriptor = Array.from(detection.descriptor);

        const response = await fetch(`${window.location.origin}/sflogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_face: descriptor }) 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if(!result.success && (result.error === 'No matching face found' || result.error === 'Parsing error')) {
            invalidStudentSf.className = 'form-label text-danger';
            invalidStudentSf.textContent = '*No Matching Face Found';
            databaseError.className = 'd-none';
            ins.className = 'd-none';
        }  
        else if (!result.success && result.error === 'Database error') {
            invalidStudentSf.className = 'd-none';
            ins.className = 'd-none';
            databaseError.className = 'd-block text-center text-primary';
        }
        else if (result.success) { 
            localStorage.setItem('loginSuccess', 'true'); 
            localStorage.setItem("role", "student");
            window.location.href = '/studentNavbar.html';
            history.pushState(null, null, '/studentNavbar.html');
            window.onpopstate = function () {
                history.go(1);
            };
        } 
    } catch (error) {
        console.error('Error during face recognition:', error);
    } finally {
        verifyButton.disabled = false;
    }
}

// Add event listener to the verify button
verifyButton.addEventListener('click', (event) => {     
    event.preventDefault();   
    verifyFace();
});