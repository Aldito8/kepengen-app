import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { supabase } from '../utils/supabase';

export async function getUser(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        let { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', user_id)
            .order('created_at', { ascending: false })
            .single()
        
        if (data.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid' })
        }else{
            let {data: dataUser, error: errorUser} = await supabase
            .from('user')
            .select('id, created_at, email, username, role')
            .order('created_at', {ascending: false})
            return res.status(200).json(dataUser)
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getUserDetail(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        const id = req.params.id;

        if (!user_id) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        let { data: authUserData, error: authUserError } = await supabase
            .from('user')
            .select('role')
            .eq('id', user_id)
            .single();

        if (authUserError || !authUserData) {
            return res.status(404).json({ message: 'Authenticated user not found' });
        }

        if (authUserData.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        let { data: requestedUserData, error: requestedUserError } = await supabase
            .from('user')
            .select('id, created_at, email, username, role')
            .eq('id', id);

        if (requestedUserError || !requestedUserData) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(requestedUserData);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;
        const { id } = req.params;
        const { email, username, role } = req.body;
        const admin = verifyToken(token).role === 'admin';

        if (!user_id) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!admin) {
            return res.status(403).json({ message: 'Forbidden: You must be an admin to perform this action' });
        }

        const { data: updatedUser, error: updateError } = await supabase
            .from('user')
            .update({ email, username, role })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            return res.status(400).json({ message: 'Failed to update user', error: updateError.message });
        }

        if (!updatedUser) {
            return res.status(400).json({ message: 'Failed to update user'});
        }

        return res.status(200).json({ message: "success updated user" });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const user_id = verifyToken(token).id;

        const { id } = req.params;

        if (!user_id) {
            return res.status(401).json({ message: 'User ID is required' });
        }

        let { data, error } = await supabase
            .from('user')
            .select('role')
            .eq('id', user_id)
            .single();

        if (error || data?.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You must be an admin to delete a user.' });
        }

        let { data: dataUser, error: errorUser } = await supabase
            .from('user')
            .delete()
            .eq('id', id);

        if (errorUser) {
            return res.status(400).json({ message: 'Failed to delete user.', error: errorUser.message });
        }

        return res.status(200).json({ message: `User ${id} deleted successfully.`});

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}