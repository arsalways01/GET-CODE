// ============================================
// FILE: jsjsg.js
// KONFIGURASI FIREBASE (RAHASIA)
// ============================================

// Firebase configuration (dari Anda)
const firebaseConfig = { 
    apiKey: "AIzaSyB2-Z1kNTdvhzSZHdkxeTU9sGI66YwQPrY", 
    authDomain: "arsalwaysss-e0226.firebaseapp.com", 
    projectId: "arsalwaysss-e0226", 
    storageBucket: "arsalwaysss-e0226.firebasestorage.app", 
    messagingSenderId: "762015150179", 
    appId: "1:762015150179:web:a936f5ef5a3971bd5fc856" 
};

// Inisialisasi Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Inisialisasi services
const app = firebase.app();
const db = firebase.firestore();
const storage = firebase.storage();

// Template dialog awal (dari RIZKY STORE)
const DIALOG_TEMPLATE = `...`; // (isi dengan template lengkap dari atas)

// Fungsi untuk menyimpan website ke Firebase
async function saveWebsite(htmlContent, title, deviceId) {
    try {
        // Gabungkan HTML user dengan dialog
        const finalHtml = DIALOG_TEMPLATE.replace('{WEB_CONTENT}', htmlContent);
        
        // Buat nama file unik
        const fileName = `website_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.html`;
        const storagePath = `websites/${fileName}`;
        
        // Upload ke Firebase Storage
        const storageRef = storage.ref().child(storagePath);
        await storageRef.putString(finalHtml, 'utf-8', {
            contentType: 'text/html'
        });
        
        // Dapatkan URL download
        const url = await storageRef.getDownloadURL();
        
        // Simpan metadata ke Firestore
        const websiteData = {
            title: title,
            url: url,
            storagePath: storagePath,
            deviceId: deviceId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: 0
        };
        
        const docRef = await db.collection('websites').add(websiteData);
        
        return {
            id: docRef.id,
            url: url,
            ...websiteData
        };
        
    } catch (error) {
        console.error('Error saving website:', error);
        throw error;
    }
}

// Export ke global
window.saveWebsite = saveWebsite;
window.db = db;
window.storage = storage;
window.app = app;
