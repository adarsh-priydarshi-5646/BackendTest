const prisma = require('../../config/db.config.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const { name, age, email, password, role } = req.body

    if (!name || !age || !email || !password){
        return res.status(400).json({"message":"Please fill the all details"})
    }

    if (Number(age) < 18){
        return res.status(400).json({"message": "age must be 18"})
    }

    if (password.length < 6){
        return res.status(400).json({"message":"password must be 6 digits"})
    }

    try {
        const existEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existEmail) {
            return res.status(400).json({ "message": "User alerady exists Please sign in" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                age: Number(age),
                email,
                password: hashPassword,
                role:"USER"
            }
        })

        const { password: _, ...safeUser } = newUser

        res.status(201).json({ "message": "User Signup Successfully", user: safeUser})

    } catch (err) {
        console.error('createUser error', err)
        return res.status(500).json({ message: "Internal server error" })
    }
}


const signIn = async (req, res) => {
    const {email, password} = req.body
    try {
        const existingUser = await prisma.user.findUnique({
            where:{email}
        })
        if (!existingUser){
            return res.status(404).json({"message":"Email does not exists please signup"})
        }
        const verifyPassword = await bcrypt.compare(password, existingUser.password)

        if (!verifyPassword){
            return res.status(404).json({"message":"Please enter valid password"})
        }

        const genToken = jwt.sign(
            {
                userID:existingUser.id, 
                role: existingUser.role
            },
            process.env.JWT_SECRET, 
            {expiresIn:'7d'}
        )

        res.cookie("token", genToken, {
            httpOnly:true,
            secure:false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({"message":"login succesfully"})
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err: err.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,        
            secure: true,          
            sameSite: "none"
        })

        res.status(200).json({
            message: "Logout successful. Token cleared from cookies."
        })

    } catch (err) {
        res.status(500).json({message: "Internal server error during logout", error: error.message});
    }
}

module.exports = {
    signUp,
    signIn,
    logout
}