const express = require("express");
const router = express.Router();
const Member = require("../models/students");


    // const {umis_no,emis_no,major1,major2,dse1,dse2,elective,sec,language,english,compulsory_allied,optional_allied,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,payment_details,fee,fee_status,email,phone_no,alternative_no,absent,single_hour_count,register_no,student_name,aadhar_no,data_of_birth,gender,father_name,nationality,religion,catholic,dalit,community,caste,handicapped,handicap_info,state } = req.body;
    router.post('/create', async (req, res) => {
        try {
            // Extract data from request body
            const data = req.body;
    
            // Convert `subject` object into array format
            const subjectArray = Object.keys(data.subject).map(key => {
                const subject = data.subject[key];
                return{
                    paper: subject.paper
                }
            })
            // Convert `payment` object into array format
            const paymentArray = Object.keys(data.payment).map(key => {
                const payment = data.payment[key];
                return {
                    semester_no: payment.semester_no,
                    payment_details: payment.payment_details,
                    fee: payment.fee,
                    fee_status: payment.fee_status
                };
            });
    
            // Prepare full document for saving
            const memberData = {
                ...data,
                payment: paymentArray  // Inject converted array into memberData
            };
    
            // Save to MongoDB
            const member = new Member(memberData);
            const newMember = await member.save();
    
            console.log("Data saved successfully");
            res.status(201).json(newMember);
    
        } catch (err) {
            console.error("Error in saving the data:", err.message);
            res.status(400).json({ message: err.message });
        }
    });
    
    router.post("/login", async(req,res)=>{
        const { register_no, password } = req.body;
        try{
            const student = await Member.findOne({register_no: register_no});
            if(!student){
                return res.status(404).json({message: "Student not found"});
            }
            else if(student){
                if(password === student.password){
                    return res.status(201).json({message: "Login successfull", register_no});
                }
                else{
                    return res.status(400).json({message: "Invalied password"});
                }
            }
        } catch(err){
            return res.status(400).json({message: err.message});
        }
    })

router.get("/getdata", async (req, res) => {
    try {
        const data = await Member.find();
        console.log("Fetched Students:", data);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No student data found" });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching data:", err.message);
        res.status(500).json({ message: err.message });
    }
});
router.get("/students/:register_no", async(req,res)=>{
    const {register_no} = req.params;
    try{
        const student = await Member.findOne({register_no: register_no});
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }
        res.json(student);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});
router.delete("/students/delete/:register_no", async(req,res)=>{
    const {register_no} = req.params;
    try{
        const deleteMember = await Member.deleteOne({register_no});
        if(!deleteMember){
            return res.status(404).json({message: "Student not found"});
        }
        res.status(200).json({message:"Deleted successfully ". deleteMember});
    } catch(err){
        res.status(500).json({message: "Error in fetching data ", err});
    }
})

module.exports = router;