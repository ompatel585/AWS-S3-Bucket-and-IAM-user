require('dotenv').config(); // Load environment variables from .env
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// ... your IAM logic continues here


 // Create IAM service object
 const iam = new AWS.IAM();
 // Function to create an IAM user
 const createUser = async (username) => {
  const params = {
    UserName: username,  // The username of the IAM user to be created
  };
  try {
    const result = await iam.createUser(params).promise();
    console.log('User created:', result.User.UserName);
    return result.User;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
 // Function to create an IAM group
 const createGroup = async (groupName) => {
  const params = {
    GroupName: groupName,  // The name of the IAM group to be created
  };
  try {
    const result = await iam.createGroup(params).promise();
    console.log('Group created:', result.Group.GroupName);
    return result.Group;
  } catch (error) {
    console.error('Error creating group:', error);
  }
 };
 // Function to add the user to the group
 const addUserToGroup = async (username, groupName) => {
  const params = {
    GroupName: groupName,  // The name of the IAM group
    UserName: username,    // The name of the IAM user to add
  };
  try {
    const result = await iam.addUserToGroup(params).promise();
    console.log(`User ${username} added to group ${groupName}`);
  } catch (error) {
    console.error('Error adding user to group:', error);
  }
 };
 // Main logic to create user, group, and add user to the group
 const main = async () => {
  const username = 'newUser';    // Replace with desired user name
  const groupName = 'newGroup';  // Replace with desired group name
  // Create a user
  const user = await createUser(username);
  // Create a group
  const group = await createGroup(groupName);
  // Add the user to the group
  await addUserToGroup(username, groupName);
 };
 // Run the main function
 main();