/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is for testing
 *      tags:
 *        - test
 *      description: This api is used for testing
 *      responses:
 *          200:
 *              description: to test get api
 */



/**
 * @swagger
 * /register:
 *  post:
 *      summary: registration for new users
 *      tags:
 *        - User
 *      description: this api fetch data from mongodb
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/registerinfo'
 *      responses:
 *          200:
 *              description: added successfully
 *              content:
 *                 application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user:
 *                              $ref: '#components/schemas/registersuccessful'
 *          409:
 *              description: Username has been taken
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  $ref: '#components/schemas/errormessage'
 */


/**
 * @swagger
 *  /login:
 *    post:
 *      summary: Login for users
 *      tags:
 *        - User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 username:
 *                  type: string
 *                 password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Successful login
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: Username of the logged-in user
 *                  message:
 *                    type: string
 *                    description: Login successful message
 *                  accesstoken:
 *                    type: string
 *                    description: Generated access token for the logged-in user
 *        401:
 *          description: Unauthorized - Wrong password
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized Wrong password
 *        404:
 *          description: Username not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Username not found
 *        409:
 *          description: User is already logged in
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: User is already logged in
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schemas/errormessage'
 *                
 */


/**
 * @swagger
 *  /showjwt:
 *    get:
 *      summary: Display user information from JWT token
 *      tags:
 *        - test
 *      security:
 *        - Authorization: []
 *      responses:
 *        200:
 *          description: Successful retrieval of user information
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/jwtinfo'
 *                description: User information retrieved from JWT token
 *        401:
 *          description: Unauthorized - Invalid or missing token
 *          
 */



/**
 * @swagger
 *  /logout:
 *    patch:
 *      summary: Logout user
 *      tags:
 *        - User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *      responses:
 *        200:
 *          description: Successfully logged out
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Successfully logged out
 * 
 *        400:
 *          description: User has already logged out or invalid request
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: User has already logged out or invalid request
 * 
 *        404:
 *          description: Username not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Username not found
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schemas/errormessage'
 */


/**
 * @swagger
 *  /visitor/register:
 *    post:
 *      summary: Register a visitor for a user (1 user account only 1 visitor)
 *      tags:
 *        - Visitor
 *      security:
 *        - Authorization: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  full_name:
 *                    type: string
 *                  phone_number:
 *                    type: string
 *                  email:
 *                    type: string
 *                    format: email
 *                  license_number:
 *                    type: string
 *               required:
 *                  - full_name
 *                  - phone_number
 *                  - email
 *                  - license_number
 *      responses:
 *        200:
 *          description: Visitor registered successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/Visitor'
 * 
 *        400:
 *          description: Visitor already created for this user
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Visitor has been created for this user (1 user 1 visitor)
 * 
 *        401:
 *          description: Unauthorized - User not logged in
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Please login
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'
 */


/**
 * @swagger
 *  /visitor/visitor_pass:
 *    post:
 *      summary: Create a visitor pass
 *      tags:
 *        - Visitor
 *      security:
 *        - Authorization: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                purpose_of_visit:
 *                  type: string
 *                host_name:
 *                  type: string
 *                host_address:
 *                  type: string
 *                remarks:
 *                  type: string
 *               required:
 *                  - purpose_of_visit
 *                  - host_name
 *                  - host_address
 *      responses:
 *        200:
 *          description: Visitor pass created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/Pass'
 * 
 *        401:
 *          description: Unauthorized - User not logged in
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Please login
 * 
 *        404:
 *          description: Visitor not found for this user
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Visitor not found for this user
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'
 */


/**
 * @swagger
 *  /visitor/visitor_pass/checkin/{id}:
 *    patch:
 *      summary: Check in a visitor pass by ID
 *      tags:
 *        - Visitor
 *      security:
 *        - Authorization: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the visitor pass to check in
 *          schema:
 *            type: string
 *      responses:
  *        200:
 *          description: Visitor pass checked in successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Visitor pass checked in successfully
 *                  updatedPass:
 *                    $ref: '#components/schemas/Pass'
 * 
 *        400:
 *          description: User has not registered as a visitor
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Please register as a visitor
 * 
 *        401:
 *          description: Unauthorized - User not logged in
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Please login
 * 
 *        404:
 *          description: Visitor pass not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Visitor pass not found
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'          
 */


