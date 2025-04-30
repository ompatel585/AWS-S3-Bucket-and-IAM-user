require('dotenv').config();
const fs = require('fs');
const {
    S3Client,
    CreateBucketCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand,
    DeleteBucketCommand
} = require('@aws-sdk/client-s3');

// Load from .env
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.BUCKET_NAME;

// Initialize S3 client
const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Create a new bucket
async function createBucket() {
    try {
        const command = new CreateBucketCommand({ Bucket: BUCKET });
        await s3.send(command);
        console.log("✅ Bucket created:", BUCKET);
    } catch (err) {
        console.error("❌ Create Bucket Error:", err.message);
    }
}

// Upload file
async function uploadFile() {
    try {
        const fileContent = fs.readFileSync('test.txt');
        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: "test.txt",
            Body: fileContent
        });
        await s3.send(command);
        console.log("✅ File uploaded: test.txt");
    } catch (err) {
        console.error("❌ Upload Error:", err.message);
    }
}

// List all files in bucket
async function listFiles() {
    try {
        const command = new ListObjectsV2Command({ Bucket: BUCKET });
        const res = await s3.send(command);
        console.log("📄 Files:");
        res.Contents?.forEach(file => console.log(" -", file.Key));
    } catch (err) {
        console.error("❌ List Error:", err.message);
    }
}

// Delete file
async function deleteFile() {
    try {
        const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: "test.txt" });
        await s3.send(command);
        console.log("🗑️ File deleted: test.txt");
    } catch (err) {
        console.error("❌ Delete File Error:", err.message);
    }
}

// Delete bucket (must be empty)
async function deleteBucket() {
    try {
        const command = new DeleteBucketCommand({ Bucket: BUCKET });
        await s3.send(command);
        console.log("🗑️ Bucket deleted:", BUCKET);
    } catch (err) {
        console.error("❌ Delete Bucket Error:", err.message);
    }
}

// Run all
(async () => {
    //await createBucket();
    //await uploadFile();
    await listFiles();
    //await deleteFile();
    //await deleteBucket();
})();
