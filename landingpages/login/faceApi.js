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

window.addEventListener('DOMContentLoaded', faceApi);