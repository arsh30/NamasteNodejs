# DEV TINDER API

### authRouter
- post /signup
- post /login
- post /logout 

### ProfileRouter
- get /profile/view
- patch /profile/edit (it will not edit the email and password)
- patch /profile/password


### ConnectionRequestRouter
STATUS WE HAVE (ignore (left swipe), interested (right swipe), accepted, rejected)
- POST /request/send/interested/:userId (These two are for sending the connection request)
- POST /request/send/ignored/:userId 

- POST /request/review/accepted/:requestId (These two are for accepted or rejected it)
- POST /request/review/rejected/:requestId


### userRouter
- GET /user/connections (like matches for all the connections)
- GET /user/requests 
- GET /user/feeds - GETs you the profile of all other users 
