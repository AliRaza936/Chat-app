import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        let MongoDB_URL = process.env.MONGODB_URL as string
        if(!MongoDB_URL){
            throw new Error('MongoDB URL is not defined')
        }
        await mongoose.connect(MongoDB_URL)
        console.log('✅ MongoDB Connected successfully')
    } catch (error) {
        console.log(`❌ Mongodb connection error`,error)
        process.exit(1)
    }
}