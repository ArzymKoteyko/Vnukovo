# This is a athorisation web page

project was wrtitten on python/html/css/react js stack

it uses flask as a temperate html host and back server
all code related to flask are in source/index.py

css located in several files in source/static/css 
where index.css is main file

all resoponsive components was written with help of react js
files related to this located in source/static/src
and all compield are in source/static/dep

html templates located in source/templates


	there is 2 objects to deploy project:
#1 to stay whith flask backend:
	then you can continue to develope application as it is

#2 choose different back:
	in this case you must carefully replace all links in index.html
	
	
	
	athorisation is made in two main phases:
	
#1
		|                |                              |      |
		|                |   <----   html[get]  <----   |      |
		|     server     |   {'tel_number': int_value}  | user |
		|   1 endpoint   |                              |      |
		|                |   ---->   response   ---->   |      |
		|                |   {'status': 'pass'/'fail',  |      |
		|                |    'session_id': uniq int }  |      |
		
#2 
		|                |                              |      |
		|                |   <----   html[get]  <----   |      |
		|     server     |   {'pin_code':   int_value,  | user |
		|   2 endpoint   |    'session_id': int_value}  |      |
		|                |                              |      |
		|                |   ---->   response   ---->   |      |
		|                | {'status': 'pass' or 'fail'} |      |
		

	You can compile and run test version simply by execution setup script
	
