import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'token no encontrado' });
		}
		const decoded = jwt.verify(token, 'test');
		req.userId = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token invalido' });
	}
};

export default auth;
