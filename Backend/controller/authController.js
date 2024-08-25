import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Invalid credentials');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');
        
        const token = jwt.sign({ email: user.email }, process.env.SECRETKEY);
        res.header('Authorization', token).send(token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    })
}
