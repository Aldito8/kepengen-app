import { Request, Response } from "express"
import { supabase } from "../utils/supabase";
import { verifyToken } from "../utils/jwt";
import { desireSchema, installmentSchema } from '../utils/validation';

export async function getDesire(req: Request, res: Response) {
    try {

        const token = req.cookies.token;

        const user_id = verifyToken(token).id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        let { data, error } = await supabase
            .from('desire')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

        return res.status(200).json(data)

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getDetailDesire(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: 'Desire ID is required' })
        }

        let { data, error } = await supabase
            .from('desire')
            .select('id, name_desire, description_desire, tariff, collected, created_at, image, history(id, amount, created_at)')
            .order('created_at', { foreignTable : 'history', ascending: false})
            .eq('id', id)
            .eq('user_id', user_id)
            .single()

        if (error || !data) {
            return res.status(404).json({ message: 'Desire not found' })
        }

        return res.status(200).json(data)

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function createDesire(req: Request, res: Response) {
    try {

        const token = req.cookies.token;

        const user_id = verifyToken(token).id;

        const { name_desire, description_desire, tariff } = req.body

        const {error} = desireSchema.validate(req.body)
        const image = req.file?.path || null;

        if (!user_id || !name_desire) {
            return res.status(400).json({ message: 'User ID and name are required' })
        }

        let { data, error: errorCreateDesire} = await supabase
            .from('desire')
            .insert([{
                user_id,
                name_desire,
                description_desire,
                tariff,
                image: image || null
            }])
            .select()
            .single()

        if (error || errorCreateDesire) {
            return res.status(400).json({ message: errorCreateDesire?.message })
        }

        return res.status(201).json({
            message: 'Desire created successfully',
            desire: data
        })

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function updateDesire(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        const { id } = req.params
        const { name_desire, description_desire, tariff } = req.body

        const {error} = desireSchema.validate(req.body)
        console.log(error)
        if (!id || !name_desire) {
            return res.status(400).json({ message: 'Desire ID and name are required' })
        }

        let { data, error: errorUpdateDesire } = await supabase
            .from('desire')
            .update({
                name_desire,
                description_desire,
                tariff
            })
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single()

        if (error ||  errorUpdateDesire || !data) {
            return res.status(404).json({ message: 'Desire not found or update failed' })
        }

        return res.status(200).json({
            message: 'Desire updated successfully',
            desire: data
        })

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function installmentDesire(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        const { id } = req.params
        const { installment } = req.body

        const {error} = installmentSchema.validate(req.body)

        if(error){
            return res.status(400).json({ message: 'Invalid Input' })
        }

        if (!id) {
            return res.status(400).json({ message: 'Desire ID is required' })
        }

        const { data: currentDesire, error: fetchError } = await supabase
            .from('desire')
            .select('*')
            .eq('id', id)
            .eq('user_id', user_id)
            .single()

        if (fetchError || !currentDesire) {
            return res.status(404).json({ message: 'Desire not found' })
        }

        const newCollected = (currentDesire.collected || 0) + installment

        let { data, error: errorUpdateDesire } = await supabase
            .from('desire')
            .update({
                collected: newCollected
            })
            .eq('id', id)
            .select()
            .single()

        if (error || errorUpdateDesire || !data) {
            return res.status(404).json({ message: 'Desire not found or update failed' })
        }

        console.log(id, installment, user_id)

        await supabase
            .from('history')
            .insert([{
                desire_id: id,
                amount: installment,
                user_id: user_id
            }])

        return res.status(200).json({
            message: 'Desire updated successfully',
            desire: data
        })

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function deleteDesire(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: 'Desire ID is required' })
        }

        const { data: currentDesire, error: fetchError } = await supabase
            .from('desire')
            .select('*')
            .eq('id', id)
            .eq('user_id', user_id)
            .single()

        if (!currentDesire || fetchError) {
            return res.status(404).json({ message: 'Desire not found or deletion failed' })
        }

        await supabase
            .from('desire')
            .delete()
            .eq('id', id)

        return res.status(200).json({ message: 'Desire deleted successfully' })

    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}