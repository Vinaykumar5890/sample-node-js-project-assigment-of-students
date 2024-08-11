
##Project Title
 -> This project name **my_project** mainly used techonolgies used 
 ->  like **node Js** and used **sqlite3** database . 


##Database  
 -> In this assignment i used sqlite3 database .
 -> The database name **assignment.db**

##Features 
 -> The main feature of application is authorized user can make **crud **
 -> When user  login succesfully get **JWT TOKEN ** .
 -> user Passwword will be bycrpt.
 -> Using jwt token user can make ** crud ** operation 

##Installation 
 -> command run in terminal **npm Install**
 -> When we start the  server  using command ** nodemon app.js**
 -> Also install command :

        **"bcrypt": "^5.1.1",**
        **"dotenv": "^16.4.5",**
        **"express": "^4.19.2",**
        **"jsonwebtoken": "^9.0.2",**
        **"nodemon": "^3.1.4",**
        **"sqlite": "^5.1.1",**
        **"sqlite3": "^5.1.7"**


## Usage 
  -> The node js project mainly authorized project 
  -> mainly user can be make ** CRUD ** operation.


##License 
   -> **License**: ISC 
   -> **version** : 1.0.0

<summary>

  <details>
    npm install
    nodemon app.js
  </details>

</summary>


###Tables  in database

 ->  **users** 
 ->  **students**  


##Docker 

 # Use the official Node.js 14 image as a parent image
FROM node:14

# Set the working directory inside the container
my_project/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) files
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "src/app.js"]


##Contact 
  -> GITHUB : **https://github.com/Vinaykumar5890/**
  ->LINKEDIN : **https://linkedin.com/Vinaykumar/**
  -> MOBILE NUMBER : **9030664422**

