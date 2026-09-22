PRD (Product Requirements Document)

Simple CRUD Application - Node.js

📋 Document Information

Field	Details

Project Name	Simple CRUD Application

Technology	Node.js, Express.js, MongoDB

Version	1.0.0

Author	Development Team

Date	2024

Status	Draft

1\. 🎯 Project Overview (প্রজেক্ট ওভারভিউ)

1.1 Purpose (উদ্দেশ্য)

একটি simple CRUD (Create, Read, Update, Delete) application তৈরি করা হবে Node.js ব্যবহার করে, যেখানে users তাদের data manage করতে পারবে।



1.2 Background (পটভূমি)

Basic data management এর জন্য একটি RESTful API based application দরকার যেটা দিয়ে users এর information store, retrieve, update এবং delete করা যাবে।



1.3 Scope (পরিধি)

✅ User data CRUD operations

✅ RESTful API endpoints

✅ Database integration

✅ Input validation

✅ Error handling

❌ Authentication/Authorization (v1.0 তে নেই)

❌ File upload (v1.0 তে নেই)

❌ Real-time features (v1.0 তে নেই)

2\. 🏗️ Technical Architecture (টেকনিক্যাল আর্কিটেকচার)

2.1 Tech Stack

text



┌─────────────────────────────────────────┐

│              CLIENT SIDE                │

│         (Postman / Frontend)            │

└──────────────┬──────────────────────────┘

&#x20;              │ HTTP Requests

&#x20;              ▼

┌─────────────────────────────────────────┐

│            SERVER SIDE                  │

│                                         │

│  ┌─────────────────────────────────┐   │

│  │        Express.js Server        │   │

│  │         (Port: 5000)            │   │

│  └──────────┬──────────────────────┘   │

│             │                           │

│  ┌──────────▼──────────────────────┐   │

│  │          Routes Layer           │   │

│  │   /api/users (CRUD Routes)      │   │

│  └──────────┬──────────────────────┘   │

│             │                           │

│  ┌──────────▼──────────────────────┐   │

│  │       Controller Layer          │   │

│  │   (Business Logic)              │   │

│  └──────────┬──────────────────────┘   │

│             │                           │

│  ┌──────────▼──────────────────────┐   │

│  │         Model Layer             │   │

│  │   (Mongoose Schema)             │   │

│  └──────────┬──────────────────────┘   │

│             │                           │

└─────────────┼───────────────────────────┘

&#x20;             │

&#x20;             ▼

┌─────────────────────────────────────────┐

│           DATABASE                      │

│          MongoDB                        │

│    (Local / MongoDB Atlas)              │

└─────────────────────────────────────────┘

2.2 Dependencies

Package	Version	Purpose

express	^4.18.x	Web framework

mongoose	^7.x.x	MongoDB ODM

dotenv	^16.x.x	Environment variables

cors	^2.8.x	Cross-origin support

nodemon	^3.x.x	Development auto-restart

express-validator	^7.x.x	Input validation

2.3 Folder Structure

text



crud-app/

│

├── 📁 config/

│   └── db.js                  # Database connection

│

├── 📁 controllers/

│   └── userController.js      # Business logic

│

├── 📁 models/

│   └── userModel.js           # Database schema

│

├── 📁 routes/

│   └── userRoutes.js          # API routes

│

├── 📁 middlewares/

│   └── errorHandler.js        # Error handling middleware

│   └── validator.js           # Input validation

│

├── 📁 utils/

│   └── apiResponse.js         # Standard API response

│

├── .env                       # Environment variables

├── .gitignore                 # Git ignore file

├── package.json               # Project dependencies

├── server.js                  # Entry point

└── README.md                  # Documentation

3\. 📊 Data Model (ডেটা মডেল)

3.1 User Schema

JavaScript