/**
 * @swagger
 *  /visitor/visitor_pass/checkout/{id}:
 *    patch:
 *      summary: Check out a visitor pass by ID
 *      tags:
 *        - Visitor
 *      security:
 *        - Authorization: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the visitor pass to check out
 *          schema:
 *            type: string
 *      responses:
  *        200:
 *          description: Visitor pass checked out successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Visitor pass checked out successfully
 *                  updatedPass:
 *                    $ref: '#components/schemas/Pass'
 * 
 *        400:
 *          description: User has not registered as a visitor
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Please register as a visitor
 * 
 *        401:
 *          description: Unauthorized - User not logged in
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Please login
 * 
 *        404:
 *          description: Visitor pass not checked in or not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Visitor pass not checked in or not found
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'          
 */


/**
 * @swagger
 *  /read/user:
 *    get:
 *      summary: Retrieve own user information
 *      security:
 *        - Authorization: []
 *      tags:
 *        - Read
 *      description: Retrieves the user document if the user is logged in
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: Unauthorized, please login
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized, please login
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schemas/errormessage'
 *                
 */


/**
 * @swagger
 *  /read/visitor:
 *    get:
 *      summary: Retrieve own visitor information
 *      security:
 *        - Authorization: []
 *      tags:
 *        - Read
 *      description: Retrieves the visitor document if the user is logged in
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Visitor'
 *        401:
 *          description: Unauthorized, please login
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized, please login
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schemas/errormessage'
 *                
 */


/**
 * @swagger
 *  /read/visitor_pass:
 *    get:
 *      summary: Retrieve own visitor information
 *      security:
 *        - Authorization: []
 *      tags:
 *        - Read
 *      description: Retrieves all visitor passes associated with the logged-in user
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Pass'
 *        401:
 *          description: Unauthorized, please login
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized, please login
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schemas/errormessage'
 *                
 */


/**
 * @swagger
 *  /read/visitor_pass/{id}:
 *    get:
 *      summary: Read one visitor pass by ID
 *      description: Visitor can only search their own visitor pass while admin can search visitor pass of any visitor
 *      tags:
 *        - Read
 *      security:
 *        - Authorization: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: The ID of the visitor pass to retrieve
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: OK. Visitor pass details retrieved successfully.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/Pass'
 * 
 *        401:
 *          description: Unauthorized. Please login.
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized. Please login.
 * 
 *        403:
 *          description: Forbidden. Access denied. You are not authorized to view this visitor pass.
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Forbidden. Access denied. You are not authorized to view this visitor pass.
 * 
 *        404:
 *          description: Visitor pass not found.
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Visitor pass not found.
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'          
 */



/**
 * @swagger
 *  /admin/dump:
 *    get:
 *      summary: Retrieve all data for admin
 *      description: |
 *        Retrieves data from the database for admin purposes.
 *        This endpoint is only accessible to admin users.
 *      tags:
 *        - For Admin Only
 *      security:
 *        - Authorization: []
 *      responses:
 *        200:
 *          description: This endpoint is only accessible to admin users.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  Users:
 *                    type: array
 *                    item:
 *                      $ref: '#/components/schemas/User'
 *                  Visitors:
 *                    type: array
 *                    item:
 *                      $ref: '#/components/schemas/Visitor'
 *                  Visitor_Passes:
 *                    type: array
 *                    item:
 *                      $ref: '#/components/schemas/Pass'
 *        401:
 *          description: Unauthorized. Please login.
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized. Please login.
 * 
 *        403:
 *          description: Forbidden - User does not have admin rights
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Forbidden - User does not have admin rights
 *
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'          
 */


