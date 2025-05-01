require('dotenv').config(); 
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const iam = new AWS.IAM();

const createUser = async (username) => {
  const params = { UserName: username };
  try {
    const result = await iam.createUser(params).promise();
    console.log(' User created:', result.User.UserName);
    return result.User;
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

const createGroup = async (groupName) => {
  const params = { GroupName: groupName };
  try {
    const result = await iam.createGroup(params).promise();
    console.log(' Group created:', result.Group.GroupName);
    return result.Group;
  } catch (error) {
    console.error(' Error creating group:', error.message);
  }
};

const addUserToGroup = async (username, groupName) => {
  const params = { GroupName: groupName, UserName: username };
  try {
    await iam.addUserToGroup(params).promise();
    console.log(` User ${username} added to group ${groupName}`);
  } catch (error) {
    console.error(' Error adding user to group:', error.message);
  }
};

const attachPolicyToGroup = async (groupName, policyArn) => {
  const params = { GroupName: groupName, PolicyArn: policyArn };
  try {
    await iam.attachGroupPolicy(params).promise();
    console.log(` Policy ${policyArn} attached to group ${groupName}`);
  } catch (error) {
    console.error(' Error attaching policy to group:', error.message);
  }
};

const main = async () => {
  const username = 'newUser';        
  const groupName = 'adminGroup';    

  await createUser(username);
  await createGroup(groupName);
  await addUserToGroup(username, groupName);

  
  const policyArn = 'arn:aws:iam::aws:policy/AdministratorAccess';
  await attachPolicyToGroup(groupName, policyArn);
};

main();
