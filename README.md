
# Feltyoung.kicks

Feltyoung.kicks is a web-based e-commerce application designed to help a shoe store manage product catalogs and sales more effectively. This project was developed as a final thesis using the Extreme Programming (XP) methodology to ensure flexibility, collaboration, and continuous development.

## 1. Key Features

The application supports two main user roles:

- Customer
- Admin

### 1.1 Customer Features

1. Authentication  
   Customers can register and log in securely.

2. Product Catalog  
   Browse all products by brand or category (Men, Women, Kids) and view product details.

3. Search and Filter  
   Search for products by name and filter by category or brand.

4. Shopping Cart  
   Add multiple items to the cart before making a purchase.

5. Checkout Process  
   Seamless checkout process integrated with Midtrans for secure online payments.

6. Order History  
   View the status and history of all past transactions.

7. Product Request  
   Customers can request products that are currently unavailable.

8. Profile Management  
   Update personal information and shipping address.

### 1.2 Admin Features

1. Admin Dashboard  
   Display key business metrics such as total earnings, monthly orders, sales charts, and most popular products.

2. Product Management  
   Full CRUD (Create, Read, Update, Delete) operations for all products.

3. Order Management  
   View all customer orders and update their statuses (e.g., pending, packing, shipped).

4. Request Management  
   Manage and respond to product requests submitted by customers.

## 2. Tech Stack

- Frontend: Vue.js  
- Backend: Express.js (Node.js)  
- Database: MySQL  
- Payment Gateway: Midtrans 

## 3. Getting Started

### 3.1 Prerequisites

- Node.js  
- NPM or Yarn  
- Running MySQL server

### 3.2 Installation Steps

1. Clone the repository

```bash
git clone https://github.com/hermanuw/feltyoung.git
````

2. Install backend dependencies

```bash
cd backend-folder
npm install
```

3. Install frontend dependencies

```bash
cd frontend-folder
npm install
```

4. Set up environment variables

Create a `.env` file inside the backend folder and add the following:

```env
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
MIDTRANS_SERVER_KEY=your_midtrans_key
```

5. Run the application

Start the backend server:

```bash
npm run dev
```

Start the frontend development server:

```bash
npm run serve
```
