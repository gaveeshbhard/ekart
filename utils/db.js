<<<<<<< HEAD
const { Pool } = require('pg');
const connectionString = "postgresql://neondb_owner:npg_OEDkR0rtT8gy@ep-frosty-hill-av2fd9ml-pooler.c-11.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=verify-full";
// Configure your database credentials
// const pool = new Pool({
//   user: 'postgres',          // Your PostgreSQL username
//   host: 'localhost',         // Server hosting your database
//   database: 'ekart',    // Your database name
//   password: '12345', // Your database password
//   port: 5432,                // Default PostgreSQL port
// });

const pool = new Pool({
    connectionString,
});


function safeObject(obj){
    Object.keys(obj).forEach((key)=>{
        try{
        obj[key] = obj[key].split("'").join("''");
        }
        catch(e){
        obj[key] = obj[key];
        }
  
    });
    console.log(obj)
    return obj;
}


async function insertIntoTableQuery(obj,tablename){
    obj = safeObject(obj); 
    var query = "INSERT INTO "+tablename+" (";
    var fields = [];
    var values = [];
    
    Object.keys(obj).forEach((key)=>{  
    if(obj[key]!==undefined){
        
        fields.push(key);  
    }
    })
    query += fields.join(',')+") VALUES (";
    Object.keys(obj).forEach((key)=>{ 
    if(obj[key]!==undefined){
    if(typeof(obj[key])=='object'){
        values.push("'"+JSON.stringify(obj[key])+"'")
    }
    else if(typeof(obj[key])!='number' && typeof(obj[key])!='boolean'){
        values.push("'"+obj[key]+"'")
    }
    else{
        values.push(obj[key]);
    }
    }
      })
    query += values.join(',')+") RETURNING *;";
    console.log(query);
    
    var {rows} = await pool.query(query);
    return rows;
};




async function upsertIntoTableQuery(obj,tablename,updateField,selector){ 

    obj = safeObject(obj); 


    var query = "INSERT INTO "+tablename+" (";
    var fields = [];
    var values = [];
    
    Object.keys(obj).forEach((key)=>{  
    if(obj[key]!==undefined){
        
        fields.push(key);  
    }
    })
    query += fields.join(',')+") VALUES (";
    Object.keys(obj).forEach((key)=>{ 
    if(obj[key]!==undefined){
    if(typeof(obj[key])=='object'){
        values.push("'"+JSON.stringify(obj[key])+"'")
    }
    else if(typeof(obj[key])!='number' && typeof(obj[key])!='boolean'){
        values.push("'"+obj[key]+"'")
    }
    else{
        values.push(obj[key]);
    }
    }
      })
    query += values.join(',')+") ON CONFLICT (";
    query+=selector.join(", ");
    query+=") DO UPDATE SET "+updateField+" = '"+obj[updateField]+"' RETURNING *;"
    console.log(query);
    var {rows} = await pool.query(query);
    return rows;
};

async function deleteFromTableQuery(obj,tablename,selector){ 
    obj = safeObject(obj); 

    var query = "DELETE FROM "+tablename+" WHERE ";
    query +=selector.map(x=>" "+x+" = '"+obj[x]+"' ").join("AND");
    query += ";";
    console.log(query);
    var {rows} = await pool.query(query);
    return rows;
};


async function updateTableQuery(obj,tablename,selector){ 
    obj = safeObject(obj); 

    var query = "UPDATE "+tablename+" SET ";
    var fields = [];
    var values = [];
    
    Object.keys(obj).forEach((key)=>{  
    var temp ="";
    if(obj[key]!==undefined){
        temp += key+" = ";
        if(typeof(obj[key])=='object'){
            temp+=("'"+JSON.stringify(obj[key])+"'");
        }
        else if(typeof(obj[key])!='number' && typeof(obj[key])!='boolean'){
            temp+=("'"+obj[key]+"'")
        }
        else{
            temp+=(obj[key]);
        }
        fields.push(temp);
    }
    })
    query += fields.join(',')+" WHERE "+selector+" = "+obj[selector]+" RETURNING *;";
    console.log(query);
    
    var {rows} = await pool.query(query);
    return rows;
};

async function selectAll(TABLE_NAME){
    const {rows} = await pool.query("SELECT * FROM "+TABLE_NAME+" ORDER BY ID ASC;");
    return rows;
}

async function select(TABLE_NAME,FIELD_NAME,FIELD_VALUE){
    FIELD_VALUE = FIELD_VALUE.split("'").join("''");
//    FIELD_VALUE = FIELD_VALUE.split('"').join('\"');

    const {rows} = await pool.query("SELECT * FROM "+TABLE_NAME+" WHERE "+FIELD_NAME+" = $1 ORDER BY ID ASC;",[FIELD_VALUE]);
    return rows;
}


