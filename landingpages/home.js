document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector("#content");

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
    function loadContent(url, updateURL = true) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                content.innerHTML = html;
                if (updateURL) {
                    history.pushState({ page: url }, "", `?page=${url}`);
                }
                ScrollReveal().reveal('.animate', {
                    duration: 500,
                    origin: "bottom",
                    distance: "50px",
                    delay: 100,
                    easing: "ease-in-out",
                    viewFactor: 0.2,
                    reset: false
                });
            })
            .catch(error => {
                content.innerHTML = "<h2>404 - Page Not Found</h2>";
                console.error("Fetch error:", error);
            });
    }

    //Load the initial page
    loadContent("dashboard.html");
    document.querySelector(".nav-link").classList.add("active");
    document.body.classList.add("bg-light");

    // Event listener for navigation clicks
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            document.querySelectorAll(".nav-link").forEach(nav => nav.classList.remove("active"));
            const page = event.target.getAttribute("href");
            loadContent(page);
            link.classList.add("active");
        });
    });

    //Handle login buttons inside home page
    document.addEventListener("click", event => {
        if (event.target.id === "adminLogin") {
            event.preventDefault();
            loadContent("login/adminLogin.html");
        }
        if (event.target.id === "studentLogin") {
            event.preventDefault();
            loadContent("login/studentLogin.html");
        }
        if (event.target.id === "loginButtons") {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    });

    // Handle login buttons inside student login page
    document.addEventListener("click", event => {
        if (event.target.id === "sfLogin") {
            event.preventDefault();
            loadContent("login/sfLogin.html");
        }
        if (event.target.id === "sidLogin") {
            event.preventDefault();
            loadContent("login/sidLogin.html");
        }
    });

    // Store back/forward navigation data
    window.addEventListener("popstate", event => {
        if (event.state?.page) {
            loadContent(event.state.page, false);
        } else {
            loadContent("homePage.html", false);
        }
    });

    //Logout & Session destroy
    document.querySelector('#logout').addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('userType');
        alert('Logged out successfully');
        window.location.href = "/login.html";
    });
}); 