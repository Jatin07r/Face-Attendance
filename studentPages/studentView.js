const attendanceView = document.querySelector("#attendance-view");
async function fetchData() {
    try {
        const response = await fetch("http://localhost:3000/fetchStudentView", {
            method: "GET",
            withCredentials: true
        });
        const result = await response.json();
        console.log(result);
        displayData(result);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
function displayData(data) {
    const tbody = document.createElement("tbody");
    data.forEach(row => {
        const tr = `
                        <tr>
                            <td>${row.student_id}</td>
                            <td>${row.class_sem}</td>
                            <td>${row.subject_name}</td>
                            <td>${row.date}</td>
                            <td>${row.status.charAt(0).toUpperCase() + row.status.slice(1)}</td>
                        </tr>
                    `;
        tbody.innerHTML += tr;
    });
    attendanceView.appendChild(tbody);
}
document.addEventListener("DOMContentLoaded", fetchData);