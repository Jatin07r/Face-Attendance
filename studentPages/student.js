async function fetchData() {
  try {
    const response = await fetch(`${window.location.origin}/fetchStudentDashboard`, {
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
  const studentName = document.querySelector("#student-name");
  const studentId = document.querySelector("#student-id");
  const className = document.querySelector("#class-name");
  const semester = document.querySelector("#semester");
  const contact = document.querySelector("#contact");
  const timeTable = document.querySelector("#time-table");
  const subjectAttendance = document.querySelector("#subject-attendance");
  const allAttendance = document.querySelector("#all-attendance");
  const totalAttendance = document.querySelector("#total-attendance");

  studentName.textContent = `${data.userData[0].name}`;
  studentId.textContent = `${data.userData[0].student_id}`;
  className.textContent = `${data.userData[0].class}`;
  semester.textContent = `${data.userData[0].semester}`;
  contact.textContent = `${data.userData[0].contact}`;

  timeTable.innerHTML = "";
  data.subjectData.forEach(cls => {
    const card = document.createElement("div");
    card.className = "class-card col-5 col-md-3 p-2 m-2 rounded bg-white shadow-sm";

    card.innerHTML = `
            <h6>Subject: <span class="fw-normal">${cls.subject_name}</span></h6>
            <h6>Class: <span class="fw-normal">${cls.subject_class}</span></h6>
            <h6>Time: <span class="fw-normal"> ${cls.date_time}</span></h6>
        `;
    const warning = data.chartData.subjectwise.find(item => item.subject_name === cls.subject_name);
    if (warning.present_percentage < 75) {
      card.innerHTML += `<p class="my-1 text-danger">*Attendance is below 75%.</p>`;
    }

    timeTable.appendChild(card);
  });

  const labels = data.chartData.subjectwise.map(item => item.subject_name);
  const presentData = data.chartData.subjectwise.map(item => item.present_percentage);
  const absentData = data.chartData.subjectwise.map(item => item.absent_percentage);

  new Chart(subjectAttendance, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Present",
          data: presentData,
          backgroundColor: "rgba(100, 181, 246, 0.7)",
          borderColor: "rgba(100, 181, 246, 1)",
          borderWidth: 2
        },
        {
          label: "Absent",
          data: absentData,
          backgroundColor: "rgba(244, 67, 54, 0.7)",
          borderColor: "rgba(244, 67, 54, 1)",
          borderWidth: 2
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: value => value + "%"
          }
        },
        x: {
          ticks: {
            callback: function (value) {
              const label = this.getLabelForValue(value);
              return label.length > 10 ? label.substring(0, 10) + '...' : label;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });

  const totalPresent = data.chartData.combined_summary.present_percentage;
  const totalAbsent = data.chartData.combined_summary.absent_percentage;
  new Chart(allAttendance, {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent"],
      datasets: [{
        data: [totalPresent, totalAbsent],
        backgroundColor: ["#64b5f6b3", "#f44336b3"],
        borderColor: ["#64b5f6ff", "#f44336ff"],
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => tooltipItem.label + ": " + tooltipItem.raw + "%"
          }
        }
      }
    }
  });

  const totalAttendanceText = document.createElement("div");
  totalAttendanceText.className = "col-md-4 p-2 m-2";
const combinedSummary = data.chartData.combined_summary;
  totalAttendanceText.innerHTML = `
        <h6 class="mb-2">Total Attendance:  <span class="fw-normal">${combinedSummary.total_attendance}</span></h6>
        <h6 class="mb-2">Total Presents:  <span class="fw-normal"> ${combinedSummary.present_count}</span></h6>
        <h6 class="mb-2">Total Absents :  <span class="fw-normal"> ${combinedSummary.absent_count}</span></h6>
 `;
    if (combinedSummary.present_percentage < 75) {
      totalAttendanceText.innerHTML += `<p class="my-1 text-danger">*Attendance is below 75%.</p>`;
    } else if (combinedSummary.present_percentage >= 75) {
      totalAttendanceText.innerHTML += `<p class="my-1 text-primary">*Attendance is above 75%.</p>`;
    } else {
      totalAttendanceText.innerHTML += `<p class="my-1 text-primary">*No attendance data available..</p>`;
    }

  totalAttendance.appendChild(totalAttendanceText);
}

setTimeout(() => {
  fetchData();
}
  , 100);