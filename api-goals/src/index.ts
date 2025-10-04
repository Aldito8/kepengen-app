import express from 'express';
import logout, { login, register } from './controllers/auth';
import { createDesire, getDesire, getDetailDesire, installmentDesire, deleteDesire, updateDesire } from './controllers/desire';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { upload } from './utils/multer';
import { deleteUser, getUser, getUserDetail, updateUser } from './controllers/admin';

const app = express()
const port = process.env.PORT;

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//     origin: process.env.CORS_ALLOWED_ORIGINS,
//     credentials: true,
// }));

app.post('/register', register)
app.post('/login', login)
app.post('/logout', logout)
app.get('/desire', getDesire)
app.get('/desire/:id', getDetailDesire)
app.post('/add-desire',upload.single('image'), createDesire)
app.patch('/installment-desire/:id', installmentDesire)
app.put('/update-desire/:id', updateDesire)
app.delete('/delete-desire/:id', deleteDesire)
app.get('/users', getUser)
app.get('/users/:id', getUserDetail)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

app.use(cors({
    origin: "https://kepengen-app.vercel.app",
    credentials: true
}));
app.options('*', cors());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
