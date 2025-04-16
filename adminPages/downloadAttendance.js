async function fetchData() {
    try {
        const response = await fetch("http://localhost:3000/downloadAttendance", {
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
    const downloadAttendance = document.querySelector("#download-attendance");
    downloadAttendance.innerHTML = "";
    
    if (!data || data.length === 0) {
        downloadAttendance.innerHTML = `
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
    downloadAttendance.appendChild(thead);

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
    downloadAttendance.appendChild(tbody);
}

 function filterButton() {
    const studentId = document.querySelector("#student-id");
    const studentName = document.querySelector("#student-name");
    const classSem = document.querySelector("#class-sem");
    const subjectName = document.querySelector("#subject-name");
    const statusSelect = document.querySelector("#status");
    const fromDate = document.querySelector("#from-date");
    const toDate = document.querySelector("#to-date");

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
};

function download() {
    const downloadAtt = document.getElementById('download-wrapper');
  
    const opt = {
      margin:       0.5,
      filename:     'attendance-report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    html2pdf().set(opt).from(downloadAtt).save();
  };
  
setTimeout(() => {
    fetchData();
}, 100);