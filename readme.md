# 🎓 Face Attendance System

The **Face Attendance System** is a web-based application designed to manage attendance efficiently using facial recognition. It provides features for both administrators and students, allowing seamless attendance tracking and management.

---

## 🔑 Features

### 🛠 Admin Features
- **Dashboard**: View attendance statistics and class details
- **Class Management**: Monitor attendance percentages for each class
- **Attendance Reports**: Download attendance data for analysis
- **Admin Login**: Secure login for administrators

### 🎓 Student Features
- **Attendance View**: Students can view their attendance records
- **Class/Semester Details**: View attendance by class and subject
- **Student Login**: Secure login for students

---

## 📁 Project Structure

```
project/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   └── js/
│       ├── face-api.js
│       └── app.js
│
├── backend/
│   ├── server.js
│   ├── login.js
│   └── db.js
│
├── mysql/
│   └── database-schema.sql
└── README.md
```

---

## 🧰 Technologies Used

### 💻 Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Bootstrap**: For responsive design and UI components
- **Chart.js**: To visualize attendance data

### ⚙ Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for handling routes
- **MySQL**: Database for storing users and attendance records

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Jatin07r/Face-Attendance.git
cd face-attendance
```

### 2. Install Dependencies (Backend)
```bash
cd backend
npm install
```

### 3. Start MySQL Server
Ensure your MySQL Workbench is running and your schema is created.

### 4. Start the Server
```bash
node backend/router.js
```

### 5. Launch the Frontend with Live Server
Open `landingpages/homeNavbar.html` in VS Code and right-click → **"Open with Live Server"**  
Visit: `http://127.0.0.1:5500/`

---

## 🧪 Usage

### 👨‍🏫 Admin Login
1. Go to the Admin login page
2. Enter your email and password
3. Access the admin dashboard to manage attendance

### 👨‍🎓 Student Login
1. Go to the Student Id login page/Student Face Id login page
2. Enter your student ID and password/Identify your face
3. View your attendance records and subject-wise stats

---

## 🤝 Contributing

Contributions are welcome! Please follow standard GitHub practices:
1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes
4. Push and create a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).See the LICENSE file for details.

---

## 📬 Contact

- 📧 Email: `jatinrajput122000@gmail.com`
- 🐙 GitHub: [@Jatin07r](https://github.com/Jatin07r)
