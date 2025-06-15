const jwt = require("jsonwebtoken");

const JWT_SECRET = "efrofroifnrofjerofnroifnirhfnirefvbriufvbiurf";

const signToken = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
}

const verifyToken = (token) => {
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        return payload;
    }
    catch (err){
        return null;
    }
}

module.exports = { signToken, verifyToken };