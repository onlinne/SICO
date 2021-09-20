import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'token no encontrado' });
	}
	try {
		const decoded = jwt.verify(token, 'test');
		req.userId = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token invalido' });
	}
};

export default auth;
