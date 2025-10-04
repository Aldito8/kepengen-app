import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { supabase } from '../utils/supabase'
import { signToken, verifyToken } from '../utils/jwt'
import { loginSchema, registerSchema } from '../utils/validation'

export async function register(req: Request, res: Response) {
    try {
        const { email, username, password } = req.body
        const {error} = registerSchema.validate = req.body
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const { data, error: errorRegister } = await supabase
            .from('user')
            .insert([{ email, username, password: hashedPassword }])
            .select()
            .single()

        if (error || errorRegister) {
            return res.status(400).json({ message: errorRegister?.message })
        }

        const token = signToken({ id: data.id, email: data.email, username: data.username, role: 'user' })

        res.cookie('token', token, {
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            message: 'Login successful',
            token,
        })

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body
        const {error} = loginSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error})
        }

        let { data, error: errorLogin } = await supabase
            .from('user')
            .select("*")
            .eq('email', email)
            .single()


        if (errorLogin || !data) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isPasswordValid = await bcrypt.compare(password, data.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = signToken({ id: data.id, email: data.email, username: data.username, role: data.role })

        const userData = verifyToken(token)

        res.cookie('token', token, {
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: 'Login successful',
            token,
            userData
        })

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export default function logout(req: Request, res: Response) {
    try {
        if (!req.cookies.token) {
            return res.status(400).json({ message: 'No user is logged in' })
        }
        res.clearCookie('token')
        return res.status(200).json({ message: 'Logout successful' })
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}
