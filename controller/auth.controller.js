import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const {username,email,password} = req.body;

    try{

        
        // HASH the PASSWORD
        const hashedPassword = await bcrypt.hash(password,10);
        
        console.log(hashedPassword);
        //CREATE NEW USER and SAVE IN THE DATABASE
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password:hashedPassword,
            },
        });
        
        console.log(newUser);
        
        res.status(201).json({message:"User created successfully!"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to create user!"});
    }
};
    
    
export const login = async (req, res) => {
    const {username, password} = req.body;

    try{
    
        // CHECK WHETHER USER EXISTS

        const user = await prisma.user.findUnique({
            where:{username}
        });

        if(!user) return res.status(401).json({message:"Invalid Credentials!"});

        // CHECK THE PASSWORD

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({message:"Invalid Credentials!"});

        // GENERATE COOKIE TOKEN AND SEND TO THE USER

        // res.setHeader("Set-Cookie", "test=" + "MyValue").json("Success");
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({
            id:user.id,
            isAdmin:false,
        }, 
        process.env.JWT_SECRETE_KEY, 
        {expiresIn: age}
    );

    const {password: userPassword, ...userInfo} = user

        res.cookie("token", token, {
            httpOnly:true,
            // secure:true,
            maxAge:age,
        }).status(200).json(userInfo)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to login!"})
    }
};
 
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout Successful!"})
};