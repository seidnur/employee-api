import Leave from '../models/Leave.js'
import Employee from '../models/Employee.js'
import path from 'path';
import { error } from 'console';
const addLeave =async(req,res)=>{
try{
const{UserId,leaveType,startDate,endDate,reason}=req.body;
const employee=await Employee.findOne({UserId})
const newLeave=new Leave({
    employeeId:employee._id,
    leaveType,
    startDate,
    endDate,
    reason  
})
await newLeave.save()
return res.status(200).json({success:true})
}
catch(error){
    return res.status(500).json({success:false,error:"Leave add server error"})

}
}
const getLeave=async(req,res)=>{
try{
const {id}=req.params;
let leaves=await Leave.find({employeeId:id})
if(!leaves){
const employee=await Employee.findOne({UserId:id})
 leaves=await Leave.findById({employeeId:employee})


}

return res.status(200).json({success:true, leaves})

}
catch(error){
    return res.status(500).json({success:false,error:"Leave view server error"})

}
}
const getLeaves =async(req,res)=>{
try{
const leaves=await Leave.find().populate({
    path:"employeeId",
     populate: [{
            path:'department',
            select:'dep_name',
     },
     {
        path:'UserId',
        select:'name'
     }
    ]
})
return res.status(200).json({success:true,leaves})
}
catch(error){
console.log(error.message)
return res.status(500).json({success:false,error:"leave get server error"})
}
}
const getLeaveDetail=async(req,res)=>{
try{
    const {id}=req.params;
const leave=await Leave.findById({_id:id}).populate({
    path:"employeeId",
     populate: [{
            path:'department',
            select:'dep_name',
     },
     {
        path:'UserId',
        select:'name , profileImage'
     }
    ]
})
return res.status(200).json({success:true,leave})
}
catch(error){
console.log(error.message)
return res.status(500).json({success:false,error:"leave get server error"})
}
}
const updateLeave=async(req,res)=>{
try{
    const {id}=req.params;
    const leave=await Leave.findByIdAndUpdate({_id:id},{status:req.body.status})
    if(!leave){
        return res.status(400).json({success:false,error:"leave not founded"})
    }
    res.status(200).json({success:true,leave})
}
catch(error){
   return res.sta(500).json({success:false,error:"leave add serever error"})
}
}
export {addLeave,getLeave,getLeaves,getLeaveDetail,updateLeave}