{

&#x20;   \_id: ObjectId,          // Auto-generated

&#x20;   name: {

&#x20;       type: String,

&#x20;       required: true,

&#x20;       trim: true,

&#x20;       minlength: 2,

&#x20;       maxlength: 50

&#x20;   },

&#x20;   email: {

&#x20;       type: String,

&#x20;       required: true,

&#x20;       unique: true,

&#x20;       lowercase: true

&#x20;   },

&#x20;   phone: {

&#x20;       type: String,

&#x20;       required: false

&#x20;   },

&#x20;   age: {

&#x20;       type: Number,

&#x20;       required: false,

&#x20;       min: 1,

&#x20;       max: 150

&#x20;   },

&#x20;   address: {

&#x20;       type: String,

&#x20;       required: false

&#x20;   },

&#x20;   status: {

&#x20;       type: String,

&#x20;       enum: \['active', 'inactive'],

&#x20;       default: 'active'

&#x20;   },

&#x20;   createdAt: {

&#x20;       type: Date,

&#x20;       default: Date.now

&#x20;   },

&#x20;   updatedAt: {

&#x20;       type: Date,

&#x20;       default: Date.now

&#x20;   }

}

3.2 Entity Relationship Diagram (ERD)

text



┌──────────────────────────────────┐

│            USERS                 │

├──────────────────────────────────┤

│ \_id        : ObjectId (PK)      │

│ name       : String (Required)   │

│ email      : String (Unique)     │

│ phone      : String              │

│ age        : Number              │

│ address    : String              │

│ status     : String              │

│ createdAt  : Date                │

│ updatedAt  : Date                │

└──────────────────────────────────┘

4\. 🔌 API Endpoints (এপিআই এন্ডপয়েন্ট)

4.1 Base URL

text



Development: http://localhost:5000/api

Production:  https://your-domain.com/api

4.2 Endpoints Table

\#	Method	Endpoint	Description	Request Body	Response

1	POST	/api/users	নতুন user তৈরি	JSON	Created User

2	GET	/api/users	সব users দেখা	None	Users Array

3	GET	/api/users/:id	একটা user দেখা	None	Single User

4	PUT	/api/users/:id	User update করা	JSON	Updated User

5	DELETE	/api/users/:id	User delete করা	None	Success Message

4.3 Detailed API Specifications

📌 API 1: Create User (নতুন User তৈরি)

text



POST /api/users

Content-Type: application/json

Request Body:



JSON



{

&#x20;   "name": "Rahim Ahmed",

&#x20;   "email": "rahim@example.com",

&#x20;   "phone": "01712345678",

&#x20;   "age": 25,

&#x20;   "address": "Dhaka, Bangladesh"

}

Success Response (201):



JSON



{

&#x20;   "success": true,

&#x20;   "message": "User created successfully",

&#x20;   "data": {

&#x20;       "\_id": "64f5a1b2c3d4e5f6a7b8c9d0",

&#x20;       "name": "Rahim Ahmed",

&#x20;       "email": "rahim@example.com",

&#x20;       "phone": "01712345678",

&#x20;       "age": 25,

&#x20;       "address": "Dhaka, Bangladesh",

&#x20;       "status": "active",

&#x20;       "createdAt": "2024-01-15T10:30:00.000Z",

&#x20;       "updatedAt": "2024-01-15T10:30:00.000Z"

&#x20;   }

}

Error Response (400):



JSON



{

&#x20;   "success": false,

&#x20;   "message": "Validation Error",

&#x20;   "errors": \[

&#x20;       {

&#x20;           "field": "email",

&#x20;           "message": "Email already exists"

&#x20;       }

&#x20;   ]

}

📌 API 2: Get All Users (সব Users দেখা)

text



GET /api/users

GET /api/users?page=1\&limit=10          // Pagination

GET /api/users?search=rahim              // Search

GET /api/users?status=active             // Filter

GET /api/users?sortBy=name\&order=asc     // Sort

Success Response (200):



JSON



{

&#x20;   "success": true,

&#x20;   "message": "Users fetched successfully",

&#x20;   "count": 2,

&#x20;   "totalPages": 1,

&#x20;   "currentPage": 1,

&#x20;   "data": \[

&#x20;       {

&#x20;           "\_id": "64f5a1b2c3d4e5f6a7b8c9d0",

&#x20;           "name": "Rahim Ahmed",

&#x20;           "email": "rahim@example.com",

&#x20;           "phone": "01712345678",

&#x20;           "age": 25,

&#x20;           "address": "Dhaka, Bangladesh",

&#x20;           "status": "active",

&#x20;           "createdAt": "2024-01-15T10:30:00.000Z"

&#x20;       },

&#x20;       {

&#x20;           "\_id": "64f5a1b2c3d4e5f6a7b8c9d1",

&#x20;           "name": "Karim Hossain",

&#x20;           "email": "karim@example.com",

&#x20;           "phone": "01812345678",

&#x20;           "age": 30,

&#x20;           "address": "Chittagong, Bangladesh",

&#x20;           "status": "active",

&#x20;           "createdAt": "2024-01-16T11:00:00.000Z"

&#x20;       }

&#x20;   ]

}

