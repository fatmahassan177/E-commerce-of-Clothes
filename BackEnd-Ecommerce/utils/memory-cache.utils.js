const nodeCache=require('node-cache')
const MINS = 60 * 5
const cache =new nodeCache({stdTTL:MINS,checkperiod:60})  
module.exports=cache

