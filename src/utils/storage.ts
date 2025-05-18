import { User, CourseGrade } from '../types';

// Local storage keys
const USERS_KEY = 'uninotas_users';
const GRADES_KEY = 'uninotas_grades';
const CURRENT_USER_KEY = 'uninotas_current_user';

// Initialize storage
const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(GRADES_KEY)) {
    localStorage.setItem(GRADES_KEY, JSON.stringify([]));
  }
};

// User management
export const getUsers = (): User[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Course grade management
export const getGrades = (): CourseGrade[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(GRADES_KEY) || '[]');
};

export const getUserGrades = (userId: string): CourseGrade[] => {
  const grades = getGrades();
  return grades.filter(grade => grade.userId === userId);
};

export const saveGrade = (grade: CourseGrade): void => {
  const grades = getGrades();
  grades.push(grade);
  localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
};

export const updateGrade = (updatedGrade: CourseGrade): void => {
  const grades = getGrades();
  const index = grades.findIndex(grade => grade.id === updatedGrade.id);
  if (index !== -1) {
    grades[index] = updatedGrade;
    localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  }
};

export const deleteGrade = (gradeId: string): void => {
  const grades = getGrades();
  const filteredGrades = grades.filter(grade => grade.id !== gradeId);
  localStorage.setItem(GRADES_KEY, JSON.stringify(filteredGrades));
};