Empty Response (200):



JSON



{

&#x20;   "success": true,

&#x20;   "message": "No users found",

&#x20;   "count": 0,

&#x20;   "data": \[]

}

📌 API 3: Get Single User (একটা User দেখা)

text



GET /api/users/:id

GET /api/users/64f5a1b2c3d4e5f6a7b8c9d0

Success Response (200):



JSON



{

&#x20;   "success": true,

&#x20;   "message": "User fetched successfully",

&#x20;   "data": {

&#x20;       "\_id": "64f5a1b2c3d4e5f6a7b8c9d0",

&#x20;       "name": "Rahim Ahmed",

&#x20;       "email": "rahim@example.com",

&#x20;       "phone": "01712345678",

&#x20;       "age": 25,

&#x20;       "address": "Dhaka, Bangladesh",

&#x20;       "status": "active",

&#x20;       "createdAt": "2024-01-15T10:30:00.000Z",

&#x20;       "updatedAt": "2024-01-15T10:30:00.000Z"

&#x20;   }

}

Error Response (404):



JSON



{

&#x20;   "success": false,

&#x20;   "message": "User not found"

}

📌 API 4: Update User (User আপডেট করা)

text



PUT /api/users/:id

Content-Type: application/json

Request Body (Partial/Full update):



JSON



{

&#x20;   "name": "Rahim Ahmed Updated",

&#x20;   "age": 26,

&#x20;   "address": "Mirpur, Dhaka"

}

Success Response (200):



JSON



{

&#x20;   "success": true,

&#x20;   "message": "User updated successfully",

&#x20;   "data": {

&#x20;       "\_id": "64f5a1b2c3d4e5f6a7b8c9d0",

&#x20;       "name": "Rahim Ahmed Updated",

&#x20;       "email": "rahim@example.com",

&#x20;       "phone": "01712345678",

&#x20;       "age": 26,

&#x20;       "address": "Mirpur, Dhaka",

&#x20;       "status": "active",

&#x20;       "createdAt": "2024-01-15T10:30:00.000Z",

&#x20;       "updatedAt": "2024-01-17T14:20:00.000Z"

&#x20;   }

}

Error Response (404):



JSON



{

&#x20;   "success": false,

&#x20;   "message": "User not found"

}

📌 API 5: Delete User (User মুছে ফেলা)

text



DELETE /api/users/:id

DELETE /api/users/64f5a1b2c3d4e5f6a7b8c9d0

Success Response (200):



JSON



{

&#x20;   "success": true,

&#x20;   "message": "User deleted successfully",

&#x20;   "data": {

&#x20;       "\_id": "64f5a1b2c3d4e5f6a7b8c9d0",

&#x20;       "name": "Rahim Ahmed"

&#x20;   }

}

Error Response (404):



JSON



{

&#x20;   "success": false,

&#x20;   "message": "User not found"

}

5\. ✅ Validation Rules (ভ্যালিডেশন রুলস)

5.1 Input Validation

Field	Rules	Error Message

name	Required, Min 2 chars, Max 50 chars	"Name is required and must be 2-50 characters"

email	Required, Valid email format, Unique	"Valid email is required"

phone	Optional, Valid BD phone format	"Invalid phone number"

age	Optional, Number, Min 1, Max 150	"Age must be between 1-150"

address	Optional, Max 200 chars	"Address max 200 characters"

status	Optional, enum: active/inactive	"Status must be active or inactive"

5.2 ID Validation

text



\- MongoDB ObjectId format check

\- Invalid ID → 400 Bad Request

\- Non-existing ID → 404 Not Found

6\. ⚠️ Error Handling (এরর হ্যান্ডলিং)

6.1 HTTP Status Codes

text



┌─────────┬─────────────────────┬──────────────────────────────────┐

│  Code   │     Status          │         কখন ব্যবহার হবে           │

├─────────┼─────────────────────┼──────────────────────────────────┤

