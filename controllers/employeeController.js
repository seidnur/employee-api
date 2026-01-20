import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from "path"
import Department from '../models/Department.js'
import { error } from "console"
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage})
const addEmployee =async(req,res)=>{
    try{
const {
    name,
    email,
    employeeId,
    dob,
    gender,
    maritalStatus,
    designation,
    department,
    salary,
    password,
    role

}=req.body;
const user=await User.findOne({email})
    if(user){
return res.status(400).json({success:false,error:"user already registered in employee"});
}
const hashPassword=await bcrypt.hash(password,10)
    
const newUser=new User({  name,
    email,
    password:hashPassword,
    role,
    profileImage:req.file ? req.file.filename: ""
})
const savedUser=await newUser.save()
const newEmployee=new Employee({
    UserId:savedUser._id,
    employeeId,
    dob,
    gender,
    maritalStatus,
    designation,
    department,
    salary
})
await newEmployee.save()
return res.status(200).json({success:true,message:"employee successfuly registered"})
}
catch(error){
    return res.status(500).json({success:false,error:"server error in adding employee"})
}

}
const getEmployees =async(req,res)=>{
   try{
    const employees=await Employee.find().populate('UserId',{password:0}).populate('department')
    return res.status(200).json({success:true,employees})
}
catch(error){
    return res.status(500).json({success:false,error:"get employee server error"})
}
}
const getEmployee =async(req,res)=>{
    const {id}=req.params;
   
   try{
     let employee;
    employee=await Employee.findById({_id:id}).populate('UserId',
        {password:0}).populate('department')
        if(!employee){
       employee= await Employee.findOne({UserId:id}).populate('UserId',
        {password:0}).populate('department')
        }
    return res.status(200).json({success:true,employee})
}
catch(error){
    return res.status(500).json({success:false,error:"get employee server error"})
}
}
const updateEmployee=async(req,res)=>{
    try{
const {id}=req.params;
const {
    name,
    maritalStatus,
    designation,
    department,
    salary
}=req.body;
const employee=await Employee.findById({_id:id})
    if(!employee){
return res.status(404).json({success:false,error:"employee not found"})
    }
const user=await User.findById({_id:employee.UserId})
if(!user){
    return res.status(404).json({succ:false,error:"user not found"})
}
const updateUser=await User.findByIdAndUpdate({_id:employee.UserId},{name})
const updateEmployee=await Employee.findByIdAndUpdate({_id:id},{
    maritalStatus,
    designation,
    salary,
    department
})
if(!updateEmployee || updateUser){
    return res.status(404).json({success:false,error:"document not found"})
}
return res.status(200).json({success:true,massage:"employee updated"})
    }
    catch(error){
        return res.status(500).json({success:false,error:"employee data not updated"})
    }
}
const fetchEmployeeById=async(req,res)=>{
 try{
const {id}=req.params;
const employees=await Employee.find({department:id})
    
return res.status(200).json({success:true,employees})
    
    }
    catch(error){
        return res.status(500).json({success:false,error:"get employee server error"})
    }
}
export {addEmployee,upload,getEmployees,getEmployee,updateEmployee,fetchEmployeeById}