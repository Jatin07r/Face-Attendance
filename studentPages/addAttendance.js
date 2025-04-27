
async function addAttendance() {
    const video = document.querySelector('#sf');
    const addButton = document.querySelector('#add');
    const subName = document.querySelector('#sub-name');
    const incorrectSubName = document.querySelector('#incorrect-sub-name');
    const invalidStudentSf = document.querySelector('#invalid-sf');
    const ins = document.querySelector('#instructions');
    const databaseError = document.querySelector('#database-error');
    addButton.disabled = true;
    try {
        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

            // Validate subject name input
            if (subName.value.trim() === '') {
                incorrectSubName.textContent = '*Enter Subject Name';
                incorrectSubName.className = 'form-label text-danger';
                addButton.disabled = false;
                return;
            } else {
                incorrectSubName.className = 'd-none';
            }

        if (!detection) {
            ins.className = 'd-block text-danger';
            databaseError.className = 'd-none';
            invalidStudentSf.className = 'd-none';
            addButton.disabled = false;
            return;
        }


        const descriptor = Array.from(detection.descriptor);

        // Send face descriptor to the server for verification
        const response = await fetch('/sflogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_face: descriptor })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success && (result.error === 'No matching face found' || result.error === 'Parsing error')) {
            invalidStudentSf.className = 'form-label text-danger';
            invalidStudentSf.textContent = '*No Matching Face Found';
            databaseError.className = 'd-none';
            ins.className = 'd-none';
        } else if (!result.success && result.error === 'Database error') {
            invalidStudentSf.className = 'd-none';
            databaseError.className = 'd-block text-center text-primary';
            ins.className = 'd-none';
        } else if (result.success) {
            // Prepare data for adding attendance
            const subjectName = subName.value.trim().toLowerCase();
            const now = new Date();
            const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            const dateTime = `${date} ${time}`;

            const add = await fetch('/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: result.student_id,
                    subject_name: subjectName,
                    status: 'Present',
                    date_time: dateTime
                })
            });

            const addResult = await add.json();

            if (!addResult.success && addResult.error === 'Incorrect subject name') {
                incorrectSubName.textContent = '*Incorrect Subject Name';
                incorrectSubName.className = 'form-label text-danger';
            } else if (addResult.success) {
                showToast('Attendance added successfully','primary')
                subName.value = '';
                incorrectSubName.className = 'd-none';
                ins.className = 'd-none';
                invalidStudentSf.className = 'd-none';
                databaseError.className = 'd-none';
            }
        }
    } catch (error) {
        console.error('Error during attendance process:', error);
        alert('An error occurred. Please try again.');
    } finally {
        addButton.disabled = false;
    }
}

// Add event listener to the add button
document.querySelector('#add-attendance').addEventListener('submit', (event) => {
    event.preventDefault();
    addAttendance();
});