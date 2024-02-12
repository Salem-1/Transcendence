this is simple guide to test the project

# How to test backend?

this the test file for django server  endpoints 

    python srcs/tester/test_endpoints.py   
-------------
run test cases for functions inside db app (related to authentication and authorization)

    python srcs/backend/manage.py test db  /
----------------
run test cases related to frontend, where the selenium library will act as human user

    
    node srcs/tester seleniumTest.js . 

-----------