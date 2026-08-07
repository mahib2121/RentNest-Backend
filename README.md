# 🏠 RentNest API

**RentNest** is a backend REST API for a rental property management platform that connects **Landlords** and **Tenants** through a secure, scalable, and role-based system. The platform streamlines property listing, rental requests, payment processing, and property reviews.

---

## 🚀 Features

### 👤 Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Secure password hashing
* User profile management

### 🏡 Property Management

* Create, update, and delete property listings
* Property categories
* Search, filter, and pagination
* Property availability management

### 📄 Rental Requests

* Submit rental requests
* Approve or reject requests
* Track request status
* Rental history

### 💳 Payment Integration

* Stripe payment gateway
* Secure payment processing
* Payment history
* Payment status tracking
* Webhook support

### ⭐ Reviews & Ratings

* Property reviews
* Landlord ratings
* Review management

### 🛠️ Admin Dashboard

* User management
* Property moderation
* Category management
* Rental request monitoring

---

# 🛠 Tech Stack

| Technology   | Purpose              |
| ------------ | -------------------- |
| TypeScript   | Programming Language |
| Node.js      | Runtime Environment  |
| Express.js   | REST API Framework   |
| PostgreSQL   | Relational Database  |
| Prisma ORM   | Database ORM         |
| JWT          | Authentication       |
| Stripe       | Payment Processing   |
| Bcrypt       | Password Hashing     |
| Zod          | Request Validation   |
| Git & GitHub | Version Control      |

---

# 📂 Project Structure

```text
src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── property/
│   │   ├── category/
│   │   ├── rentalRequest/
│   │   ├── payment/
│   │   └── review/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── config/
├── prisma/
├── server.ts
└── app.ts
```

---

# 👥 User Roles

## Tenant

* Browse properties
* Search and filter listings
* Submit rental requests
* Make payments
* Leave reviews
* View rental history

## Landlord

* Create property listings
* Manage properties
* Approve or reject rental requests
* View payment status
* Manage listings

## Admin

* Manage users
* Manage categories
* Moderate properties
* Monitor rental requests
* Oversee platform activities

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/your-username/rentnest-api.git
```

Move into the project

```bash
cd rentnest-api
```

Install dependencies

```bash
pnpm install
```

Create a `.env` file

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

BCRYPT_SALT_ROUNDS=
PORT=5000
```

Generate Prisma Client

```bash
pnpm prisma generate
```

Run migrations

```bash
pnpm prisma migrate dev
```

Start the development server

```bash
pnpm dev
```

---

# 📌 Main API Modules

* Authentication
* Users
* Properties
* Categories
* Rental Requests
* Payments
* Reviews

---

# 🔒 Security

* JWT Authentication
* Password Hashing using Bcrypt
* Role-Based Authorization
* Request Validation
* Environment Variable Protection
* Secure Payment Processing

---

# 📈 Future Improvements

* Email Notifications
* Real-time Chat
* Property Image Upload
* Saved Properties
* Wishlist
* Location-based Search
* Admin Analytics Dashboard
* Docker Support
* CI/CD Pipeline
* API Documentation with Swagger

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Mahib Alam Khan**

* Computer Science & Engineering Student
* Full Stack Developer
* Passionate about building scalable web applications

---

⭐ If you found this project helpful, consider giving it a star.
