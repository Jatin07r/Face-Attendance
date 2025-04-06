async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/studentFetchData');
        const result = await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

window.addEventListener("DOMContentLoaded", fetchData);
