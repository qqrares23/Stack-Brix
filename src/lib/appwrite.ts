import {Client, Account , Databases, Storage, Realtime } from "appwrite";

const client = new Client();
client
    .setEndpoint(required(import.meta.env.VITE_APPWRITE_ENDPOINT, 'VITE_APPWRITE_ENDPOINT'))
    .setProject(required(import.meta.env.VITE_APPWRITE_PROJECT_ID, 'VITE_APPWRITE_PROJECT_ID'));

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const realtime = new Realtime(client);

export const DB = required(import.meta.env.VITE_APPWRITE_DATABASE_ID, 'VITE_APPWRITE_DATABASE_ID');
export const COL = {
    LIBRARIES: required(import.meta.env.VITE_APPWRITE_COLLECTION_LIBRARIES, 'VITE_APPWRITE_COLLECTION_LIBRARIES'),
    SUBMISSIONS: required(import.meta.env.VITE_APPWRITE_COLLECTION_SUBMISSIONS, 'VITE_APPWRITE_COLLECTION_SUBMISSIONS'),
    DOCUMENTS: required(import.meta.env.VITE_APPWRITE_COLLECTION_DOCUMENTS, 'VITE_APPWRITE_COLLECTION_DOCUMENTS'),
    BLOCKS: required(import.meta.env.VITE_APPWRITE_COLLECTION_BLOCKS, 'VITE_APPWRITE_COLLECTION_BLOCKS'),
    CATEGORIES: required(import.meta.env.VITE_APPWRITE_COLLECTION_CATEGORIES, 'VITE_APPWRITE_COLLECTION_CATEGORIES')        
} as const;

export const BUCKET = required(import.meta.env.VITE_APPWRITE_BUCKET_ID, 'VITE_APPWRITE_BUCKET_ID');

function required(value: string | undefined, name: string): string {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
