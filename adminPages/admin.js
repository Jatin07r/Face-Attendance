async function fetchData() {
  try {
    const response = await fetch(`${window.location.origin}/fetchAdminDashboard`, {
      method: "GET",
      credentials: 'include'
    });
    const result = await response.json();
    displayData(result);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//Dashboard Data
function displayData(data) {
  const adminName = document.querySelector("#admin-name");
  const email = document.querySelector("#email");
  const classes = document.querySelector("#classes");
  const students = document.querySelector("#students");
  const contact = document.querySelector("#contact");
  const classStudent = document.querySelector("#class-student");
  const classAttendance = document.querySelector("#class-attendance");
  const allAttendance = document.querySelector("#all-attendance");
  const totalAttendance = document.querySelector("#total-attendance");

  adminName.textContent = `${data.userData[0].name}`;
  email.textContent = `${data.userData[0].email}`;
  classes.textContent = `${data.userData[0].classes}`;
  students.textContent = `${data.userData[0].students}`;
  contact.textContent = `${data.userData[0].contact}`;

  classStudent.innerHTML = "";
  data.classData.forEach(cls => {
    const card = document.createElement("div");
    card.className = "class-card col-5 col-md-3 p-2 m-2 rounded bg-white shadow-sm";


    card.innerHTML = `
    <h6>Class: <span class="fw-normal">${cls.class_sem}</span></h6>
    <h6>Total Students: <span class="fw-normal"> ${cls.total_students}</span></h6>
    `;
    const warning = data.chartData.classwise.find(item => item.class_sem === cls.class_sem);
    if (warning.present_percentage < 75) {
      card.innerHTML += `<p class="my-1 text-danger">*Attendance is below 75%.</p>`;
    } else if (warning.present_percentage >= 75) {
      card.innerHTML += `<p class="my-1 text-primary">*Attendance is above 75%.</p>`;
    } else {
      card.innerHTML += `<p class="my-1 text-primary">*No attendance data available..</p>`;
    }
    classStudent.appendChild(card);
  });

  const labels = data.chartData.classwise.map(item => item.class_sem);
  const presentData = data.chartData.classwise.map(item => item.present_percentage);
  const absentData = data.chartData.classwise.map(item => item.absent_percentage);

  new Chart(classAttendance, {
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

  totalAttendanceText.innerHTML = `
      <h6 class="mb-2">Total Attendance:  <span class="fw-normal">${data.chartData.combined_summary.total_attendance}</span></h6>
      <h6 class="mb-2">Present Students:  <span class="fw-normal"> ${data.chartData.combined_summary.present_count}</span></h6>
      <h6 class="mb-2">Absent Students:  <span class="fw-normal"> ${data.chartData.combined_summary.absent_count}</span></h6>
 `;
  totalAttendance.appendChild(totalAttendanceText);
}

setTimeout(() => {
  fetchData();
}, 10);