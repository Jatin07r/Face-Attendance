const invalidStudentSf = document.querySelector('#invalid-sf');
const ins = document.querySelector('#instructions');
const databaseError = document.querySelector('#database-error');
const addButton = document.querySelector('#add');

async function addAttendance() {
    addButton.disabled = true;
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

        const response = await fetch('http://localhost:3000/sflogin', {
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
        else if (result.success) { sessionStorage.setItem('addSuccess', 'true')} 
   
    } catch (error) {
        console.error('Error during face recognition:', error);
    } finally {
        addButton.disabled = false;
    }
}

// Add event listener to the verify button
addButton.addEventListener('click', (event) => {     
    event.preventDefault();   
    addAttendance();
});