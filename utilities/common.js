const {
    randomResponse, failMessage
} = require("../utilities/response");

const db = require("../models/v1/index");

exports.validateTokenUser = async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return randomResponse('Unauthorized', res);
        }
        const token = authorizationHeader.split('Bearer ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = await db.user.findOne({
                where: { user_id: decoded.id },
            })
            if (!userId) {
                return randomResponse('User Not Found!', res);
            }
            else {
                next()
            }

        } catch (error) {
            console.error('Token verification failed >>', error);
            return randomResponse('Unauthorized', res);
        }

};
