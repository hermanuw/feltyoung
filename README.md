#Feltyoung.kicks
This is the repository for the Feltyoung.kicks web application, an e-commerce platform designed to help a shoe store manage sales and product catalogs more effectively. This project was developed as a final thesis, using the Extreme Programming (XP) methodology to ensure flexibility and collaboration.


#Key Features
The application has two main user roles: Customer and Admin.

#Customer Features
1. Authentication: Customers can register and log in to their accounts. 
2. Product Catalog: Browse all available products, view items by brand or category (Men, Women, Kids), and see detailed product information. 
3. Search & Filter: Easily search for products by name and filter results. 
4. Shopping Cart: Add multiple products to a shopping cart before purchasing. 
5. Checkout Process: A smooth checkout process integrated with the Midtrans payment gateway for secure online payments. 
6. Order History: View the status and history of all past transactions. 
7. Request a Product: Customers can request products that are not currently available in the catalog. 
8. Profile Management: Users can update their personal information and address. 

#Admin Features
1. Dashboard: An admin dashboard that shows key business metrics like total earnings, monthly orders, sales growth charts, and popular products. 
2. Product Management: Full CRUD (Create, Read, Update, Delete) functionality for all products in the store. 
3. Order Management: View all customer orders and update their status (e.g., from 'pending' to 'packing' or 'shipped'). 
4. Request Management: View and manage product requests submitted by customers, with the ability to accept or decline them. 

#Tech Stack
Frontend: Vue.js 
Backend: Express.js (Node.js) 
Database: MySQL 
Payment Gateway: Midtrans for handling online transactions. 
Modeling: System design and workflows were modeled using UML (Unified Modeling Language). 

#Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js
NPM or Yarn
A running MySQL server

#Installation
Clone the repo

Bash

git clone https://github.com/your_username/your_repository.git
Install backend dependencies

Bash

cd backend-folder
npm install
Install frontend dependencies

Bash

cd frontend-folder
npm install
Set up environment variables

Create a .env file in the backend folder.

Add your database credentials and any other required API keys (like Midtrans keys).

Run the application

Start the backend server.

Start the frontend development server.