│  200    │  OK                 │  Successful GET, PUT, DELETE      │

│  201    │  Created            │  Successful POST (resource created)│

│  400    │  Bad Request        │  Invalid input / validation error │

│  404    │  Not Found          │  Resource not found               │

│  409    │  Conflict           │  Duplicate entry (email)          │

│  500    │  Internal Server    │  Server error                     │

│         │  Error              │                                    │

└─────────┴─────────────────────┴──────────────────────────────────┘

6.2 Standard Error Response Format

JSON



{

&#x20;   "success": false,

&#x20;   "message": "Error description here",

&#x20;   "error": {

&#x20;       "code": 400,

&#x20;       "details": "Detailed error information"

&#x20;   }

}

7\. 🔄 Application Flow (অ্যাপ্লিকেশন ফ্লো)

7.1 Request-Response Flow

text



Client Request

&#x20;     │

&#x20;     ▼

┌─────────────┐

│   Server    │ ──→ server.js (Entry Point)

│  (Express)  │

└──────┬──────┘

&#x20;      │

&#x20;      ▼

┌─────────────┐

│ Middleware   │ ──→ CORS, JSON Parser, Error Handler

└──────┬──────┘

&#x20;      │

&#x20;      ▼

┌─────────────┐

│   Routes    │ ──→ URL matching \& HTTP method check

└──────┬──────┘

&#x20;      │

&#x20;      ▼

┌─────────────┐

│ Validation  │ ──→ Input validation (express-validator)

└──────┬──────┘

&#x20;      │

&#x20;      ▼

┌─────────────┐

│ Controller  │ ──→ Business logic execution

└──────┬──────┘

&#x20;      │

&#x20;      ▼

┌─────────────┐

│   Model     │ ──→ Database query (Mongoose)

└──────┬──────┘

&#x20;      │

&#x20;      ▼

┌─────────────┐

│  Database   │ ──→ MongoDB operation

│  (MongoDB)  │

└──────┬──────┘

&#x20;      │

&#x20;      ▼

&#x20; Response sent

&#x20; back to client

7.2 CRUD Operations Flow

text



CREATE Flow:

Client → POST /api/users → Validate Input → Check Duplicate Email

→ Save to DB → Return 201 + Created User



READ (All) Flow:

Client → GET /api/users → Parse Query Params → Fetch from DB

→ Apply Pagination/Filter → Return 200 + Users Array



READ (Single) Flow:

Client → GET /api/users/:id → Validate ID → Find in DB

→ Return 200 + User OR 404



UPDATE Flow:

Client → PUT /api/users/:id → Validate ID → Validate Input

→ Find \& Update in DB → Return 200 + Updated User OR 404



DELETE Flow:

Client → DELETE /api/users/:id → Validate ID → Find \& Delete

→ Return 200 + Success Message OR 404

8\. 🌍 Environment Variables (এনভায়রনমেন্ট ভেরিয়েবলস)

8.1 .env File

env



\# Server Configuration

PORT=5000

NODE\_ENV=development



\# Database Configuration

MONGODB\_URI=mongodb://localhost:27017/crud\_app

\# For Atlas: MONGODB\_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/crud\_app



\# API Configuration

API\_PREFIX=/api

8.2 .env.example (Template)

env



PORT=5000

NODE\_ENV=development

MONGODB\_URI=mongodb://localhost:27017/crud\_app

API\_PREFIX=/api

9\. 🧪 Testing Plan (টেস্টিং প্ল্যান)

9.1 Test Cases

Create User Tests

\#	Test Case	Input	Expected Output	Status Code

1	Valid user creation	All valid fields	User created	201

2	Missing name	No name field	Validation error	400

3	Missing email	No email field	Validation error	400

4	Duplicate email	Existing email	Conflict error	409

5	Invalid email format	"invalid-email"	Validation error	400

6	Name too short	"A"	Validation error	400

Read Users Tests

\#	Test Case	Input	Expected Output	Status Code

7	Get all users	None	Users array	200

8	Get with pagination	page=1\&limit=5	Paginated result	200

9	Get single user	Valid ID	Single user	200

10	Get non-existing user	Invalid ID	Not found	404

11	Get with invalid ID format	"abc123"	Bad request	400

Update User Tests

\#	Test Case	Input	Expected Output	Status Code

