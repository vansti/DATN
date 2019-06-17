# Đồ án tốt nghiệp
Xây dựng phần mềm thông minh quản lý chăm sóc học viên cho trung tâm đào tạo


## Các bước cài đặt
``` bash
1. git clone https://github.com/vansti/DATN.git my-project

2. cd my-project

3. Tạo file .env trong folder server với nội dung

  MONGO_URI=
  SECRETORKEY=

  CLOUD_NAME=
  CLOUD_API_KEY=
  CLOUD_API_SECRET= 

  COURSE_PHOTO_DEFAULT=
  USER_PHOTO_DEFAULT=

  MAIL_USER=
  MAIL_PASS=

  FRONT_URL=
  CLIENT_URL=

  vnp_TmnCode=
  vnp_HashSecret=
  vnp_Url=
  vnp_ReturnUrl=
  ----------------------------------------------------------------
  Nếu chưa có tài khoản mlab và cloudinary thì truy cập các link:
  - https://mlab.com/
  - https://cloudinary.com/

4. Tạo file /client/src/config.js và /front/src/config.js với nội dung

  export default {
    CLOUD_NAME: ,
    UPLOAD_PERSET: ,
    ADDRESS:
  };

5. npm install trong 3 folder

6. npm start trong 3 folder
```