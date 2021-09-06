import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];

		const decodedData = jwt.verify(token, 'test');
		req.userId = decodedData._id;

		next();
	} catch (error) {
		next();
	}
};

export default auth;
