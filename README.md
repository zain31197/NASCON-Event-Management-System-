# 🚀 NASCON Event Management System 🎉

A full-stack **Database Management System** designed for **NASCON**—a national-level inter-university event—to automate large-scale event operations, optimize workflows, and provide a seamless experience for all stakeholders.

---

## 📌 About NASCON

**NASCON (National Student Convention)** is a prestigious annual event that includes technical competitions, workshops, exhibitions, and networking sessions for students across universities. Our system was designed to manage the event's growing complexity by introducing a digital, automated, and scalable solution.

---

## 🛠️ Tech Stack

| Layer        | Technology       |
|--------------|------------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend**  | Node.js          |
| **Database** | MySQL            |

---

## 📚 Key Features

- ✅ **Role-Based Access Control**
  - Separate portals for Admins, Organizers, Participants, Sponsors, and Judges.

- ✅ **Event Management & Scheduling**
  - Automated venue booking with conflict detection and resolution.

- ✅ **Participant Registration**
  - Individual and team registration workflows with validation and status tracking.

- ✅ **Sponsorship & Finance Management**
  - Sponsor onboarding, fund tracking, and budget analysis.

- ✅ **Accommodation Automation**
  - Intelligent accommodation assignments based on gender, team, and availability.

- ✅ **Secure Payment Tracking**
  - Transaction logs, payment confirmations, and invoice generation.

- ✅ **Judge Evaluation System**
  - Score submissions, weighted criteria, auto-ranking, and leaderboard generation.

- ✅ **Reporting & Analytics**
  - Real-time dashboards for event insights, financial summaries, and user activity logs.

---

## 📸 Screenshots (Optional)

> _You can include screenshots or a demo video link here._

---

## 💡 What We Learned

- Tackled real-world problems like:
  - Venue scheduling conflicts
  - Multi-role system design
  - Database optimization for large-scale queries
- Gained experience in:
  - Modular backend architecture
  - Scalable database schema design
  - Building secure and user-friendly full-stack applications

---

## 🤝 Team Members

- 👨‍💻 **Zain Shahid** – Backend & Database Design, Architecture Lead  
- 👨‍💻 **Talha Arshad** – Frontend Development, UI/UX, Business Logic

---

## 🔐 Security Considerations

- Passwords hashed using `bcrypt`
- Role validation middleware for route protection
- SQL injection prevention using prepared statements

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/NASCON-Event-Management-System.git

# 2. Navigate into the project
cd NASCON-Event-Management-System

# 3. Install backend dependencies
npm install

# 4. Set up MySQL database (import schema.sql)

# 5. Start the server
node app.js
