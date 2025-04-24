# DEV TINDER API

### authRouter
- post /signup
- post /login
- post /logout 

### ProfileRouter
- get /profile/view
- patch /profile/edit (it will not edit the email and password)
- patch /profile/password // forgot password api


### ConnectionRequestRouter
STATUS WE HAVE (ignored (left swipe), interested (right swipe), accepted, rejected)
- POST /request/send/:status/:userId (These two are for sending the connection request)
- POST /request/review/:status/:requestId (These two are for accepted or rejected it)


### userRouter
- GET /user/connections (like matches for all the connections)
- GET /user/requests 
- GET /user/feeds - GETs you the profile of all other users 


