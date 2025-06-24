import Reservation from "../models/reservation.js";
import Book from '../models/book.js'


// create reservation by member

export const createReservation = async(req, res) => {

    try{
        const { bookId} = req.body;
        const userId = req.user.id;  // comes from token, sent with request to protected routes and decoded by authMiddleWare


        console.log('book id and userId is', bookId, userId);
        
        const existing =  await Reservation.findOne({user : userId, book:bookId, status:'pending'})
        if(existing) return res.status(400).json({message: 'you have already requested for this book'})
        
        const reservation = await Reservation.create({user: userId, book : bookId})
        console.log('reservation is', reservation);
        
        return res.status(201).json(reservation);


    }catch(error){
        return res.status(500).json({message: 'Failed to create reservation', error})
    }
};


export const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware which is includes in token

    const reservations = await Reservation.find({ user: userId })
    if(!reservations) return res.status(404).json({message: 'No Reservations found'})
        
      .populate('book', 'title author coverImage') 
      .sort({ createdAt: -1 }); // Optional: latest first

    return res.status(200).json(reservations);
  } catch (error) {
   return  res.status(500).json({ message: 'Failed to fetch your reservations', error });
  }
};

// get all pending reservation(librarian only)

 export const getAllPendingReservations = async(req, res) => {
    try{
        const reservations = await Reservation.find({status: 'pending'})
        .populate('user', 'name email')
        .populate('book', 'title author')
        return res.status(201).json(reservations);
    }catch(error){
        res.status(500).json({ message: 'Failed to fetch reservations', error });
    }

};

// approve reservation

export const approveReservation = async(req, res) => {
    try{
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation) return res.status(404).json({message: "Not found"});

        reservation.status = 'approved';
        reservation.approvedAt = Date.now();
        await reservation.save();
        console.log(reservation);
        
        return res.status(200).json(reservation);
    }catch(error) {
        console.log();
        
        return res.status(500).json({message: 'failed to approved'});
    };
}

// reject reservation
export const rejectReservation = async(req, res) => {
    try{
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if(!reservation) return res.status(404).json({message:'Not found'});
        
        reservation.status = 'rejected';
        reservation.rejectedAt = Date.now();
       await reservation.save();
    }catch(error){
        
        return res.status(500).json({message: "Failed to reject", error});
    }
}