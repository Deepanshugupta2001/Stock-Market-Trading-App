import jwt from 'jsonwebtoken'
import env from '../../env.js';
import Stock from '../../model/Stock.js';

export default async function requireAuth(req,res,next){
    try {
        const headers = req.headers;  
        if (!headers) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        console.log("AUTH HEADER:", req.headers.authorization);  
        const token = headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ error: "Token required" });

            const decoded = jwt.verify(token, env.JWT_SECRET);
            const user = await Stock.findById(decoded.id)
                .select('name mobno _id')
                .lean();  

            if (!user) return res.status(401).json({ error: "Invalid or expired token" });

            req.user = user;
            next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Unauthorized" });
    }
}      