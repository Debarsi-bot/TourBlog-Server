import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'

import UserModal from "../models/user.js";

dotenv.config()

//implemented logic from this article
//https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await UserModal.findOne({ email });
    
        if (oldUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        //Encrypt the user password.
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user in our database
        const result = await UserModal.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
        });
        // Create JWT token
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        //return new user
        res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
  };
  
export const signin = async (req, res) => {

  try {
    // Get user input
    const { email, password } = req.body;

     // Validate if user exist in our database
    const oldUser = await UserModal.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });
    //check if password matches
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    // Create token
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id },  process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    //send user details and JWT token as response
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

