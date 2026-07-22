import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumina'; // Assuming typical local URI, I should check .env.local

async function run() {
  console.log("Connecting...");
  await mongoose.connect(uri);
  console.log("Connected");
  const db = mongoose.connection.db;
  
  const projects = await db.collection('projects').find({}).toArray();
  console.log('Projects:', projects.map(p => ({name: p.name, eventDate: p.eventDate})));
  
  const bookings = await db.collection('bookings').find({}).toArray();
  console.log('Bookings:', bookings.map(b => ({name: b.client, date: b.date})));

  const quotations = await db.collection('quotations').find({}).toArray();
  console.log('Quotations:', quotations.map(q => ({name: q.customerName, bookingDate: q.bookingDate})));

  mongoose.disconnect();
}
run();