12	Valid update	Updated fields	Updated user	200

13	Update non-existing	Invalid ID	Not found	404

14	Update with invalid data	Invalid email	Validation error	400

Delete User Tests

\#	Test Case	Input	Expected Output	Status Code

15	Valid delete	Valid ID	Success message	200

16	Delete non-existing	Invalid ID	Not found	404

9.2 Postman Collection Structure

text



📁 CRUD App API

├── 📁 Users

│   ├── POST   - Create User

│   ├── GET    - Get All Users

│   ├── GET    - Get All Users (with pagination)

│   ├── GET    - Get Single User

│   ├── PUT    - Update User

│   └── DELETE - Delete User

└── 📁 Error Cases

&#x20;   ├── POST   - Create User (Missing Fields)

&#x20;   ├── GET    - Get User (Invalid ID)

&#x20;   └── PUT    - Update User (Invalid Data)

10\. 📦 Implementation Code Structure (কোড স্ট্রাকচার)

10.1 Key Files Implementation Guide

text



File                        │ Responsibility

────────────────────────────┼──────────────────────────────

server.js                   │ App initialization, middleware setup,

&#x20;                           │ server start

config/db.js                │ MongoDB connection setup using

&#x20;                           │ mongoose.connect()

models/userModel.js         │ Mongoose schema \& model definition

routes/userRoutes.js        │ Route definitions pointing to

&#x20;                           │ controller methods

controllers/userController.js│ CRUD logic:

&#x20;                           │   - createUser()

&#x20;                           │   - getAllUsers()

&#x20;                           │   - getUserById()

&#x20;                           │   - updateUser()

&#x20;                           │   - deleteUser()

middlewares/errorHandler.js │ Global error handling middleware

middlewares/validator.js    │ express-validator rules

utils/apiResponse.js       │ Standardized response helper

10.2 npm Scripts

JSON



{

&#x20;   "scripts": {

&#x20;       "start": "node server.js",

&#x20;       "dev": "nodemon server.js",

&#x20;       "test": "jest --coverage"

&#x20;   }

}

11\. 🚀 Deployment Plan (ডিপ্লয়মেন্ট প্ল্যান)

11.1 Development Setup Steps

Bash



\# Step 1: Project Initialize

mkdir crud-app \&\& cd crud-app

npm init -y



\# Step 2: Install Dependencies

npm install express mongoose dotenv cors express-validator

npm install -D nodemon



\# Step 3: Create folder structure

mkdir config controllers models routes middlewares utils



\# Step 4: Create .env file

echo "PORT=5000" > .env

echo "MONGODB\_URI=mongodb://localhost:27017/crud\_app" >> .env



\# Step 5: Start Development Server

npm run dev

11.2 Production Deployment Options

text



┌──────────────────────┬────────────────────────┐

│    Platform          │    Database            │

├──────────────────────┼────────────────────────┤

│  Render (Free)       │  MongoDB Atlas (Free)  │

│  Railway             │  MongoDB Atlas          │

│  Vercel              │  MongoDB Atlas          │

│  Heroku              │  MongoDB Atlas          │

│  DigitalOcean        │  Self-hosted MongoDB   │

│  AWS EC2             │  AWS DocumentDB        │

└──────────────────────┴────────────────────────┘

12\. 📅 Timeline \& Milestones (টাইমলাইন)

12.1 Development Schedule

text



Week 1 (Day 1-2): Project Setup

├── Initialize project

├── Install dependencies

├── Setup folder structure

├── Configure MongoDB connection

└── Create .env configuration



Week 1 (Day 3-4): Core Development

├── Create User Model/Schema

├── Create Routes

├── Implement Controllers

│   ├── createUser

│   ├── getAllUsers

│   ├── getUserById

│   ├── updateUser

│   └── deleteUser

└── Add Input Validation



Week 1 (Day 5): Error Handling \& Testing

├── Implement Error Handler Middleware

├── Add standard API responses

├── Test all endpoints with Postman

└── Fix bugs



Week 2 (Day 1-2): Enhancement \& Documentation

├── Add pagination \& search

├── Add filtering \& sorting

├── Create Postman collection

├── Write README.md

└── Code review \& cleanup



Week 2 (Day 3): Deployment

├── Setup MongoDB Atlas

├── Deploy to Render/Railway

