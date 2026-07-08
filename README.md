# 📋 Campus Notice Board

A premium, responsive campus announcement hub built with Next.js (Pages Router), Prisma, and MariaDB (compatible with TiDB Cloud/MySQL). Notices are ordered on the database level to display Urgent notices at the top with a pulsing red badge, followed by newest announcements.

---

## 🚀 How to Run the Project Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18 or higher) and `npm` installed.

### 2. Clone and Install Dependencies
```bash
git clone <your-repository-url>
cd notice-board
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure your connection credentials:
```env
# Connection URL for Prisma migrations & CLI (MySQL/MariaDB compatible)
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database_name>?sslaccept=strict"

# Credentials for the application-level MariaDB driver adapter
DB_HOST="<database-host-address>"
DB_PORT=4000
DB_USER="<username>"
DB_PASSWORD="<password>"
DB_NAME="notice_board"
```

### 4. Code Compilation & Setup
Generate the Prisma Client mapping based on the schema:
```bash
npx prisma generate
```

### 5. Running the Application
Run the development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ⚡ One Thing We Would Improve with More Time

If given more time, we would implement **native image uploads**. 
Currently, the notice image is supported via an optional image URL field. Having direct integration with cloud storage (such as Vercel Blob or AWS S3) with drag-and-drop file inputs and client-side image compression would significantly elevate the user experience and prevent broken layout instances from invalid external URLs.

---

##  Where and How AI Was Used

An AI coding assistant (Antigravity) was used as a pair-programmer to build this project:
1. **Troubleshooting Fixes**: Helped identify a connection pool issue where `@prisma/adapter-mariadb` was receiving a pre-created pool instance instead of a database credentials object, which caused a pool timeout during client-side hydration.
2. **React Hydration Alignment**: Refactored the date formatting logic in `NoticeCard.tsx` to format calendar dates deterministically using UTC methods rather than relying on local system timezones. Added `mounted` conditional gates to the Live Preview rendering in `NoticeForm.tsx` to guarantee server-rendered HTML matches the client exactly, preventing Next.js SSR hydration mismatches.
3. **Tailwind Component Assembly**: Aided in designing modern, responsive dashboard elements with interactive hover states, responsive flex grids, category color-themed tags, and custom deletion modals.
4. **Server-Side Security Validation**: Assisted in structuring server-side validation checks on both the `POST` and `PUT` endpoints to sanitize user titles and bodies, validate dates, and assert input boundaries.
