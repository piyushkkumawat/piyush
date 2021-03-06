var db = require('../config/db.config');
let date = require('date-and-time');
const leaveRequest = db.leaveRequest;
const leaveBalance = db.leavebalance;
//---cretae leave request----

//----function for insert data in leave  balance---


function leaveBal(empId,leave_type,update_date,start_date,TotalNumberOfLeaves){
    
 
    
        leaveBalance.update({
            
            leave_type:leave_type,
            upadte_date:update_date,
            
            leave_taken_date:start_date,
            leave_remaining:TotalNumberOfLeaves
        
        },{where:{empId:empId}}).then(leaveBalance=>{
            console.log("apppdfspadfa");
            console.log(leaveBalance);
        }).catch(err=>{
            console.log(err);
        }) 
    
    
}

//----function leave date time manage and calculate employee leave

function leaveManage(){
    
    var d = new Date();

    var update_date = d.toISOString().slice(0,10);
    var TotalNumberOfLeaves=30;
    var empId = leaveRequest.empId;
    var leave_type = leaveRequest.leave_type;
    var start_date=leaveRequest.leave_start_date;
    var end_date = leaveRequest.leave_end_date;
    console.log(empId);
    var date1 =new Date(start_date);
    var date2 = new Date(end_date);
    var diff= Math.abs(date2.getTime(end_date)-date1.getTime(start_date));
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 

    

    TotalNumberOfLeaves = TotalNumberOfLeaves-diffDays;

    leaveBal(empId,leave_type,update_date,start_date,TotalNumberOfLeaves);


}

//----leave approved function----




exports.create = (req,res)=>{
   
    leaveRequest.create({
        empId:req.body.empId,
        application_date:req.body.application_date,
        leave_start_date:req.body.leave_start_date,
        leave_end_date:req.body.leave_end_date,
        leave_type: req.body.leave_type,
        reason: req.body.reason,
        status:"Pendding"
    }).then(leaveRequest=>{
      
        return res.send(leaveRequest);
    }).catch(err=>{
        return res.status(500).send("error"+err);
    })
};

//findAll---------

exports.findAll = (req,res)=>{
    leaveRequest.findAll().then(leaveRequest=>{
        res.send(leaveRequest);
    }).catch(err=>{
        res.send("error"+err);
    })
};

// find by id----
exports.findByempId = (req,res)=>{
    leaveRequest.findAll({
        where:{
        empId:req.params.empId}
    }).then(leaveRequest=>{
        

       var status = leaveRequest[0].status;
       if(status == "Approved"){
        var d = new Date();

        var update_date = d.toISOString().slice(0,10);
        var TotalNumberOfLeaves=30;
        var empId = leaveRequest[0].empId;
        var leave_type = leaveRequest[0].leave_type;
        var start_date=leaveRequest[0].leave_start_date;
        var end_date = leaveRequest[0].leave_end_date;
        
        var date1 =new Date(start_date);
        var date2 = new Date(end_date);
        var diff= Math.abs(date2.getTime(end_date)-date1.getTime(start_date));
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    
        TotalNumberOfLeaves = TotalNumberOfLeaves-diffDays;
        
        leaveBal(empId,leave_type,update_date,start_date,TotalNumberOfLeaves);
    
       }
       else{
           console.log("not approved");
       }
        
        return res.send(leaveRequest);
    }).catch(err=>{
        return res.send("error"+err);
    })
};

exports.update =(req,res)=>{
   
    leaveRequest.update({
       
        status:req.body.status
    
    },{where:{empId:req.params.empId}}).then(leaveRequest=>{
        
      // leaveManage(leaveRequest);
      console.log({status:leaveRequest.status});
       
    }).catch(err=>{
        console.log(err);
    }) 
}


// exports.update =(req,res)=>{
    
//     leaveRequest.update({
       
//         status:req.body.status
    
//     },{where:{empId:req.params.empId}}).then(leaveRequest=>{
//         leaveManage(leaveRequest);
//         console.log(leaveRequest);
//     }).catch(err=>{
//         console.log(err);
//     }) 
// }



