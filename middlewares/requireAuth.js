module.exports = (req, res, next) => {
    if(!req.user){
         // if not login, won't have the session
        return res.status(401).send({error:"You must login"});
    }
    next();
}