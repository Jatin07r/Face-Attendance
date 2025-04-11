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
    async function loadContent(url, updateURL = true) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Page not found");

        const html = await response.text();
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

      } catch (error) {
        content.innerHTML = "<h2>404 - Page Not Found</h2>";
        console.error("Fetch error:", error);
      }
    }

    //Load the initial page
    loadContent("dashboard.html");
    document.querySelector(".nav-link").classList.add("active");
    document.body.classList.add("bg-light");

    //Add script tag on login pages
    function scriptToLoad() {
      const scriptsLoad = [
        "login/adminLogin.js",
        "login/studentLogin.js"
      ]
      scriptsLoad.forEach(src => {
        const script = document.createElement("script");
        script.src = src;
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
        scriptToLoad();
        link.classList.add("active");
      });
    });

    //Handle login buttons
    document.addEventListener("click", event => {
      const hp = document.getElementById("hp");
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      scriptToLoad();
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

    //Logout
    const logout = document.querySelector('#logout')
    logout.addEventListener('click', () => {
      window.location.href = "/landingpages/homeNavbar.html";
    });
  }); 