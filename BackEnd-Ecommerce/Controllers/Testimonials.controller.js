
const Testimonials = require('../Models/Testimonial.model')
const catchAsync = require('../utils/catch-async')
const logger = require('../utils/logger.utils');

exports.AddTestimonials = catchAsync(async(req, res) => {
  const { userId, rating, comment } = req.body;
  if(!userId || !rating || !comment){
    return res.status(400).json({ message: 'User ID, rating and comment are required' });
  }
  
  const testimonial = await Testimonials.create({ userId, rating, comment });
  
  logger.info(`New rating added by user ${userId}`);
  res.status(201).json({ message: 'Rating added', data: testimonial });
});

exports.DeleteTestimonial = catchAsync(async(req, res) => {
  const id = req.params.id;
  const testimonial = await Testimonials.findById(id);
  
  if (!testimonial) {
    return res.status(404).json({ message: 'testimonial not found' });
  }
  if (testimonial.isDeleted) {
    return res.status(400).json({ message: 'testimonial already deleted' });
  }
  
  await testimonial.softDelete();
  
  logger.info(`Rating ${id} deleted`);
  res.status(200).json({ message: 'Rating deleted' });
});

exports.GetAllTestimonial = catchAsync(async (req, res) => {
  const testimonials = await Testimonials.find({ isActive: true, isDeleted: false })
    .populate({ path: 'userId', select: 'name email' }) 
    .sort({ createdAt: -1 });

  logger.info('Fetched all Testimonials');
  res.status(200).json({ message: 'All Testimonials retrieved', data: testimonials });
});

exports.getUnseenTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonials.find({ isSeen: false, isDeleted: false })
    .populate({ path: 'userId', select: 'name email' }) 
    .sort({ createdAt: -1 });

  logger.info(`Get unseen testimonials`);
  res.status(200).json({ 
    message: 'All unseen testimonials retrieved', 
    count: testimonials.length, 
    data: testimonials 
  });
});

exports.getSeenTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonials.find({ isSeen: true, isDeleted: false })
    .populate({ path: 'userId', select: 'name email' }) 
    .sort({ createdAt: -1 });

  logger.info(`Get seen testimonials`);
  res.status(200).json({ 
    message: 'All seen testimonials retrieved', 
    count: testimonials.length, 
    data: testimonials 
  });
});

exports.getApprovedTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonials.find({ isApproved: true, isDeleted: false })
    .populate({ path: 'userId', select: 'name email' }) 
    .sort({ createdAt: -1 });

  logger.info(`Get approved testimonials`);
  res.status(200).json({ 
    message: 'All approved testimonials retrieved', 
    count: testimonials.length, 
    data: testimonials 
  });
});

exports.getUnapprovedTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonials.find({ isApproved: false, isDeleted: false })
    .populate({ path: 'userId', select: 'name email' }) 
    .sort({ createdAt: -1 });

  logger.info(`Get unapproved testimonials`);
  res.status(200).json({ 
    message: 'All unapproved testimonials retrieved', 
    count: testimonials.length, 
    data: testimonials 
  });
});

exports.getUnapprovedTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonials.find({ isApproved: false, isDeleted: false })
   .populate({ path: 'userId', select: 'name email' }) 
    .sort({ createdAt: -1 });
    
  logger.info(`Get unapproved testimonials`);
  res.status(200).json({ 
    message: 'All unapproved testimonials retrieved', 
    count: testimonials.length, 
    data: testimonials 
  });
});

exports.ApproveTestimonial = catchAsync(async (req, res) => {
  const id = req.params.id;
  const testimonial = await Testimonials.findById(id);
  
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  if (testimonial.isDeleted) {
    return res.status(400).json({ message: 'Cannot approve deleted testimonial' });
  }
  if (testimonial.isApproved) {
    return res.status(400).json({ message: 'Testimonial already approved' });
  }
  
  testimonial.isApproved = true;
  await testimonial.save();
  
  logger.info(`Testimonial ${id} approved`);
  res.status(200).json({ message: 'Testimonial approved', data: testimonial });
});

exports.MarkTestimonialAsSeen = catchAsync(async (req, res) => {
  const id = req.params.id;
  const testimonial = await Testimonials.findById(id);
  
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  if (testimonial.isDeleted) {
    return res.status(400).json({ message: 'Cannot mark deleted testimonial as seen' });
  }
  if (testimonial.isSeen) {
    return res.status(400).json({ message: 'Testimonial already marked as seen' });
  }
  
  testimonial.isSeen = true;
  await testimonial.save();
  
  logger.info(`Testimonial ${id} marked as seen`);
  res.status(200).json({ message: 'Testimonial marked as seen', data: testimonial });
});