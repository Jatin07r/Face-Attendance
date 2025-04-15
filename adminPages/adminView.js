const attendanceView = document.querySelector("#attendance-view");
const studentId = document.querySelector("#student-id");
const studentName = document.querySelector("#student-name");
const classSem = document.querySelector("#class-sem");
const subjectName = document.querySelector("#subject-name");
const statusSelect = document.querySelector("#status");
const fromDate = document.querySelector("#from-date");
const toDate = document.querySelector("#to-date");
const filterButton = document.querySelector("#filter-button");

async function fetchData() {
    try {
        const response = await fetch("http://localhost:3000/fetchAdminView", {
            method: "GET",
            withCredentials: true
        });
        const result = await response.json();
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
    filterButton.addEventListener("click", () => {
        const studentID = studentId.value.trim();
        const studentsNames = studentName.value.trim().toLowerCase();
        const classSemester = classSem.value.trim().toLowerCase();
        const subject = subjectName.value.trim().toLowerCase();
        const status = statusSelect.value;
        const fromDateTime = new Date(fromDate.value);
        const toDateTime = new Date(toDate.value);
    
        const rows = document.querySelectorAll("tbody tr");
    
        rows.forEach(row => {
          const studentCell = row.children[0].textContent.toLowerCase();
          const studentNameCell = row.children[1].textContent.toLowerCase();
          const classSemCell = row.children[2].textContent.toLowerCase();
          const subjectCell = row.children[3].textContent.toLowerCase();
          const dateTimeText = row.children[4].textContent.trim();
          const statusCell = row.children[5].textContent.toLowerCase();
          const rowDate = new Date(dateTimeText);
    
          const show =
            (!studentID || studentCell.includes(studentID)) &&
            (!studentName || studentNameCell.includes(studentsNames)) &&
            (!classSemester || classSemCell.includes(classSemester)) &&
            (!subject || subjectCell.includes(subject)) &&
            (!fromDateTime.getTime() || rowDate >= fromDateTime) &&
            (!toDateTime.getTime() || rowDate <= toDateTime) &&
            (status === "All" || 
             (status === "present" && statusCell === "Present".toLowerCase()) || 
             (status === "absent" && statusCell === "Absent".toLowerCase()));
             row.style.display = show ? "" : "none";
            });
            const filterCollapse = bootstrap.Collapse.getOrCreateInstance(document.querySelector("#collapseFilter"));
            filterCollapse.hide();
      });
document.addEventListener("DOMContentLoaded", fetchData);