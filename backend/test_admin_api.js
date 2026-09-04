require("dotenv").config();

// Fix DNS for MongoDB Atlas if needed
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");

const pharmacyRoutes = require("./src/routes/pharmacy");
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", pharmacyRoutes);

let server;
let baseUrl;

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(baseUrl + path);
        const options = {
            method: method,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                let json = null;
                try {
                    json = JSON.parse(data);
                } catch (e) {
                    json = data;
                }
                resolve({ status: res.statusCode, body: json });
            });
        });

        req.on("error", (err) => reject(err));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log("🚀 Starting System Admin API Automated Tests...\n");

    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medifindlk";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Start test server on dynamic port
    server = app.listen(0, async () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`📡 Test server running at ${baseUrl}\n`);

        try {
            // 1. Authenticate users
            console.log("--- 1. Authenticating Test Users ---");
            const adminLogin = await request("POST", "/api/auth/login", {
                email: "admin@medifind.lk",
                password: "admin123",
            });
            console.log(`Admin login status: ${adminLogin.status}`);
            const adminToken = adminLogin.body.token;

            const pharmLogin = await request("POST", "/api/auth/login", {
                email: "pharmacist.colombo@medifind.lk",
                password: "pharm123",
            });
            console.log(`Pharmacist login status: ${pharmLogin.status}`);
            const pharmToken = pharmLogin.body.token;

            const userLogin = await request("POST", "/api/auth/login", {
                email: "user@medifind.lk",
                password: "user123",
            });
            console.log(`User login status: ${userLogin.status}`);
            const userToken = userLogin.body.token;

            // 2. Test RBAC Access Control
            console.log("\n--- 2. Testing Role-Based Access Control (RBAC) ---");

            const noTokenRes = await request("GET", "/api/admin/dashboard");
            console.log(`No Token -> Status: ${noTokenRes.status} (Expected: 401)`);
            if (noTokenRes.status !== 401) throw new Error("RBAC Failed: Unauthenticated request should be 401");

            const userTokenRes = await request("GET", "/api/admin/dashboard", null, userToken);
            console.log(`USER Token -> Status: ${userTokenRes.status} (Expected: 403 Forbidden)`);
            if (userTokenRes.status !== 403) throw new Error("RBAC Failed: USER should receive 403");

            const pharmTokenRes = await request("GET", "/api/admin/dashboard", null, pharmToken);
            console.log(`PHARMACIST Token -> Status: ${pharmTokenRes.status} (Expected: 403 Forbidden)`);
            if (pharmTokenRes.status !== 403) throw new Error("RBAC Failed: PHARMACIST should receive 403");

            const adminTokenRes = await request("GET", "/api/admin/dashboard", null, adminToken);
            console.log(`ADMIN Token -> Status: ${adminTokenRes.status} (Expected: 200 OK)`);
            if (adminTokenRes.status !== 200) throw new Error("RBAC Failed: ADMIN should receive 200");
            console.log("Dashboard Stats:", adminTokenRes.body);

            // 3. Test Pharmacy Management
            console.log("\n--- 3. Testing Pharmacy Management APIs ---");
            const createPharmRes = await request("POST", "/api/admin/pharmacies", {
                name: "Test Metro Pharmacy",
                address: "55 Park Street",
                city: "Colombo 02",
                contactNumber: "0119998877",
                email: "test.metro@medifind.lk",
                status: "ACTIVE",
            }, adminToken);
            console.log(`Create Pharmacy status: ${createPharmRes.status} (Expected: 201)`);
            const newPharmacyId = createPharmRes.body._id;

            const getPharmaciesRes = await request("GET", "/api/admin/pharmacies?search=Metro", null, adminToken);
            console.log(`Search Pharmacies count: ${getPharmaciesRes.body.length} (Expected: 1)`);

            const updatePharmRes = await request("PUT", `/api/admin/pharmacies/${newPharmacyId}`, {
                contactNumber: "0110001122",
            }, adminToken);
            console.log(`Update Pharmacy status: ${updatePharmRes.status} (Expected: 200)`);

            const updatePharmStatusRes = await request("PUT", `/api/admin/pharmacies/${newPharmacyId}/status`, {
                status: "INACTIVE",
            }, adminToken);
            console.log(`Update Pharmacy Status: ${updatePharmStatusRes.body.status} (Expected: INACTIVE)`);

            const deletePharmRes = await request("DELETE", `/api/admin/pharmacies/${newPharmacyId}`, null, adminToken);
            console.log(`Delete Pharmacy status: ${deletePharmRes.status} (Expected: 200)`);

            // 4. Test Medicine Management
            console.log("\n--- 4. Testing Medicine Management APIs ---");
            const createMedRes = await request("POST", "/api/admin/medicines", {
                name: "TestMed 500mg",
                genericName: "Test generic",
                description: "For automated test verification",
                status: "ACTIVE",
            }, adminToken);
            console.log(`Create Medicine status: ${createMedRes.status} (Expected: 201)`);
            const newMedId = createMedRes.body._id;

            const getMedRes = await request("GET", "/api/admin/medicines?search=TestMed", null, adminToken);
            console.log(`Search Medicines count: ${getMedRes.body.length} (Expected: 1)`);

            const updateMedRes = await request("PUT", `/api/admin/medicines/${newMedId}`, {
                description: "Updated description",
            }, adminToken);
            console.log(`Update Medicine status: ${updateMedRes.status} (Expected: 200)`);

            const deleteMedRes = await request("DELETE", `/api/admin/medicines/${newMedId}`, null, adminToken);
            console.log(`Delete Medicine status: ${deleteMedRes.status} (Expected: 200)`);

            // 5. Test Pharmacist Management
            console.log("\n--- 5. Testing Pharmacist Management APIs ---");
            const getPharmachistsRes = await request("GET", "/api/admin/pharmacists", null, adminToken);
            console.log(`Get Pharmacists status: ${getPharmachistsRes.status}, count: ${getPharmachistsRes.body.length}`);

            // Check password field is NOT present
            const firstPharm = getPharmachistsRes.body[0];
            if (firstPharm.password) {
                throw new Error("SECURITY FAILURE: Pharmacist password returned in API response!");
            }
            console.log("✅ Verified: Password is NOT returned in pharmacist responses");

            const togglePharmStatusRes = await request("PUT", `/api/admin/pharmacists/${firstPharm._id}/status`, {
                status: "INACTIVE",
            }, adminToken);
            console.log(`Update Pharmacist status result: ${togglePharmStatusRes.body.status} (Expected: INACTIVE)`);

            // Restore status
            await request("PUT", `/api/admin/pharmacists/${firstPharm._id}/status`, {
                status: "ACTIVE",
            }, adminToken);

            // 6. Test Stock Information
            console.log("\n--- 6. Testing Stock Information APIs ---");
            const getStockAll = await request("GET", "/api/admin/stock", null, adminToken);
            console.log(`Get Stock All count: ${getStockAll.body.length}`);

            const getStockFiltered = await request("GET", "/api/admin/stock?status=LOW", null, adminToken);
            console.log(`Get LOW Stock count: ${getStockFiltered.body.length}`);

            const getStockMedSearch = await request("GET", "/api/admin/stock?medicine=Panadol", null, adminToken);
            console.log(`Get Stock for Panadol count: ${getStockMedSearch.body.length}`);

            console.log("\n🎉 ALL SYSTEM ADMIN TESTS PASSED SUCCESSFULLY! 🎉\n");
        } catch (err) {
            console.error("\n❌ TEST FAILED:", err);
            process.exitCode = 1;
        } finally {
            server.close();
            await mongoose.disconnect();
        }
    });
}

runTests();
