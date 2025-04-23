const video = document.querySelector('#sf');
function faceApi() {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition')
    ])
    .then(startCamera)
    .catch(err => {
        console.error('Error loading Face recognition models:', err);
        alert('Failed to load face recognition models. Please try again later.');
    });
}

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error('Webcam error:', err);
            alert('Unable to access the camera. Please allow camera permissions.');
        });
}

window.addEventListener('DOMContentLoaded', faceApi);