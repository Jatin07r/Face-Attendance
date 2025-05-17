async function fetchData() {
    try {
        const response = await fetch(`${window.location.origin}/fetchAdminView`, {
        method: "GET",
            withCredentials: true
        });
        const result = await response.json();
        displayData(result);
    } catch (error) {
        window.location.href = "/errorpages/500.html";
    }
}

function displayData(data) {
    const attendanceView = document.querySelector("#attendance-view");
    attendanceView.innerHTML = "";
    
    if (!data || data.length === 0) {
        attendanceView.innerHTML = `
            <p class="mt-5 text-center fs-5">*No attendance data available.</p>
        `;
        return;
    }
    
    const thead = document.createElement("thead");
    const th = `
    <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Class/Semester</th>
        <th>Subject</th>
        <th>Date/Time</th>
        <th>Status</th>
    </tr>`;
    thead.innerHTML = th;
    attendanceView.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach(row => {
        const tr = `
        <tr>
            <td>${row.student_id}</td>
            <td>${row.student_name}</td>
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

setTimeout(() => {
    fetchData();
}, 100);