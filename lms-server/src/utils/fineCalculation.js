export const calculateFine = (dueDate, returnDate = null) => {
  const finePerDay = 50;
  const gracePeriod = 0;

  const today = new Date();
  const endDate = returnDate ? new Date(returnDate) : today;
  const due = new Date(dueDate);

  // Add a check to see if the dates are valid
  if (isNaN(endDate.getTime()) || isNaN(due.getTime())) {
    console.error('Invalid date provided to calculateFine:', { dueDate, returnDate });
    return 0; // Return 0 to prevent the CastError
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.floor((endDate - due) / msPerDay);

  if (daysLate <= gracePeriod) return 0;

  return daysLate * finePerDay;
};