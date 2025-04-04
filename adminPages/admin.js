async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/adminFetchData');
        const data = response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

window.addEventListener("DOMContentLoaded", fetchData);
