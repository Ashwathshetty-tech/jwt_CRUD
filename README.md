# Task which I performed
1. Signup and login using Email and Password and return JWT token with a success response  
2. Send a verification link on email when the user registers for the first time and verify the user account after clicking on the verification link.   
3. Create CRUD operations for a product table (with category, brand, and name)  
4. Implement the functionality to assign products to Users (many-to-many)  
5. List assigned products for a given user-id (filterable by brand and category)

#APIs created

#Users

1)Post-->http://localhost:3000/register

2)Post-->http://localhost:3000/login

#Products

1)Post-->http://localhost:3000/

2Post-->http://localhost:3000/find

3)Put-->http://localhost:3000/product/updateById/:id

4)Get-->http://localhost:3000/findByProductId

5)Patch-->http://localhost:3000/product/updateNameByProductId?productId=""

6)Delete-->http://localhost:3000/product/deleteByProductId

7)Post-->http://localhost:3000/welcome

8)Post-->http://localhost:3000/user/product

Steps to run Node JS Application

1)Run git clone -b https://github.com/Ashwathshetty-tech/jwt_CRUD.git in CLI or download and unzip the file

2)Run npm install

3)Install mailDev to see all the triggered mail after registration.
-- run npm install -g maildev
-- run mailDev

4)Run npm run start

5)Test Api's using postman or any API testing tool
    
