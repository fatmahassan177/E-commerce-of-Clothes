const FAQ = require('../Models/FAQ.model')
const catchAsync = require('../utils/catch-async')
const logger = require('../utils/logger.utils');
const memoryCache = require('../utils/memory-cache.utils');
const faqCacheKey = 'cachedFAQs';

exports.AddQuestion=catchAsync(async(req,res)=>{
    const {question,answer}=req.body
    if(!question ||!answer ){
        return res.status(400).json({ message: " Q & A are required " });
    }
    const existing = await FAQ.findOne({ question });
  if (existing) {
    return res.status(400).json({ message: 'Question already exists' });
  }

    const faq =await FAQ.create({question,answer})
    memoryCache.del(faqCacheKey);
     logger.info(`New Q & A added `)
    res.status(201).json({message:`New Q & A added`,data:faq})
})


exports.DeleteQuestion=catchAsync(async(req,res)=>{
    const id=req.params.id
    const faq = await FAQ.findById(id);

    if(!faq){
        return res.status(400).json({ message: " Question not found" });
    }

    if (faq.isDeleted) 
        { return res.status(400).json({ message: 'question already deleted '})
    }
    await faq.softDelete()
    memoryCache.del(faqCacheKey);
    logger.info(` Q & A deleted `)
    res.status(200).json({message:` Q & A deleted`,data:faq})
})

exports.getAllFAQ = catchAsync(async (req, res) => {
  const cached = memoryCache.get(faqCacheKey);
  if (cached) {
    logger.info('Returning cached FAQs');
    return res.status(200).json({ message: 'Cached FAQs', data: cached });
  }

  const faqs = await FAQ.find({ isActive: true, isDeleted: false });
  memoryCache.set(faqCacheKey, faqs);
  logger.info('Fetched all FAQs');
  res.status(200).json({ message: 'All FAQs retrieved', data: faqs });
});

exports.UpdateQuestion=catchAsync(async (req,res)=>{
    const id=req.params.id
     const { question, answer, isActive } = req.body;
    const faq = await FAQ.findById(id);
    if(!faq){
        return res.status(400).json({ message: " Question not found" });
    }
    if (faq.isDeleted) 
        { return res.status(400).json({ message: 'cant update deleted question'})
    }
     const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (isActive !== undefined) updateData.isActive = isActive;
    const updatedFaq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

    if (updatedFaq.question) {
    const duplicate = await FAQ.findOne({question: updatedFaq.question,_id: { $ne: updatedFaq._id }, });

    if (duplicate) {
      return res.status(400).json({ message: "Question already exists after update", });
    }
  }
     memoryCache.del(faqCacheKey);
    logger.info(`Question ${id} updated`);
    res.status(200).json({ message: 'Question updated', data: updatedFaq });
  
})


  