├── Test production endpoints

└── Final documentation

12.2 Gantt Chart

text



Task                    │ D1 │ D2 │ D3 │ D4 │ D5 │ D6 │ D7 │ D8

────────────────────────┼────┼────┼────┼────┼────┼────┼────┼────

Project Setup           │ ██ │ ██ │    │    │    │    │    │

DB Connection           │    │ ██ │    │    │    │    │    │

Model Creation          │    │    │ ██ │    │    │    │    │

Routes \& Controllers    │    │    │ ██ │ ██ │    │    │    │

Validation              │    │    │    │ ██ │    │    │    │

Error Handling          │    │    │    │    │ ██ │    │    │

Testing                 │    │    │    │    │ ██ │    │    │

Pagination/Search       │    │    │    │    │    │ ██ │    │

Documentation           │    │    │    │    │    │    │ ██ │

Deployment              │    │    │    │    │    │    │    │ ██

13\. 🔮 Future Enhancements (ভবিষ্যৎ পরিকল্পনা)

Version 2.0 Features

Feature	Priority	Description

Authentication	High	JWT based login/register

Authorization	High	Role-based access (Admin/User)

File Upload	Medium	Profile picture upload (Multer)

Email Notification	Medium	Welcome email on registration

Rate Limiting	Medium	API rate limiting

Caching	Low	Redis caching for GET requests

Logging	Low	Winston/Morgan logging

Swagger Docs	Low	Auto-generated API docs

Unit Tests	Medium	Jest/Mocha test suite

Docker	Low	Containerization

Version Roadmap

text



v1.0 ──→ Basic CRUD (Current)

&#x20; │

v1.1 ──→ Pagination + Search + Filter

&#x20; │

v2.0 ──→ Authentication + Authorization

&#x20; │

v2.1 ──→ File Upload + Email

&#x20; │

v3.0 ──→ Full Production Ready

&#x20;        (Caching, Logging, Docker, Tests)

14\. 📝 Acceptance Criteria (গ্রহণযোগ্যতার মানদণ্ড)

Definition of Done ✅

text



☐ সব CRUD endpoints কাজ করছে

☐ Input validation properly কাজ করছে

☐ Error handling সব cases cover করছে

☐ MongoDB তে data সঠিকভাবে save/read হচ্ছে

☐ Postman দিয়ে সব API test করা হয়েছে

☐ Standard response format follow করা হয়েছে

☐ Code clean ও well-commented

☐ README.md complete

☐ .env.example file আছে

☐ .gitignore file আছে (node\_modules, .env excluded)

15\. 📎 Appendix (সংযুক্তি)

15.1 Postman Environment Variables

JSON



{

&#x20;   "BASE\_URL": "http://localhost:5000/api",

&#x20;   "USER\_ID": "{{dynamic\_user\_id}}"

}

15.2 Git Workflow

Bash



main (production)

&#x20; │

&#x20; ├── develop (development)

&#x20; │     │

&#x20; │     ├── feature/setup-project

&#x20; │     ├── feature/user-model

&#x20; │     ├── feature/crud-routes

&#x20; │     ├── feature/validation

&#x20; │     ├── feature/error-handling

&#x20; │     └── feature/pagination

&#x20; │

&#x20; └── release/v1.0

15.3 Quick Reference Commands

Bash



\# Development

npm run dev              # Start dev server

npm start                # Start production server



\# Database

mongosh                  # Open MongoDB shell

use crud\_app             # Select database

db.users.find()          # View all users

db.users.drop()          # Clear all users



\# Git

git init

git add .

git commit -m "Initial commit"

git push origin main

📌 Note: এই PRD document টি একটি living document। Project এর progress অনুযায়ী এটি update করা হবে। যেকোনো change request আসলে এই document এ reflect করতে হবে।



Document Approved By:



Role	Name	Date	Signature

Project Manager	\_\_\_\_\_\_\_\_\_\_	//\_\_\_	\_\_\_\_\_\_\_\_\_\_

Tech Lead	\_\_\_\_\_\_\_\_\_\_	//\_\_\_	\_\_\_\_\_\_\_\_\_\_

Developer	\_\_\_\_\_\_\_\_\_\_	//\_\_\_	\_\_\_\_\_\_\_\_\_\_

End of PRD Document - Version 1.0

