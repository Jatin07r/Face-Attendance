const adminName = document.querySelector("#admin-name");
const email = document.querySelector("#email");
const classes = document.querySelector("#classes");
const students = document.querySelector("#students");
const contact = document.querySelector("#contact");
const classStudent = document.querySelector("#class-student");

async function fetchData() {
    try {
        const response = await fetch("http://localhost:3000/adminFetchData");
        const result = await response.json();
        console.log(result);
        displayData(result);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayData(data){
    adminName.textContent = `${data.copy[0].name}`;
    email.textContent = `${data.copy[0].email}`;
    classes.textContent = `${data.copy[0].classes}`;
    students.textContent = `${data.copy[0].students}`;
    contact.textContent = `${data.copy[0].contact}`;

    classStudent.innerHTML = "";
    data.copy2.forEach(cls => {
        const card = document.createElement("div");
        card.className = "class-card col-5 col-md-3 p-2 m-2 rounded bg-white shadow-sm";

        card.innerHTML = `
            <h6>Class: <span class="fw-normal">${cls.class_sem}</span></h6>
            <h6>Total Students: <span class="fw-normal"> ${cls.total_students}</span></h6>
        `;

        classStudent.appendChild(card);
    });
}

window.addEventListener("DOMContentLoaded", fetchData);