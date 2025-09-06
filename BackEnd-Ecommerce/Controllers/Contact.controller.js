const catchAsync = require('../utils/catch-async');
const logger = require('../utils/logger.utils');
const Contact=require('../Models/Contact.model')

exports.AddContact=catchAsync(async(req,res)=>{
    const {FirstName,LastName,email,message,type }=req.body
    const contact= await Contact.create({FirstName,LastName,email,message,type, isSeen:false})
     logger.info(`New contact message received `)
    res.status(200).json({message:`message sended`,data:contact})
})
exports.DeleteContact=catchAsync(async(req,res)=>{
    const id=req.params.id
    const contact = await Contact.findById(id);
    
    if (!contact) {
        return res.status(404).json({   message: 'Message Not Found'});
    }
     logger.info(`Contact message deleted:- Email: ${contact.email}`);
    await contact.softDelete()
    res.status(200).json({message:`message deleted`,data:contact})
})

exports.getAllMessage=catchAsync(async(req,res)=>{
       const contact= await Contact.find({ isDeleted: false }).sort({ createdAt: -1 })
        logger.info(`Get all message`);
        res.status(200).json({message:`all messages :-`,data:contact})
})


exports.MarkAsseen = catchAsync(async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate( id, { isSeen: true }, { new: true});
    
    if (!contact) {
        return res.status(404).json({ message: 'message not Found'});
    }
    logger.info(`Contact message marked as seen: ${id}`);
    res.status(200).json({ message: 'seen', data: contact });
});


exports.getUnseenMessages = catchAsync(async (req, res) => {
    const contact = await Contact.find({ isSeen: false, isDeleted: false}).sort({ createdAt: -1 })
     logger.info(`get message unseen`);
    res.status(200).json({ count: contact.length, data: contact })
})