
import express from 'express';
import Borrow from '../models/Borrow.js';
import Book from '../models/book.js';
import { isAdmin, protect } from '../Middleware/authMiddleware.js';
 
const reportRouter = express.Router();


//GET /api/reports/borrowing-returning-trends
// Provides daily borrowing and returning counts within a specified date range.
reportRouter.get('/borrowing-returning-trends',  async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            return res.status(400).json({ message: 'Valid startDate and endDate are required.' });
        }

        const start = new Date(startDate);
        // Set end date to the very end of the day for inclusive range
        const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));

        const results = await Borrow.aggregate([
            {
                $match: {
                    $or: [
                        // Match documents where borrowDate falls within the range
                        { borrowDate: { $gte: start, $lte: end } },
                        // Match documents where returnDate falls within the range and is not null
                        { returnDate: { $gte: start, $lte: end, $ne: null } }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    // Extract date strings for grouping
                    borrowDay: { $dateToString: { format: "%Y-%m-%d", date: "$borrowDate" } },
                    returnDay: { $dateToString: { format: "%Y-%m-%d", date: "$returnDate" } },
                    // Conditional check: 1 if it's a borrow event within range, 0 otherwise
                    isBorrowed: {
                        $cond: [
                            { $and: [{ $gte: ['$borrowDate', start] }, { $lte: ['$borrowDate', end] }] },
                            1, 0
                        ]
                    },
                    // Conditional check: 1 if it's a return event within range, 0 otherwise
                    isReturned: {
                        $cond: [
                            { $and: [{ $ne: ['$returnDate', null] }, { $gte: ['$returnDate', start] }, { $lte: ['$returnDate', end] }] },
                            1, 0
                        ]
                    },
                }
            },
            {
                // Group by date. We use borrowDay as the primary grouping key,
                // but the counts will combine based on isBorrowed/isReturned flags.
                $group: {
                    _id: "$borrowDay", // Use borrowDay as the grouping key for the main date, or you can use a combined date logic
                    borrowedCount: { $sum: "$isBorrowed" },
                    returnedCount: { $sum: "$isReturned" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    borrowedCount: 1,
                    returnedCount: 1,
                    _id: 0
                }
            },
            {
                $sort: { date: 1 } // Sort by date ascending
            }
        ]);

        // --- Post-aggregation processing to ensure continuous dates ---
        // ECharts (and most charting libraries) perform best with a continuous
        // series of dates, even if there's no activity on some days.
        const dateMap = new Map();
        results.forEach(item => dateMap.set(item.date, { borrowedCount: item.borrowedCount, returnedCount: item.returnedCount }));

        const allDates = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            allDates.push(dateStr);
            currentDate.setDate(currentDate.getDate() + 1); // Increment day
        }

        const formattedResults = allDates.map(date => ({
            date: date,
            borrowedCount: dateMap.has(date) ? dateMap.get(date).borrowedCount : 0,
            returnedCount: dateMap.has(date) ? dateMap.get(date).returnedCount : 0,
        }));
         console.log('formatted result is', formattedResults);
         
        res.status(200).json(formattedResults);

    } catch (error) {
        console.error('Error fetching borrowing/returning trends:', error);
        res.status(500).json({ message: 'Server error fetching trends' });
    }
});

// 2. GET /api/reports/overdue-count
// Provides the current total number of books that are overdue.
reportRouter.get('/overdue-count',   async (req, res) => {
    try {
        const overdueCount = await Borrow.countDocuments({
            status: { $in: ["approved", "issued"] }, // Books that are currently borrowed (not returned/cancelled)
            dueDate: { $lt: new Date() } // Books whose due date is in the past
        });
        res.status(200).json({ overdueCount });
    } catch (error) {
        console.error('Error fetching overdue count:', error);
        res.status(500).json({ message: 'Server error fetching overdue count' });
    }
});

// 3. GET /api/reports/most-borrowed-books
// Provides a list of the top N most borrowed books.
reportRouter.get('/most-borrowed-books',  async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to top 10 if limit is not provided

        const mostBorrowed = await Borrow.aggregate([
            {
                // Group all borrow documents by 'book' ID and count occurrences
                $group: {
                    _id: "$book", // Group by the ObjectId of the book
                    borrowCount: { $sum: 1 } // Count each borrow instance
                }
            },
            {
                // Sort the groups in descending order based on borrowCount
                $sort: { borrowCount: -1 }
            },
            {
                // Limit the results to the top N books
                $limit: limit
            },
            {
                // Perform a left outer join with the 'books' collection
                // to get the details of each book (specifically the title)
                $lookup: {
                    from: "books", // The actual collection name for your 'Book' model (usually lowercase, plural, e.g., 'books')
                    localField: "_id",       // Field from the input documents (_id from $group, which is book ObjectId)
                    foreignField: "_id",     // Field from the 'books' collection
                    as: "bookDetails"        // Output array field name
                }
            },
            {
                // $lookup returns an array. $unwind deconstructs it, creating a new document for each element.
                // Since _id is unique and we're joining on it, each array will have only one element.
                $unwind: "$bookDetails"
            },
            {
                // Project (shape) the output documents to include only necessary fields
                $project: {
                    _id: 0,                         // Exclude the default _id field
                    bookTitle: "$bookDetails.title", // Get the 'title' from the joined bookDetails
                    borrowCount: 1                  // Include the calculated borrowCount
                }
            }
        ]);
        res.status(200).json(mostBorrowed);
    } catch (error) {
        console.error('Error fetching most borrowed books:', error);
        res.status(500).json({ message: 'Server error fetching most borrowed books' });
    }
});


// to get most active users 
reportRouter.get('/top-active-users', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Get limit from query param, default to 10

        // Mongoose Aggregation Pipeline to find top active users
        const topActiveUsers = await Borrow.aggregate([
            {
                // Stage 1: Group borrows by user and count them
                $group: {
                    _id: '$user', // Group by the user's ObjectId
                    activityCount: { $sum: 1 } // Count each borrow as an activity
                }
            },
            {
                // Stage 2: Join with the 'users' collection to get user details
                $lookup: {
                    from: 'users', // This must be the actual collection name in MongoDB (usually plural lowercase of model name)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails' // Array containing the matched user document
                }
            },
            {
                // Stage 3: Deconstruct the userDetails array (since _id is unique, it will be an array of 1 element)
                $unwind: '$userDetails'
            },
            {
                // Stage 4: Project (select and rename) the desired fields
                $project: {
                    _id: 0, // Exclude the default _id from the output
                    userId: '$_id', // Rename _id to userId
                    userName: '$userDetails.name', // Get the user's name
                    email: '$userDetails.email',   // Get the user's email (optional)
                    activityCount: 1 // Keep the calculated activity count
                }
            },
            {
                // Stage 5: Sort by activityCount in descending order
                $sort: { activityCount: -1 }
            },
            {
                // Stage 6: Limit the results to the top N users
                $limit: limit
            }
        ]);

        res.json(topActiveUsers);

    } catch (error) {
        console.error('Error fetching top active users:', error);
        res.status(500).json({ message: 'Error fetching top active users', error: error.message });
    }
});

export default reportRouter;