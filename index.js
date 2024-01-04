const express = require('express')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const User = require('./mongodb_models/user_schema')
const Visitor = require('./mongodb_models/visitor_schema')
const Pass = require('./mongodb_models/visitor_pass_schema')
const jwt = require('jsonwebtoken')
const app = express()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const port = process.env.PORT || 3000;
const JWT_SECRET='12bob12ou2b1ob';


app.use(express.json())

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'FATIN BENR3433 INFORMATION SECURITY assignment G15',
        version: '1.0.0',
      },
      tags:[
        { name: 'test', description: 'testing endpoints' },
        { name: 'User', description: 'Endpoints related to users' },
        { name: 'Visitor', description: 'Endpoints related to visitor' },
        { name: 'Read', description: 'Endpoints to read own file' },
        { name: 'For Admin Only', description: 'Endpoints for admin to manage user' },
      ],
      components: {
        securitySchemes: {
            Authorization: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                value: "Bearer <JWT token here>",
                description:"this is for authentication only, to log out, please use the logout api. Logout here won't log you out of the account"
            }
          }
        },
      servers:[
        {
            url: 'https://deen2345.azurewebsites.net/'
            //remember to change current ip address in MongoDB Network Access List
            //url: 'http://localhost:3000'
        }
      ]
    },
    apis: ['./swagger.js'],
  };
  
  const openapiSpecification = swaggerJsdoc(options);
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


 mongoose.connect('mongodb+srv://deenbrembo:hafizudin202@cluster0.vlncwtu.mongodb.net/WJ.VMS')
 .then(()=>{
     console.log('connected to mongodb')
     app.listen(port,() => {
         console.log(`Node Api is running on port ${port}`)
     })
 }).catch((error)=>{
     console.log(error)
 })



 app.get('/', (req, res) => {
    res.send('Hello World!')
 })



 app.post('/register', async(req, res) => {
    try {
        const { username, password, name} = req.body;
        const a = await User.findOne({'username':req.body.username})
        const hash = await bcrypt.hash(password, 10)
        if(a == null){
          const request ={
            username: username,
            password: hash,
            name: name,
            role: "user",
            login_status: false
          }  
          const user = await User.create(request)
          const responsemessage= 'User registered successfully';
          res.status(200).json({username:user.username,name:user.name, message: responsemessage})}
        else{
            res.status(409).send('Username has been taken');
        }        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})


app.post('/login',async(req,res)=>{
  const {username,password}=req.body
  try {
    const b = await User.findOne({username:req.body.username})
    if(b==null){
      res.status(404).send('Username not found');
    }else{
      if(b.login_status==true){
        res.status(409).send('User is already logged in');
      }else{
        const ismatch = await bcrypt.compare(req.body.password,b.password);      
        if(ismatch != true){
          res.status(401).send('Unauthorized: Wrong password');
        }else{
        await User.updateOne({username:req.body.username},{$set:{login_status:true}})
        const login_user= await User.findOne({username:req.body.username})
        access_token=jwt.sign({username:login_user.username,user_id:login_user._id},JWT_SECRET)
        res.json({username:login_user.username,message:"login successful",accesstoken: access_token})
      }
      }
      }}
   catch (error) {
    console.log(error.message);
        res.status(500).json({message: error.message})
  }
})

//middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, login_user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = login_user
    next()
  })
}

//test jwt
app.get('/showjwt',authenticateToken,(req,res)=>{
  res.send(req.user)
})

