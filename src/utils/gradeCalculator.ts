/**
 * Calculate the grade needed on the third assessment to achieve a final grade of 3.0
 * @param firstGrade - First assessment grade (30% of final grade)
 * @param secondGrade - Second assessment grade (35% of final grade)
 * @returns Required grade for third assessment or null if impossible
 */
export const calculateRequiredGrade = (firstGrade: number, secondGrade: number): number | null => {
  // First grade is 30%, second is 35%, third is 35%
  const firstContribution = firstGrade * 0.3;
  const secondContribution = secondGrade * 0.35;
  
  // Calculate what's needed for a 3.0 final grade
  const targetFinalGrade = 3.0;
  const requiredThirdContribution = targetFinalGrade - firstContribution - secondContribution;
  const requiredThirdGrade = requiredThirdContribution / 0.35;
  
  // If required grade is greater than 5.0 (max possible grade), it's impossible
  if (requiredThirdGrade > 5.0) {
    return null;
  }
  
  // If required grade is negative, student has already passed
  if (requiredThirdGrade < 0) {
    return 0;
  }
  
  return Number(requiredThirdGrade.toFixed(2));
};

/**
 * Validate if the input is a valid decimal number
 * @param value - The input value to validate
 * @returns True if valid decimal, false otherwise
 */
export const isValidDecimalGrade = (value: string): boolean => {
  // Check if input is a number between 0 and 5 with up to 2 decimal places
  const regex = /^(?:[0-4](?:\.\d{1,2})?|5(?:\.0{1,2})?)$/;
  return regex.test(value);
};