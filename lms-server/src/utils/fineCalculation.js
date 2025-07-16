



export const calculateFine = (dueDate, returnDate = null) => {
  const finePerDay = 50; // Customize as needed
  const gracePeriod = 0;

  const today = new Date();
  const endDate = returnDate ? new Date(returnDate) : today;
  const due = new Date(dueDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.floor((endDate - due) / msPerDay); //((endDate - due) ==> this automatically returns date on automatically converts them to timestamps(milliseconds)

  if (daysLate <= gracePeriod) return 0;

  return daysLate * finePerDay;
};
