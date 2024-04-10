const { errorResponse, successResponse,
    successResponseWithoutData,
    failMessage
} = require("../../utilities/response");
const db = require("../../models/v1/index");

exports.register = async (req, res) => {
    try{
        const { username, password } = req.body;

        let user = await db.user.findOne({
            where:{
                username,is_status:"active"
            }
        })
        if(user){
            return failMessage('Username already exists',res)
        }
        let newUser = await db.user.create({
            username, password
        })
        const passwordHash = await newUser.encryptPassword(password)
        await newUser.update({ password: passwordHash })
        return successResponseWithoutData('User registered successfully',res)
        
    }catch(err){
        return errorResponse(err, res);
    }
    
};
exports.login = async (req, res) => {
    try{
            const { username, password } = req.body;
            let user = await db.user.findOne({
                where:{
                    username,is_status:"active"
                }
            })
            if(!user){
                return failMessage('Invalid username',res)
            }
            const isPasswordValid = await user.validPassword(password, user.password);
              if (!isPasswordValid) {
                return failMessage('Invalid password',res)
              }
              let token = await user.generateJWT()
              user.update({token})

        return successResponse(token,'User Login successfully',res)
        
    }catch(err){
        return errorResponse(err, res);
    }
    
};
exports.userexists = async (req, res) => {
    try{
            const { username } = req.params;
            let user = await db.user.findOne({
                where:{
                    username,is_status:"active"
                }
            })
            if(!user){
                return failMessage('Please register!',res)
            }

        return successResponse({ exists: true },'User exists',res)
        
    }catch(err){
        return errorResponse(err, res);
    }
    
};
