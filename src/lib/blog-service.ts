import { db, hasFirebaseConfig } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { BlogPost, BlogPostFormData, BlogStatus } from '@/types/blog';

const BLOG_COLLECTION = 'blog_posts';

// Get all blog posts
export async function getAllBlogPosts() {
  if (!hasFirebaseConfig || !db) {
    return [];
  }
  
  const blogRef = collection(db, BLOG_COLLECTION);
  const snapshot = await getDocs(blogRef);
  
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
  
  // Sort by publishDate in descending order on client side
  return posts.sort((a, b) => {
    const dateA = new Date(a.publishDate).getTime();
    const dateB = new Date(b.publishDate).getTime();
    return dateB - dateA;
  });
}

// Get published blog posts
export async function getPublishedBlogPosts() {
  if (!hasFirebaseConfig || !db) {
    return [];
  }
  
  const blogRef = collection(db, BLOG_COLLECTION);
  const q = query(blogRef, where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
  
  // Sort by publishDate in descending order on client side
  return posts.sort((a, b) => {
    const dateA = new Date(a.publishDate).getTime();
    const dateB = new Date(b.publishDate).getTime();
    return dateB - dateA;
  });
}

// Get blog post by ID
export async function getBlogPostById(id: string) {
  if (!hasFirebaseConfig || !db) {
    return null;
  }
  
  const docRef = doc(db, BLOG_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as BlogPost;
  }
  
  return null;
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string) {
  if (!hasFirebaseConfig || !db) {
    return null;
  }
  
  const blogRef = collection(db, BLOG_COLLECTION);
  const q = query(blogRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as BlogPost;
  }
  
  return null;
}

// Note: Storage functionality disabled - images not supported

// Create a new blog post
export async function createBlogPost(postData: BlogPostFormData) {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured');
  }
  
  const newPost = {
    title: postData.title,
    content: postData.content,
    summary: postData.summary,
    slug: postData.slug,
    publishDate: new Date().toISOString(),
    status: postData.status,
    updatedAt: new Date().toISOString(),
    tags: postData.tags || []
    // Note: coverImage field omitted - Storage functionality disabled
  };
  
  const docRef = await addDoc(collection(db, BLOG_COLLECTION), newPost);
  
  return {
    id: docRef.id,
    ...newPost
  } as BlogPost;
}

// Update a blog post
export async function updateBlogPost(id: string, postData: BlogPostFormData) {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured');
  }
  
  const docRef = doc(db, BLOG_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Blog post not found');
  }
  
  const existingPost = docSnap.data() as BlogPost;
  
  const updatedPost = {
    title: postData.title,
    content: postData.content,
    summary: postData.summary,
    slug: postData.slug,
    status: postData.status,
    updatedAt: new Date().toISOString(),
    tags: postData.tags || []
    // Note: coverImage field omitted - Storage functionality disabled
  };
  
  await updateDoc(docRef, updatedPost);
  
  return {
    id,
    ...existingPost,
    ...updatedPost
  } as BlogPost;
}

// Delete a blog post
export async function deleteBlogPost(id: string) {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured');
  }
  
  const docRef = doc(db, BLOG_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Blog post not found');
  }
  
  await deleteDoc(docRef);
  
  return id;
}

// Check if slug is unique
export async function isSlugUnique(slug: string, excludeId?: string) {
  if (!hasFirebaseConfig || !db) {
    return true; // Allow any slug when Firebase is not configured
  }
  
  const blogRef = collection(db, BLOG_COLLECTION);
  const q = query(blogRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return true;
  }
  
  // If we're updating a post, we need to exclude the current post from the check
  if (excludeId && snapshot.docs.length === 1) {
    return snapshot.docs[0].id === excludeId;
  }
  
  return false;
}

// Update blog post status
export async function updateBlogStatus(id: string, status: BlogStatus) {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured');
  }
  
  const docRef = doc(db, BLOG_COLLECTION, id);
  await updateDoc(docRef, { 
    status,
    updatedAt: new Date().toISOString()
  });
  
  return id;
}