//user logout(cannot interact with api after log out)
app.patch('/logout', async (req, res) => {
  const { username } = req.body;
  try {
    const a = await User.findOne({ username: req.body.username });
    if (a == null) {
      res.status(404).send('Username not found');
    } else {
      if (a.login_status !== true) {
        res.status(400).send("User has already logged out");
      } else {
        await User.updateOne({ username: req.body.username }, { $set: { login_status: false } });
        res.status(200).send("Successfully logged out");
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * Endpoint to register a visitor for a user (1 user account only 1 visitor)
 */
app.post('/visitor/register', authenticateToken, async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUser = await User.findOne({ _id: req.user.user_id });
    if (!loggedInUser || loggedInUser.login_status !== true) {
      return res.status(401).send('Please login');
    }

    // Check if the user already has a visitor ID
    if (loggedInUser.visitor_id != null) {
      return res.status(400).send('Visitor has been created for this user (1 user 1 visitor)');
    }

    // Create a visitor record
    const newVisitorData = {
      full_name: req.body.full_name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      license_number: req.body.license_number,
      user_id: req.user.user_id // Link the visitor to the logged-in user
    };

    // Create the visitor
    const visitor = await Visitor.create(newVisitorData);

    // Update the user's visitor_id field with the newly created visitor's ID
    await User.updateOne({ _id: req.user.user_id }, { $set: { 'visitor_id': visitor._id } });

    // Return the newly created visitor details
    return res.status(200).json(visitor);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error occurred' });
  }
});


/**
 * Endpoint to create a visitor pass
 */
app.post('/visitor/visitor_pass', authenticateToken, async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUser = await User.findOne({ _id: req.user.user_id });
    if (!loggedInUser || loggedInUser.login_status !== true) {
      return res.status(401).send('Please login');
    }

    // Find the visitor associated with the logged-in user
    const visitor = await Visitor.findOne({ user_id: req.user.user_id });
    if (!visitor) {
      return res.status(404).send('Visitor not found for this user');
    }

    // Create a new visitor pass
    const newVisitorPass = {
      visitor_id: visitor._id,
      purpose_of_visit: req.body.purpose_of_visit,
      host_name: req.body.host_name,
      host_address: req.body.host_address,
      remarks: req.body.remarks
    };

    // Save the visitor pass details
    const createdVisitorPass = await Pass.create(newVisitorPass);

    // Update the visitor with the newly created visitor pass ID
    await Visitor.updateOne(
      { _id: visitor._id },
      { $push: { 'visitor_pass_id': createdVisitorPass._id } }
    );

    // Return the newly created visitor pass details
    return res.status(200).json(createdVisitorPass);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error occurred' });
  }
});


/**
 * Endpoint to check in a visitor pass by ID
 */
app.patch('/visitor/visitor_pass/checkin/:id', authenticateToken, async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUser = await User.findOne({ _id: req.user.user_id });
    if (!loggedInUser || loggedInUser.login_status !== true) {
      return res.status(401).send('Please login');
    }

    // Check if the user has registered as a visitor
    if (loggedInUser.visitor_id == null) {
      return res.status(400).send('Please register as a visitor');
    }

    // Check if the visitor pass is already checked in
    const existingVisitorPass = await Pass.findOne({ _id: req.params.id, checkin_time: { $exists: true } });
    if (existingVisitorPass) {
      return res.status(400).send('Visitor pass already checked in');
    }

    // Update check-in time for the visitor pass
    const date = new Date().toISOString();
    const updatedVisitorPass = await Pass.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { checkin_time: date } },
      { new: true } // Return the updated document
    );

    // Check if the visitor pass was updated
    if (!updatedVisitorPass) {
      return res.status(404).send('Visitor pass not found');
    }

    // Return success message along with the updated visitor pass
    res.status(200).json({ message: 'Visitor pass checked in successfully', updatedPass: updatedVisitorPass });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error occurred' });
  }
});

/**
 * Endpoint to check out all visitor pass by ID
 */
app.patch('/visitor/visitor_pass/checkout/:id', authenticateToken, async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUser = await User.findOne({ _id: req.user.user_id });
    if (!loggedInUser || loggedInUser.login_status !== true) {
      return res.status(401).send('Please login');
    }

    // Check if the user has registered as a visitor
    if (loggedInUser.visitor_id == null) {
      return res.status(400).send('Please register as a visitor');
    }

    // Check if the visitor pass exists and was checked in
    const existingVisitorPass = await Pass.findOne({ _id: req.params.id, checkin_time: { $exists: true } });
    if (!existingVisitorPass) {
      return res.status(404).send('Visitor pass not checked in or not found');
    }

    // Check if the visitor pass exists and was checked out
    const alreadyCheckedOutPass = await Pass.findOne({ _id: req.params.id, checkout_time: { $exists: true } });
    if (alreadyCheckedOutPass) {
        return res.status(400).send('Visitor pass already checked out');
    }

    // Update checkout time for the visitor pass
    const date = new Date().toISOString();
    const updatedVisitorPass = await Pass.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { checkout_time: date } },
      { new: true } // Return the updated document
    );

    // Return success message along with the updated visitor pass
    res.status(200).json({ message: 'Visitor pass checked out successfully', updatedPass: updatedVisitorPass });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error occurred' });
  }
});



