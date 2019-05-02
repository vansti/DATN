# Learning Management System
mern stack aplication


## Các bước cài đặt
``` bash
1. git clone https://github.com/vansti/MERN.git my-project

2. cd my-project

3. Tạo file .env với nội dung

  MONGO_URI = 
  SECRETORKEY = 
  CLOUD_NAME = 
  CLOUD_API_KEY = 
  CLOUD_API_SECRET = 
  COURSE_PHOTO_DEFAULT= 
  USER_PHOTO_DEFAULT= 
  ----------------------------------------------------------------
  Nếu chưa có tài khoản mlab và cloudinary thì truy cập các link:
  - https://mlab.com/
  - https://cloudinary.com/

4. Tạo file /client/src/config.js với nội dung

  export default {
    CLOUD_NAME: ,
    UPLOAD_PERSET: ,
  };

5. npm install

6. npm run client-install

7. npm run dev

```