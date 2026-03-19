// One-time script: deletes ALL events from Firestore
// Run with: node scripts/clear-events.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');
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

async function clearEvents() {
  const snap = await getDocs(collection(db, 'events'));
  if (snap.empty) {
    console.log('No events found in Firestore.');
    process.exit(0);
  }

  let deleted = 0;
  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    console.log(`Deleting: ${data.title || docSnap.id}`);
    await deleteDoc(doc(db, 'events', docSnap.id));
    deleted++;
  }

  console.log(`\n✅ Done! Deleted ${deleted} event(s) from Firestore.`);
  process.exit(0);
}

clearEvents().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
