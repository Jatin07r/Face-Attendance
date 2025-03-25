document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector("#content");

    // Function to load content dynamically
    function loadContent(url, updateURL = true) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                content.innerHTML = html;

                // Update URL only if requested
                if (updateURL) {
                    history.pushState({ page: url }, "", `?page=${url}`);
                }
            })
            .catch(error => {
                content.innerHTML = "<h2>404 - Page Not Found</h2>";
                console.error("Fetch error:", error);
            });
    }

    // Event listener for navigation clicks
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const page = event.target.getAttribute("href");
            loadContent(page);
        });

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

    // Handle back/forward navigation
    window.addEventListener("popstate", event => {
        if (event.state?.page) {
            loadContent(event.state.page, false); // Load from history
        } else {
            loadContent("home.html", false); // Load home if no history state
        }
    });
});
