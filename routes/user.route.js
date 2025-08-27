import express from 'express';
import { addUser, deleteUser, getUser, getUsers, updatePwd, updateUser } from '../controllers/user.controller';
import { login, signup } from '../controllers/sign.controller';
import { forget, orderSuccess } from '../controllers/forgetpwd.controller';

const router = express.Router();

router
    .post('/add-user', addUser)
    .get('/get-users', getUsers)
    .get('/get-user/:id', getUser)
    .put('/update-user/:id', updateUser)
    .delete('/delete-user/:id', deleteUser)
    .post('/signup', signup)
    .post('/login', login)
    .post('/forget', forget)
    .put('/update-password', updatePwd)
    .post('/order',orderSuccess)



export default router;