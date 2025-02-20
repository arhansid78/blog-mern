# 📝 Blog-Post

A **full-stack blogging platform** built with **React, Node.js, Express, and MongoDB**.  
Users can create, edit, delete, and view blog posts with authentication.

---

## 🚀 Features

✔️ User authentication (JWT-based)  
✔️ Create, edit, and delete blog posts  
✔️ View all blog posts with pagination  
✔️ Secure REST API with Express  
✔️ MongoDB for data storage  
✔️ Responsive UI using React and Bootstrap

---

## 🛠️ Tech Stack

| Frontend   | Backend  | Database |
| ---------- | -------- | -------- |
| React.js   | Node.js  | MongoDB  |
| Express.js | Mongoose |
| JWT Auth   |

---

## 📦 Installation & Setup

### 🔹 **Clone the Repository**

```bash
git clone https://github.com/arhansid78/blog-posts.git
cd blog-posts
🖥️ Backend Setup (Node.js + Express + MongoDB)

Navigate to the backend folder:


cd backend
Install dependencies:

bash
Copy
npm install
Create a .env file and add the following:

env
Copy
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the backend server:

bash
Copy
npm start
🌐 Frontend Setup (React.js + Bootstrap)
Navigate to the frontend folder:

bash
Copy
cd ../frontend
Install dependencies:

bash
Copy
npm install
Start the frontend:

bash
Copy
npm start
The frontend will run on:
🖥️ http://localhost:3000


🔗 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login (returns token)
GET	/api/posts	Fetch all blog posts
GET	/api/posts/:id	Fetch single blog post
POST	/api/posts	Create a new post (Auth)
PUT	/api/posts/:id	Update a post (Auth)
DELETE	/api/posts/:id	Delete a post (Auth)
```
