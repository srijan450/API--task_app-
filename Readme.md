# The API Project -- task app

Following is list of api: 
User Related: 
1. Create User                    : /user               --post
2. User Login                     : /user/login         --post
3. User Data                      : /user               --get
4. User Logout                    : /user/logout        --post 
5. User Logout from all devices   : /user/logout-all    --post 
5. Update User                    : /user               --patch
6. Delete User:                   : /user               --delete
7. User Image Upload              : /user/profile/image --post
8. Delete User Profile Image      : /user/profile/image --delete
9. Get User Profile Image:        : /user/:id/image     --get

Task Related: 
1. Create Task                    : /task               --post
2. Get Task                       : /task/:id           --get
3. Get Task/s                     : /task               --get
4. Update Task                    : /task/:id           --patch
5. Delete Task                    : /task/:id           --delete
6. Delete all tasks               : /tasks              --delete
