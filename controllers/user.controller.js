import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const register = async (req, res) => {
    try {
        const { fullname, username, password, gender, confirmPassword } = req.body;

        // Trim the gender value to remove leading and trailing spaces
        const trimmedGender = gender.trim();

        // Check if all required fields are provided
        if (!fullname || !username || !password || !confirmPassword || !trimmedGender) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        // Check if passwords match
        if (password.trim() !== confirmPassword.trim()) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // Check if the provided username already exists
        const existingUser = await User.findOne({ username: { $regex: new RegExp(username, "i") } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate profile photo URL based on gender
        const profilePhoto = `https://avatar.iran.liara.run/public/${trimmedGender === "male" ? "boy" : "girl"}?username=${username}`;

        // Create a new user
        await User.create({ fullname, username, password: hashPassword, gender: trimmedGender, profilephoto: profilePhoto });

        // Return success response
        return res.status(200).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json("Internal server error");
    }
};
export const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "every fields are mandatory" })
        }
        const existUser = await User.findOne({ username });
        if (!existUser) {
            return res.status(400).json({ message: "user not found", success: false })
        }
        const isPasswordMatch = await bcrypt.compare(password, existUser.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "invalid username or password", success: false })
        }
        const tokenData = {
            userId: existUser._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" }).json({
            _id: existUser._id,
            fullname: existUser.fullname,
            username: existUser.username,
            profilePhoto: existUser.profilephoto,
            success: true,
            message: "user loggedin successfully"
        })


    } catch (error) {
        console.log("error in login ", error)
        return res.status(500).json({ message: "failed in signin" })
    }
}
export const logOut = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "user has been successfully logged out" })
    } catch (error) {
        console.log(error, "error in the logout")
        return res.status(500).json({ message: "error in the logout" })
    }
}

export const getOtherUser=async(req,res)=>{
    try {
        const loggedInUserId=req.id
        const otherUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        return res.status(200).json(otherUsers)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error in getting all the user"})
    }
}