//read own user profile
app.get('/read/user', authenticateToken, async (req, res) => {
  try {
    // Find the logged-in user document
    const loggedInUser = await User.findOne({ _id: req.user.user_id, login_status: true });

    // Check if the logged-in user exists and is logged in
    if (!loggedInUser) {
      return res.status(401).send('Please login');
    }

    // Respond with the user document
    res.status(200).json(loggedInUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error occurred' });
  }
});

//read own visitor profile
app.get('/read/visitor', authenticateToken, async (req, res) => {
  try {
    // Find the logged-in user document
    const loggedInUser = await User.findOne({ _id: req.user.user_id, login_status: true });

    // Check if the logged-in user exists and is logged in
    if (!loggedInUser) {
      return res.status(401).send('Please login');
    }

    const associatedVisitors = await Visitor.findOne({ _id: loggedInUser.visitor_id });
    res.status(200).json(associatedVisitors);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error occurred' });
  }
});

//read all own visitor_pass 
app.get('/read/visitor_pass', authenticateToken, async (req, res) => {
  try {
    // Find the logged-in user document
    const loggedInUser = await User.findOne({ _id: req.user.user_id, login_status: true });

    // Check if the logged-in user exists and is logged in
    if (!loggedInUser) {
      return res.status(401).send('Please login');
    }

    const passList = await Pass.find({ visitor_id: loggedInUser.visitor_id });
    res.status(200).json(passList);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error occurred' });
  }
});

// Read one visitor pass based on its ID
app.get('/read/visitor_pass/:id', authenticateToken, async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUser = await User.findOne({ _id: req.user.user_id });
    if (!loggedInUser || loggedInUser.login_status !== true) {
      return res.status(401).send('Please login');
    }

    // Try finding the specific visitor pass
    let a;
    try {
      a = await Pass.findOne({ _id: req.params.id });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }

    if (!a) {
      return res.status(404).json({ message: 'Visitor pass not found' });
    }

    if (loggedInUser.role !== 'admin') {
      // Check if the user has registered as a visitor
      if (loggedInUser.visitor_id == null) {
        return res.status(400).send('Please register as a visitor');
      }

      // Deny access if trying to access other visitor's visitor pass
      p = a.visitor_id !== loggedInUser.visitor_id
      if (p = false) {
        return res.status(403).json({ message: 'Access denied. You are not authorized to view this visitor pass.' });
      }

      // Return the visitor pass if authorized
      return res.status(200).json(a);
    } else {
      // Admin access
      return res.status(200).json(a);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error occurred' });
  }
});


//Admin Dump API
app.get('/admin/dump', authenticateToken, async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ _id: req.user.user_id });

    if (!loggedInUser || loggedInUser.login_status !== true) {
      return res.status(401).send('Please login');
    }

    if (loggedInUser.role !== 'admin') {
      return res.status(403).send('You are not an admin');
    }

    const allUsers = await User.find();
    const allVisitors = await Visitor.find();
    const allPasses = await Pass.find();

    res.status(200).json({
      Users: allUsers,
      Visitors: allVisitors,
      Visitor_Passes: allPasses,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//admin read any document(S)
app.post('/admin/read/:collections', authenticateToken, async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ _id: req.user.user_id });

    // Check user's authentication and admin role
    if (!loggedInUser || loggedInUser.login_status !== true || loggedInUser.role !== 'admin') {
      return res.status(403).send('Unauthorized: Admin access only');
    }

    const collections = req.params.collections;
    const filters = req.body;

    // Validate the requested collections
    const validcollections = ['User', 'Visitor', 'Visitor_Pass'];
    if (!collections || !validcollections.includes(collections)) {
      return res.status(400).send('Invalid or missing collections parameter');
    }

    // Based on the collections parameter, perform the query
    let queryResult;
    if (collections === 'User') {
      queryResult = await User.find(filters);
    } else if (collections === 'Visitor') {
      queryResult = await Visitor.find(filters);
    } else if (collections === 'Visitor_Pass') {
      queryResult = await Pass.find(filters);
    }

    res.status(200).json(queryResult);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//admin update any document(S)
app.post('/admin/update/:id', authenticateToken, async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ _id: req.user.user_id });

    // Check user's authentication and admin role
    if (!loggedInUser || loggedInUser.login_status !== true || loggedInUser.role !== 'admin') {
      return res.status(403).send('Unauthorized: Admin access only');
    }

    const { collections } = req.query;
    const update = req.body;
    const doc_id = req.params.id

    // Validate the requested collections
    const validcollections = ['User', 'Visitor', 'Visitor_Pass'];
    if (!collections || !validcollections.includes(collections)) {
      return res.status(400).send('Invalid or missing collections parameter');
    }

    // Ensure the update object is not empty
    if (Object.keys(update).length === 0) {
      return res.status(400).send('Update object cannot be empty');
    }

    // Based on the collections parameter, perform the update
    let updateresult;

    if (collections === 'User') {
      updateresult = await User.findOneAndUpdate({_id: doc_id},update,{new: true});
    } else if (collections === 'Visitor') {
      updateresult = await Visitor.findOneAndUpdate({_id: doc_id},update,{new: true});
    } else if (collections === 'Visitor_Pass') {
      updateresult = await Pass.findOneAndUpdate({_id: doc_id},update,{new: true});
    }

    res.status(200).json(updateresult);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//admin delete a user and all his visitor and visitor_pass documents
app.delete('/admin/delete/all/user/:id', authenticateToken, async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ _id: req.user.user_id });

    // Check user's authentication and admin role
    if (!loggedInUser || loggedInUser.login_status !== true || loggedInUser.role !== 'admin') {
      return res.status(403).send('Unauthorized: Admin access only');
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).send('User not found');
    }

    // Get the visitor ID from the deleted user
    const visitorId = deletedUser.visitor_id;

    // Delete related data in other collections based on the visitor ID
    await Visitor.deleteMany({ _id: visitorId });
    await Pass.deleteMany({ visitor_id: visitorId });

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
