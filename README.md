# MediFind LK

## The Selected Problem
Citizens often face significant difficulties and delays in locating specific medications across different pharmacies, especially during critical shortages. The lack of real-time inventory visibility leads to wasted time traveling between dispensaries and potential disruptions in vital treatments.

## The Proposed Solution
**MediFind LK** is a centralized platform connecting patients, pharmacists, and regulatory administrators. It provides a real-time, searchable registry of medicine stock availability across the national pharmaceutical network. Patients can instantly see which nearby pharmacies have their required medication, while pharmacists have a dedicated portal to effortlessly manage and update their inventory statuses.

## Main Features
*   **Public Search & Citizen Portal:** Search for medicines and instantly view nearby pharmacies with available stock.
*   **Pharmacist Dashboard:** Secure portal for SLPC-verified pharmacists to register their dispensary and manage inventory statuses (In Stock, Low Stock, Out of Stock).
*   **Critical Shortages Monitor:** A dedicated view tracking medications that are globally marked as low or out of stock across the network.
*   **System Admin / NMRA Portal:** Regulatory oversight console for health administrators.
*   **Role-based Access Control:** Secure JWT authentication tailored for Citizens, Pharmacists, and Admins.

## Technologies Used
*   **Frontend:** React.js, Vite, React Router, Standard CSS
*   **Backend:** Node.js, Express.js, Mongoose
*   **Database:** MongoDB
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs

## AI Tools Used
*   Chatgpt
*   Google Gemini
*   Claude  

## Team Member Details and Contributions
*   **IT24102295** - Sandaru P.H.B (Contributions: Authentication & Role based Access)
*   **IT24103826** - Ranaweera K.R (Contributions: User Interface and Medicine Search)
*   **IT24103921** - Samarawickrama N.A.N.D (Contributions: Pharmacist Module & Stock Management)
*   **IT24102953** - Yasara R.P.M (Contributions: Admin Module & AI Integration and Development)

## Installation and Execution Instructions

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd MediFindLK-Platforn
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Ensure you have a .env file with MONGO_URI, PORT=5000, and JWT_SECRET
    npm run dev
    ```

3.  **Frontend Setup**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Deployed Application Link
https://medifindlkse34.vercel.app/

## Demonstration Video Link.
https://drive.google.com/drive/folders/1Y33tRmTHZccQPOnJe-6hwvwL4qdHYJNA?usp=sharing

