import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import { deleteCollectionByReference } from './firebase-util.function';

const db = admin.firestore();
const storage = admin.storage().bucket();

export const createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate((user) => {
    return db.doc(`users/${user.uid}`).set({
      uid: user.uid,
      name: user.displayName,
      avaterURL: user.photoURL,
      email: user.email,
      createdAt: new Date(),
      admin: false,
      eatCount: 0,
      isEatenBreakfast: false,
      isEatenLunch: false,
      isEatenDinner: false,
      isCompletedCreateMyMenuTutorial: false,
      isCompletedHomeTutorial: false,
      isCreatedMyMenu: false,
      postCount: 0,
    });
  });

export const deleteUserAccount = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete(async (user) => {
    const userId = user.uid;
    const deleteUser = db.doc(`users/${userId}`).delete();
    const myMenu = db.collection('myMenus').where('creatorId', '==', userId);
    const deleteMyMenu = deleteCollectionByReference(myMenu);
    const posts = db.collection('posts').where('creatorId', '==', userId);
    const deleteAllPosts = deleteCollectionByReference(posts);
    const deleteStorageData = storage.file(`users/${userId}`).delete();
    return Promise.all([
      deleteUser,
      deleteMyMenu,
      deleteAllPosts,
      deleteStorageData,
    ]);
  });
