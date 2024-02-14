#!/bin/sh
for i in {0..16}; 
do 
echo -n "curl $i: ";
curl --insecure https://localhost/api/hello
done
echo done