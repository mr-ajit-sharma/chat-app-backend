import mongoose, { connect } from 'mongoose'
const db=async()=>{
    try {
       const dbConnection= await mongoose.connect(process.env.MONGO_URI).then(()=>{
           console.log("db connected successfully")
        })

    } catch (error) {
        console.log(error,"error in db connection")
    }
}
export default db