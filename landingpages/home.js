document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector("#content");
  let cameraStream = null;

  // Navbar blur effect
  window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    if (window.scrollY > 10) {
      navbar.classList.add("navbar-blur");
    } else {
      navbar.classList.remove("navbar-blur");
    }
  });

  // Function to load content dynamically
  async function loadContent(url, updateURL = true) {
    try {
      stopCamera();

      const response = await fetch(url);
      if (!response.ok) { window.location.href = "404.html"; };

      const html = await response.text();
      content.innerHTML = html;
      setTimeout(() => { scriptToLoad(url); }, 50);

      //Camera initilized
      if (url === "login/sfLogin.html" || url === "addAttendance.html") {
        startCamera();
      }

      if (updateURL) {
        history.pushState({ page: url }, "", `?page=${url}`);
      }

      ScrollReveal().reveal(".animate", {
        duration: 500,
        origin: "bottom",
        distance: "50px",
        delay: 100,
        easing: "ease-in-out",
        viewFactor: 0.2,
        reset: false
      });

    } catch (error) {
      const serverError = await fetch("500.html");
      document.querySelector(".nav-link").classList.remove("active");
      const serverHtml = await serverError.text();
      content.innerHTML = serverHtml;
      console.error("Fetch error:", error);
    }
  }

  //Load the initial page
  if(localStorage.getItem("role") === "admin"){
    loadContent("admin.html");
    localStorage.removeItem("role");
  } else if(localStorage.getItem("role") === "student"){
    loadContent("student.html");
    localStorage.removeItem("role");
  } else 
  loadContent("dashboard.html");
  
  document.querySelector(".nav-link").classList.add("active");
  document.body.classList.add("bg-light");
  
  //Camera initialization
  function startCamera() {
    const video = document.querySelector("#sf");
    if (!video) {
      console.error("Video element not found");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        cameraStream = stream;
        video.srcObject = stream;
        video.play();
        faceApi();
      })
      .catch((err) => {
        console.error("Camera initialization failed:", err);
        if (err.name === "NotAllowedError") {
          alert("Camera access denied. Please allow camera permissions.");
        } else if (err.name === "NotFoundError") {
          alert("No camera found on this device.");
        }
      });
  }

  //Provoke"s camera permission 
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
  }

  //Add script tag in login pages
  function scriptToLoad(url) {
    const scriptsMap = {
      "login/adminLogin.html": ["login/adminLogin.js"],
      "login/sidLogin.html": ["login/sidLogin.js"],
      "login/sfLogin.html": ["https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js", "login/sfLogin.js"],
      "dashboard.html": ["home.js"],
      "admin.html": ["admin.js"],
      "student.html": ["student.js"],
      "adminView.html": ["adminView.js"],
      "downloadAttendance.html": ["downloadAttendance.js", "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"],
      "studentView.html": ["studentView.js"],
      "addAttendance.html": ["https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js", "addAttendance.js"]
    }

    document.querySelectorAll("script[data-dynamic='true']").forEach(script => script.remove());
    const scriptsLoad = scriptsMap[url] || [];
    scriptsLoad.forEach(src => {
      const script = document.createElement("script");
      script.src = src;
      script.dataset.dynamic = "true";
      document.body.appendChild(script);
    });
  }


  // Event listener for navbar clicks
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      navLinks.forEach(nav => nav.classList.remove("active"));
      const page = link.getAttribute("href");
      if (!page) return;
      loadContent(page);
      scriptToLoad(page);
      link.classList.add("active");
    });
  });

  //Handle login buttons
  document.addEventListener("click", event => {
    const hp = document.querySelector("#hp");
    if (event.target.id === "adminLogin") {
      event.preventDefault();
      hp.classList.remove("active")
      const al = document.querySelector("#al");
      al.classList.add("active");
      loadContent("login/adminLogin.html");
    }
    if (event.target.id === "studentLogin") {
      event.preventDefault();
      hp.classList.remove("active")
      const sl = document.querySelector("#sl");
      sl.classList.add("active");
      loadContent("login/studentLogin.html");
    }
    if (event.target.id === "sfLogin") {
      event.preventDefault();
      sl.classList.add("active");
      event.target.classList.add("active");
      loadContent("login/sfLogin.html");
    }
    if (event.target.id === "sidLogin") {
      event.preventDefault();
      sl.classList.add("active");
      loadContent("login/sidLogin.html");
    }
    if (event.target.id === "loginButtons") {
      event.preventDefault();
      hp.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Store back/forward navigation data
  window.addEventListener("popstate", () => {
    const page = new URLSearchParams(window.location.search).get("page");

    if (page) {
      loadContent(page, false);
      document.querySelectorAll(".nav-link").forEach(nav => {
        nav.classList.remove("active");
        if (nav.getAttribute("href") === page) {
          nav.classList.add("active");
        }
      });
    }
  });

  // Navbar blur effect
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    if (window.scrollY > 10) {
      navbar.classList.add("navbar-blur");
    } else {
      navbar.classList.remove("navbar-blur");
    }
  });
});

function faceApi() {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition")
    ])
    .catch(err => {
        console.error("Error loading Face recognition models:", err);
        showToast("Error loading Face recognition models","danger");
      });
}