/**
 * @swagger
 *  /admin/read/{collections}:
 *    post:
 *      summary: Read data from different collections
 *      description: |
 *        Allows an admin user to retrieve data from different collections based on the provided `collections` query parameter and filters specified in the request body.
 *      tags:
 *        - For Admin Only
 *      security:
 *        - Authorization: []
 *      parameters:
 *        - in: path
 *          name: collections
 *          required: true
 *          description: Name of the collection to retrieve data from(select from User, Visitor, Visitor_Pass)
 *          type: string
 *          
 *      requestBody:
 *        description: Filters to apply for the query. This should match the schema of the respective collections.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                field1: value1
 *                field2: value2
 *              
 *              
 *      responses:
 *        200:
 *          description: Successful response with query results
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 * 
 *        400:
 *          description: Invalid or missing parameter(s)
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Invalid or missing parameter(s)
 * 
 *        403:
 *          description: Unauthorized ,Admin access only
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized ,Admin access only
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'
 */


/**
 * @swagger
 *  /admin/update/{id}:
 *    post:
 *      summary: Update any document based on ID and collection
 *      description: |
 *        Admin-only endpoint to update documents by ID in specified collections.
 *      tags:
 *        - For Admin Only
 *      security:
 *        - Authorization: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the document to update
 *          schema:
 *            type: string
 *        - in: query
 *          name: collections
 *          required: true
 *          description: Name of the collection (User, Visitor, or Visitor_Pass)
 *          schema:
 *             type: string
 *             enum: 
 *              - User
 *              - Visitor
 *              - Visitor_Pass
 * 
 *      requestBody:
 *          name: update
 *          required: true
 *          description: Fields to update in the document
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *              example: 
 *                field1: value1
 *                field2: value2
 *      responses:
 *        200:
 *          description: Successful update
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    description: ID of the updated document
 *                  field1:
 *                    type: string
 *                    description: Updated field 1
 *                  field2:
 *                    type: string
 *                    description: Updated field 2
 * 
 *        400:
 *          description: Invalid or missing parameter(s)
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Invalid or missing parameter(s)
 * 
 *        403:
 *          description: Unauthorized, Admin access only
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized, Admin access only
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'
 */


/**
 * @swagger
 *  /admin/delete/all/user/{id}:
 *    delete:
 *      summary: Delete a user and associated data
 *      description: |
 *        Deletes a user and related data from the Visitor and Pass collections.
 *      tags:
 *        - For Admin Only
 *      security:
 *        - Authorization: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user to delete
 *          schema:
 *            type: string
 *       
 *      responses:
 *        200:
 *          description: User and associated data deleted successfully
 * 
 *        400:
 *          description: Invalid request
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Invalid request
 * 
 *        403:
 *          description: Unauthorized, Admin access only
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized, Admin access only
 * 
 *        404:
 *          description: User not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: User not found
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#components/schemas/errormessage'
 */



/**
 * @swagger
 *  components:
 *      schemas:
 *          registerinfo:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  name:
 *                      type: string
 * 
 * 
 *          registersuccessful:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  name:
 *                      type: string
 *                  message:
 *                      type: string
 *                      description: Additional message
 * 
 *          errormessage:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Internal server error occurred
 * 
 *          jwtinfo:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              user_id: 
 *                type: string
 *                format: uuid
 * 
 *          User:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  name:
 *                      type: string 
 *                  role:
 *                      type: string
 *                  visitor_id:
 *                      type: string
 *                      format: uuid
 *                  login_status:
 *                      type: boolean
 * 
 *          Visitor:
 *              properties:
 *                  full_name:
 *                      type: string
 *                  phone_number:
 *                      type: string
 *                  email:
 *                      type: string 
 *                  license_number:
 *                      type: string
 *                  user_id:
 *                      type: string
 *                      format: uuid
 *                  visitor_pass_id:
 *                      type: array
 *                      items:
 *                        type: string
 *                        format: uuid
 * 
 *          Pass:
 *              properties:
 *                  visitor_id:
 *                      type: string
 *                      format: uuid
 *                  purpose_of_visit:
 *                      type: string
 *                  host_name:
 *                      type: string 
 *                  host_address:
 *                      type: string
 *                  checkin_time:
 *                      type: string
 *                      format: date-time
 *                  checkout_time:
 *                      type: string
 *                      format: date-time
 *                  remarks:
 *                      type: string
 */