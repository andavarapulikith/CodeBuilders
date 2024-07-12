# CodeBuilders: Online Judge Platform

## Overview

CodeBuilders is a comprehensive Online Judge (OJ) platform built using the MERN stack (MongoDB, Express, React, Node.js). The platform caters to both users and admins, providing distinct functionalities tailored to their roles.

## Features

### User Login

#### User Capabilities

1. **View and Solve Problems:**
   - Access a wide range of problems.
   - Solve problems using one of the supported languages: C++, Java, and Python.
   - Filter problems based on difficulty levels (easy, medium, hard).

2. **Recent Tech Questions:**
   - View a curated list of recently asked technical questions in various companies.

3. **Submission History:**
   - View past submissions for any specific problem, allowing users to track their progress and learn from previous attempts.

4. **User Profile:**
   - View daily solved problems and the total number of problems solved.
   - Edit profile information.
   - View personal submission history.

5. **Leaderboard:**
   - A dynamic leaderboard that ranks users based on their scores.
   - Scores are calculated based on the problems solved, promoting healthy competition among users.

6. **Assignments:**
   - View and solve assignments created by admins.
   - Track progress on different assignments.

### Admin Login

#### Admin Capabilities

1. **Dashboard:**
   - Access a comprehensive dashboard showcasing all platform statistics.
   - Monitor user registrations and activity.

2. **User Management:**
   - View a list of all registered users.
   - Manage user accounts as needed.

3. **Problem Management:**
   - Create new problems with detailed descriptions, constraints, input/output formats, and sample test cases.
   - Delete existing problems.
   - Test cases for problems are stored securely in AWS S3 buckets to handle large file sizes efficiently.

4. **Assignment Creation:**
   - Create assignments from the pool of available problems.
   - Manage assignments, allowing users to access and solve them on the platform.

## Technical Details

### Tech Stack

- **Frontend:** React.js with Tailwind CSS for styling
- **Backend:** Node.js and Express.js
- **Database:** MongoDB for data storage
- **File Storage:** AWS S3 for storing large test case files
- **Authentication:** JWT (JSON Web Tokens) for secure authentication

### Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/codebuilders.git
   cd codebuilders
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Environment Variables:**
   - Create a `.env` file in the root directory with the following variables:
     ```plaintext
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     AWS_ACCESS_KEY_ID=your_aws_access_key_id
     AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
     AWS_BUCKET_NAME=your_aws_bucket_name
     AWS_REGION=your_aws_region
     ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```

## Contribution

We welcome contributions to improve CodeBuilders. Feel free to open issues and submit pull requests.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please contact us at codebuilders@gmail.com.

---

This README file provides a comprehensive overview of the CodeBuilders platform, its features, technical stack, installation instructions, and contribution guidelines.
Access a wide range of problems.
Solve problems using one of the supported languages: C++, Java, and Python.
Filter problems based on difficulty levels (easy, medium, hard).
Recent Tech Questions:

View a curated list of recently asked technical questions in various companies.
Submission History:

View past submissions for any specific problem, allowing users to track their progress and learn from previous attempts.
User Profile:

View daily solved problems and the total number of problems solved.
Edit profile information.
View personal submission history.
Leaderboard:

A dynamic leaderboard that ranks users based on their scores.
Scores are calculated based on the problems solved, promoting healthy competition among users.
Assignments:

View and solve assignments created by admins.
Track progress on different assignments.
Admin Login
Admin Capabilities
Dashboard:

Access a comprehensive dashboard showcasing all platform statistics.
Monitor user registrations and activity.
User Management:

View a list of all registered users.
Manage user accounts as needed.
Problem Management:

Create new problems with detailed descriptions, constraints, input/output formats, and sample test cases.
Delete existing problems.
Test cases for problems are stored securely in AWS S3 buckets to handle large file sizes efficiently.
Assignment Creation:

Create assignments from the pool of available problems.
Manage assignments, allowing users to access and solve them on the platform.
Technical Detailssing the MERN stack (MongoDB, Express, React, Node.js). The platform caters to both users and admins, providing distinct functionalities tailored to their roles.

Features
User Login
User Capabilities
View and Solve Problems:

Access a wide range of problems.
Solve problems using one of the supported languages: C++, Java, and Python.
Filter problems based on difficulty levels (easy, medium, hard).
Recent Tech Questions:

View a curated list of recently asked technical questions in various companies.
Submission History:

View past submissions for any specific problem, allowing users to track their progress and learn from previous attempts.
User Profile:

View daily solved problems and the total number of problems solved.
Edit profile information.
View personal submission history.
Leaderboard:

A dynamic leaderboard that ranks users based on their scores.
Scores are calculated based on the problems solved, promoting healthy competition among users.
Assignments:

View and solve assignments created by admins.
Track progress on different assignments.
Admin Login
Admin Capabilities
Dashboard:

Access a comprehensive dashboard showcasing all platform statistics.
Monitor user registrations and activity.
User Management:

View a list of all registered users.
Manage user accounts as needed.
Problem Management:

Create new problems with detailed descriptions, constraints, input/output formats, and sample test cases.
Delete existing problems.
Test cases for problems are stored securely in AWS S3 buckets to handle large file sizes efficiently.
Assignment Creation:

Create assignments from the pool of available problems.
Manage assignments, allowing users to access and solve them on the platform.
Technical Details
Tech Stack
Frontend: React.js with Tailwind CSS for styling
Backend: Node.js and Express.js
Database: MongoDB for data storage
File Storage: AWS S3 for storing large test case files
Authentication: JWT (JSON Web Tokens) for secure authentication
