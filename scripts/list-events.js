const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listEvents() {
  console.log('Fetching events from Firestore...');
  const snap = await getDocs(collection(db, 'events'));
  console.log(`Found ${snap.size} events.`);
  
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`- ID: ${doc.id}`);
    console.log(`  Title: ${data.title}`);
    console.log(`  Banner: ${data.banner}`);
    console.log(`  Status: ${data.status}`);
    console.log('---');
  });
  process.exit(0);
}

listEvents().catch(err => {
  console.error(err);
  process.exit(1);
});
