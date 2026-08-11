const mapObject = function(object,dto){
    Object.keys(object).forEach(key=>{
      Object.keys(dto).forEach(dtokey=>{
      
            if(key.toLowerCase()==dtokey.toLowerCase()){
                
                object[key] = dto[dtokey];
                
            }
        });
    });
    dto = object;
    
    return object;
}
module.exports={
    mapObject:mapObject
}