async function joinTablesQuery(TABLE1,TABLE2,JOIN_TYPE,TABLE1_KEY,TABLE2_KEY,SELECTOR_KEY,SELECTOR_VALUE){
    var query = "SELECT * FROM "+TABLE1+" "+JOIN_TYPE+" "+TABLE2+" ON "+TABLE1+"."+TABLE1_KEY+" = "+TABLE2+"."+TABLE2_KEY;
    if(SELECTOR_KEY!==undefined){
        query+=" WHERE "+SELECTOR_KEY+" = '"+SELECTOR_VALUE+"'"
    }
    query+=';';
    const {rows} = await pool.query(query);
    return rows;
}



module.exports = {
  query: (text, params) => pool.query(text, params),
  insertIntoTable:(OBJECT,TABLE_NAME)=> insertIntoTableQuery(OBJECT,TABLE_NAME),
  upsertIntoTable:(OBJECT,TABLE_NAME,UPDATE_FIELD,...SELECTOR)=> upsertIntoTableQuery(OBJECT,TABLE_NAME,UPDATE_FIELD,SELECTOR),
  deleteFromTable:(OBJECT,TABLE_NAME,...SELECTOR)=> deleteFromTableQuery(OBJECT,TABLE_NAME,SELECTOR),
  selectAll:(TABLE_NAME)=> selectAll(TABLE_NAME),
  Selectwhere: (TABLE_NAME,FIELD_NAME,FIELD_VALUE)=> select(TABLE_NAME,FIELD_NAME,FIELD_VALUE),
  updateTable: (OBJECT,TABLE_NAME,SELECTOR)=>updateTableQuery(OBJECT,TABLE_NAME,SELECTOR),
  joinTables: (TABLE1,TABLE2,JOIN_TYPE,TABLE1_KEY,TABLE2_KEY,SELECTOR_KEY,SELECTOR_VALUE)=>joinTablesQuery(TABLE1,TABLE2,JOIN_TYPE,TABLE1_KEY,TABLE2_KEY,SELECTOR_KEY,SELECTOR_VALUE)
=======
const { Pool } = require('pg');
const connectionString = "postgresql://neondb_owner:npg_OEDkR0rtT8gy@ep-frosty-hill-av2fd9ml-pooler.c-11.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=verify-full";
// Configure your database credentials
// const pool = new Pool({
//   user: 'postgres',          // Your PostgreSQL username
//   host: 'localhost',         // Server hosting your database
//   database: 'ekart',    // Your database name
//   password: '12345', // Your database password
//   port: 5432,                // Default PostgreSQL port
// });

const pool = new Pool({
    connectionString,
});


function safeObject(obj){
    Object.keys(obj).forEach((key)=>{
        try{
        obj[key] = obj[key].split("'").join("''");
        }
        catch(e){
        obj[key] = obj[key];
        }
  
    });
    console.log(obj)
    return obj;
}


async function insertIntoTableQuery(obj,tablename){
    obj = safeObject(obj); 
    var query = "INSERT INTO "+tablename+" (";
    var fields = [];
    var values = [];
    
    Object.keys(obj).forEach((key)=>{  
    if(obj[key]!==undefined){
        
        fields.push(key);  
    }
    })
    query += fields.join(',')+") VALUES (";
    Object.keys(obj).forEach((key)=>{ 
    if(obj[key]!==undefined){
    if(typeof(obj[key])=='object'){
        values.push("'"+JSON.stringify(obj[key])+"'")
    }
    else if(typeof(obj[key])!='number' && typeof(obj[key])!='boolean'){
        values.push("'"+obj[key]+"'")
    }
    else{
        values.push(obj[key]);
    }
    }
      })
    query += values.join(',')+") RETURNING *;";
    console.log(query);
    
    var {rows} = await pool.query(query);
    return rows;
};




async function upsertIntoTableQuery(obj,tablename,updateField,selector){ 

    obj = safeObject(obj); 


    var query = "INSERT INTO "+tablename+" (";
    var fields = [];
    var values = [];
    
    Object.keys(obj).forEach((key)=>{  
    if(obj[key]!==undefined){
        
        fields.push(key);  
    }
    })
    query += fields.join(',')+") VALUES (";
    Object.keys(obj).forEach((key)=>{ 
    if(obj[key]!==undefined){
    if(typeof(obj[key])=='object'){
        values.push("'"+JSON.stringify(obj[key])+"'")
    }
    else if(typeof(obj[key])!='number' && typeof(obj[key])!='boolean'){
        values.push("'"+obj[key]+"'")
    }
    else{
        values.push(obj[key]);
    }
    }
      })
    query += values.join(',')+") ON CONFLICT (";
    query+=selector.join(", ");
    query+=") DO UPDATE SET "+updateField+" = '"+obj[updateField]+"' RETURNING *;"
    console.log(query);
    var {rows} = await pool.query(query);
    return rows;
};

async function deleteFromTableQuery(obj,tablename,selector){ 
    obj = safeObject(obj); 

    var query = "DELETE FROM "+tablename+" WHERE ";
    query +=selector.map(x=>" "+x+" = '"+obj[x]+"' ").join("AND");
    query += ";";
    console.log(query);
    var {rows} = await pool.query(query);
    return rows;
};


async function updateTableQuery(obj,tablename,selector){ 
    obj = safeObject(obj); 

    var query = "UPDATE "+tablename+" SET ";
    var fields = [];
    var values = [];
    
    Object.keys(obj).forEach((key)=>{  
    var temp ="";
    if(obj[key]!==undefined){
        temp += key+" = ";
        if(typeof(obj[key])=='object'){
            temp+=("'"+JSON.stringify(obj[key])+"'");
        }
        else if(typeof(obj[key])!='number' && typeof(obj[key])!='boolean'){
            temp+=("'"+obj[key]+"'")
        }
        else{
            temp+=(obj[key]);
        }
        fields.push(temp);
    }
    })
    query += fields.join(',')+" WHERE "+selector+" = "+obj[selector]+" RETURNING *;";
    console.log(query);
    
    var {rows} = await pool.query(query);
    return rows;
};

async function selectAll(TABLE_NAME){
    const {rows} = await pool.query("SELECT * FROM "+TABLE_NAME+" ORDER BY ID ASC;");
    return rows;
}

async function select(TABLE_NAME,FIELD_NAME,FIELD_VALUE){
    FIELD_VALUE = FIELD_VALUE.split("'").join("''");
//    FIELD_VALUE = FIELD_VALUE.split('"').join('\"');

    const {rows} = await pool.query("SELECT * FROM "+TABLE_NAME+" WHERE "+FIELD_NAME+" = $1 ORDER BY ID ASC;",[FIELD_VALUE]);
    return rows;
}


async function joinTablesQuery(TABLE1,TABLE2,JOIN_TYPE,TABLE1_KEY,TABLE2_KEY,SELECTOR_KEY,SELECTOR_VALUE){
    var query = "SELECT * FROM "+TABLE1+" "+JOIN_TYPE+" "+TABLE2+" ON "+TABLE1+"."+TABLE1_KEY+" = "+TABLE2+"."+TABLE2_KEY;
    if(SELECTOR_KEY!==undefined){
        query+=" WHERE "+SELECTOR_KEY+" = '"+SELECTOR_VALUE+"'"
    }
    query+=';';
    const {rows} = await pool.query(query);
    return rows;
}



module.exports = {
  query: (text, params) => pool.query(text, params),
  insertIntoTable:(OBJECT,TABLE_NAME)=> insertIntoTableQuery(OBJECT,TABLE_NAME),
  upsertIntoTable:(OBJECT,TABLE_NAME,UPDATE_FIELD,...SELECTOR)=> upsertIntoTableQuery(OBJECT,TABLE_NAME,UPDATE_FIELD,SELECTOR),
  deleteFromTable:(OBJECT,TABLE_NAME,...SELECTOR)=> deleteFromTableQuery(OBJECT,TABLE_NAME,SELECTOR),
  selectAll:(TABLE_NAME)=> selectAll(TABLE_NAME),
  Selectwhere: (TABLE_NAME,FIELD_NAME,FIELD_VALUE)=> select(TABLE_NAME,FIELD_NAME,FIELD_VALUE),
  updateTable: (OBJECT,TABLE_NAME,SELECTOR)=>updateTableQuery(OBJECT,TABLE_NAME,SELECTOR),
  joinTables: (TABLE1,TABLE2,JOIN_TYPE,TABLE1_KEY,TABLE2_KEY,SELECTOR_KEY,SELECTOR_VALUE)=>joinTablesQuery(TABLE1,TABLE2,JOIN_TYPE,TABLE1_KEY,TABLE2_KEY,SELECTOR_KEY,SELECTOR_VALUE)
>>>>>>> ee2b06e125b99c56378f572cd4d75872886feddc
};