import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

export { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail };
export type { User };

/**
 * Fetches data from a Firestore collection. If the collection is empty,
 * it seeds the collection with the provided initial data.
 */
export async function getCollectionData<T>(collectionName: string, initialData: T[]): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty && initialData.length > 0) {
      console.log(`Seeding collection: ${collectionName}...`);
      const seededData: T[] = [];
      for (const item of initialData) {
        // Use existing 'id' or default to custom document ID
        const docId = (item as any).id || doc(colRef).id;
        const finalItem = { ...item, id: docId };
        await setDoc(doc(db, collectionName, docId), finalItem);
        seededData.push(finalItem);
      }
      return seededData;
    }
    
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as T);
  } catch (error) {
    console.error(`Error loading or seeding ${collectionName}:`, error);
    return initialData;
  }
}

/**
 * Saves or updates a document in Firestore.
 */
export async function saveDocument<T>(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    if (!docId) {
      console.warn(`[Firestore] Attempted to save document to ${collectionName} without a docId.`);
      return;
    }
    // Sanitize data: remove any functions and ensure it's a plain object
    const sanitizedData = JSON.parse(JSON.stringify(data));
    await setDoc(doc(db, collectionName, docId), sanitizedData, { merge: true });
  } catch (error) {
    console.error(`Error saving document ${docId} in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Adds a new document to a Firestore collection with an auto-generated ID.
 */
export async function addDocument(collectionName: string, data: any): Promise<string> {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    // Write the auto-generated ID back into the document to maintain interface consistency
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Deletes a document from Firestore.
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document ${docId} in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Syncs changes from local state to Firestore by comparing previous and next state arrays.
 */
export async function syncCollectionToFirestore<T extends { id: string }>(
  collectionName: string,
  prev: T[],
  next: T[]
): Promise<void> {
  try {
    // Determine added/updated items
    // If prev is empty, we check EVERYTHING in next against Firestore (safe for small collections)
    const updates = next.filter(nextItem => {
      const prevItem = prev.find(p => p.id === nextItem.id);
      return !prevItem || JSON.stringify(prevItem) !== JSON.stringify(nextItem);
    });

    if (updates.length > 0) {
      console.log(`[Firestore Sync] ${collectionName}: Syncing ${updates.length} updates/additions...`);
      await Promise.all(updates.map(item => saveDocument(collectionName, item.id, item)));
      console.log(`[Firestore Sync] ${collectionName}: Successfully synced updates.`);
    }

    // Determine deletions (only if prev is NOT empty to avoid clearing on first load)
    if (prev.length > 0) {
      const deletions = prev.filter(prevItem => !next.find(n => n.id === prevItem.id));
      if (deletions.length > 0) {
        console.log(`[Firestore Sync] ${collectionName}: Syncing ${deletions.length} deletions...`);
        await Promise.all(deletions.map(item => deleteDocument(collectionName, item.id)));
        console.log(`[Firestore Sync] ${collectionName}: Successfully synced deletions.`);
      }
    }
  } catch (error) {
    console.error(`Error syncing collection ${collectionName} to Firestore:`, error);
    throw error;
  }
}

