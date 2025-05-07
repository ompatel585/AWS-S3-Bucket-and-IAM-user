require('dotenv').config();
const fs = require('fs');
const {
    S3Client,
    CreateBucketCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand,
    DeleteBucketCommand,
    ListObjectVersionsCommand,
    DeleteObjectsCommand,
    PutBucketPolicyCommand
} = require('@aws-sdk/client-s3');



const REGION = process.env.AWS_REGION;
const BUCKET = process.env.BUCKET_NAME;

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.OMPATEL_ACCESS_KEY_ID,
        secretAccessKey: process.env.OMPATEL_SECRET_ACCESS_KEY,
    }
});

async function createBucket() {
    try {
        const command = new CreateBucketCommand({ Bucket: BUCKET });
        await s3.send(command);
        console.log("Bucket created successfully.");
    } catch (err) {
        console.error("Error creating bucket:", err.message);
    }
}

async function applyBucketPolicy() {
    const accountId = "929692839019";
    const userArn = `arn:aws:iam::${accountId}:user/OmPatel`;

    const policy = {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "AllowOmPatelUserAccess",
                Effect: "Allow",
                Principal: {
                    AWS: userArn
                },
                Action: "s3:*",
                Resource: [
                    `arn:aws:s3:::${BUCKET}`,
                    `arn:aws:s3:::${BUCKET}/*`
                ]
            }
        ]
    };

    try {
        const command = new PutBucketPolicyCommand({
            Bucket: BUCKET,
            Policy: JSON.stringify(policy)
        });
        await s3.send(command);
        console.log(" Bucket policy applied to allow OmPatel.");
    } catch (err) {
        console.error(" Error setting bucket policy:", err.message);
    }
}

async function uploadFile() {
    try {
        const fileContent = fs.readFileSync('test.txt');
        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: 'test.txt',
            Body: fileContent
        });
        await s3.send(command);
        console.log("File uploaded: 'test.txt'");
    } catch (err) {
        console.error("Error uploading file:", err.message);
    }
}

async function listFiles() {
    try {
        const command = new ListObjectsV2Command({ Bucket: BUCKET });
        const res = await s3.send(command);
        console.log("Files in bucket:");
        res.Contents?.forEach(file => console.log("-", file.Key));
    } catch (err) {
        console.error("Error listing files:", err.message);
    }
}

async function deleteFile() {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: "test.txt",
        });
        await s3.send(command);
        console.log("File deleted: test.txt");
    } catch (err) {
        console.error("Error deleting file:", err.message);
    }
}
async function emptyBucket() {
    try {
        const listCommand = new ListObjectVersionsCommand({ Bucket: BUCKET });
        const data = await s3.send(listCommand);

        const objects = [];
        data.Versions?.forEach(v => objects.push({ Key: v.Key, VersionId: v.VersionId }));
        data.DeleteMarkers?.forEach(m => objects.push({ Key: m.Key, VersionId: m.VersionId }));

        if (objects.length === 0) {
            console.log("Bucket is already empty.");
            return;
        }

        const deleteCommand = new DeleteObjectsCommand({
            Bucket: BUCKET,
            Delete: { Objects: objects }
        });

        await s3.send(deleteCommand);
        console.log(`Deleted ${objects.length} objects (versions + markers).`);
    } catch (err) {
        console.error("Error emptying bucket:", err.message);
    }
}

async function deleteBucket() {
    try {
        await emptyBucket();
        const command = new DeleteBucketCommand({ Bucket: BUCKET });
        await s3.send(command);
        console.log("Bucket deleted successfully.");
    } catch (err) {
        console.error("Error deleting bucket:", err.message);
    }
}

(async () => {
    await createBucket();
    await applyBucketPolicy();
    await uploadFile();
    await listFiles();
    //await deleteFile();
    //await deleteBucket(); 
})();
