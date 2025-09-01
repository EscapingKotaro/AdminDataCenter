// Утилиты для безопасной работы с числами

/**
 * Безопасное преобразование в число с плавающей точкой
 * @param {*} value - значение для преобразования
 * @param {number} defaultValue - значение по умолчанию
 * @returns {number}
 */
export const safeParseFloat = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return value;
  
  // Удаляем все нечисловые символы кроме точки и минуса
  const cleanValue = String(value).replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Безопасное преобразование в целое число
 * @param {*} value - значение для преобразования
 * @param {number} defaultValue - значение по умолчанию
 * @returns {number}
 */
export const safeParseInt = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return Math.floor(value);
  
  const cleanValue = String(value).replace(/[^\d-]/g, '');
  const parsed = parseInt(cleanValue);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Безопасное форматирование числа с фиксированной точностью
 * @param {*} value - значение для форматирования
 * @param {number} digits - количество знаков после запятой
 * @returns {string}
 */
export const safeToFixed = (value, digits = 2) => {
  const num = safeParseFloat(value);
  return num.toFixed(digits);
};

/**
 * Сумма значений из массива объектов
 * @param {Array} array - массив объектов
 * @param {string} fieldName - имя поля для суммирования
 * @returns {number}
 */
export const sumNumbers = (array, fieldName) => {
  return array.reduce((sum, item) => {
    const value = item[fieldName];
    return sum + safeParseFloat(value);
  }, 0);
};

/**
 * Проверка, является ли значение валидным числом
 * @param {*} value - значение для проверки
 * @returns {boolean}
 */
export const isValidNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Ограничение числа в заданном диапазоне
 * @param {number} value - значение
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 * @returns {number}
 */
export const clamp = (value, min, max) => {
  const num = safeParseFloat(value);
  return Math.min(Math.max(num, min), max);
};

/**
 * Форматирование денежных значений
 * @param {*} value - значение
 * @param {number} decimals - количество знаков после запятой
 * @returns {string}
 */
export const formatCurrency = (value, decimals = 2) => {
  const num = safeParseFloat(value);
  return `$${num.toFixed(decimals)}`;
};

/**
 * Проверка на положительное число
 * @param {*} value - значение
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  const num = safeParseFloat(value);
  return num > 0;
};

export default {
  safeParseFloat,
  safeParseInt,
  safeToFixed,
  sumNumbers,
  isValidNumber,
  clamp,
  formatCurrency,
  isPositiveNumber
};