const purchase=require('../Models/Order.model')
const mongoose=require('mongoose')

exports.getSaleReport=async(req,res)=>{
    const {startDate,endDate}=req.query
    const matchStage={}
    if(startDate && endDate){
        matchStage.createdAt={}
        matchStage.createdAt.$gte=new Date(startDate)
        matchStage.createdAt.$lte=new Date(endDate)

        const report=await purchase.aggregate([
            {$match:matchStage},
            {
                $lookup:{                         
                     from:'users',                 
                     localField:'user',                 
                     foreignField:'_id',                 
                     as:'user'
                }, },
                
               { $lookup:{                          
                     from:'products',                 
                     localField:'product',                  
                     foreignField:'_id',                
                     as:'product'
                }

            },
            { $unwind: "$user" },
            {$unwind :'$product'},  
                      
           
            {
                $facet:{                       
                    Total:[
                        {
                            $group:{
                                _id:null,
                                totalSalesAmout:{$sum:{ $multiply: ["$price", "$quantity"] }},
                                totalQuantitySold:{$sum:'$quantity'},
                                numberOfPurchases:{$sum:1}
                            }
                        }
                    ],

                    topProducts:[
                        {
                            $group:{
                                _id:'$product._id',
                                name:{$first:'$product.title'},
                                revenue:{$sum:{ $multiply: ["$price", "$quantity"] }},
                                QuantitySold:{$sum:'$quantity'},
                                imageURL:{$first:'$product. imgurl'},

                            },
                        },
                         {$sort:{revenue:-1} },
                         {$limit:5}
                    ],
                    
                    salesByUsers:[{
                         $group:
                          { 
                         _id:'$user._id',
                         name:{$first:'$user.name'},
                         totalSpent:{$sum:{ $multiply: ["$price", "$quantity"] }},
                         totalPurchase:{$sum:1},
                         totalUnits:{$sum:'$quantity'},
                        
                        }
                    },{$sort:{totalSpent:-1}},
                      {$limit:5}
                    ],
                     
                    MonthlySales:[
                        {$group:{
                            _id:{
                                year:{$year   : '$createdAt'},
                                month:{$month :'$createdAt'}
                                
                            },
                            totalRevenue:{$sum:{ $multiply: ["$price", "$quantity"] }},
                            totalQuantitySold:{$sum:'$quantity'},
                        }
                        },{$sort:{'_id.year':1,'_id.month':1}}
                    ],

                }
            }
        ]);
        res.status(200).json({message:'purchase report',data:report})
    }

}