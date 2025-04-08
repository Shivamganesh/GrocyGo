# 🛒 GrocyGo – Blinkit-style Grocery App

A full-stack grocery delivery mobile app inspired by Blinkit, built with **React Native CLI**, **Fastify**, **Zustand**, **WebSockets**, **MongoDB**, and **Google Maps**. GrocyGo offers both **customer** and **delivery** portals along with an **admin panel**, delivering a real-time, modern experience.

---

## 🚀 Features

- 📱 **Customer & Delivery Portals**
  - Place orders, track status live, and manage deliveries
- 🌐 **Real-Time Updates with WebSockets**
  - Live order tracking and delivery progress
- 🔐 **JWT-Based Authentication**
  - Secure login system for all user roles
- 🗺️ **Google Maps Integration**
  - Address selection and route tracking for delivery agents
- 🎨 **Modern UI**
  - Clean and responsive design with intuitive UX
- 🧠 **Zustand for State Management**
  - Lightweight, efficient state handling across the app
- 🛠️ **Fastify Backend + MongoDB**
  - High-performance API with persistent data storage

---

## 🖥️ Tech Stack

- **Frontend**: React Native CLI, Zustand
- **Backend**: Node.js, Fastify, WebSocket
- **Database**: MongoDB (with Mongoose or native driver)
- **Authentication**: JWT
- **Maps**: Google Maps API

---

## 📱 APK Download

➡️ [Download APK](#) *(coming soon)*

---

## 🧪 Running Locally

### Prerequisites

- Node.js
- Android Studio with emulator or real device
- Google Maps API key
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Steps

```bash
git clone https://github.com/Shivamganesh/GrocyGo.git
cd GrocyGo
npm install
npx react-native run-android


### For backend, run the Fastify server separately in /server or backend folder
