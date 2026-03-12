/**
 * Pure calculator functions — zero HTTP/DOM awareness.
 */

// ─── Age ─────────────────────────────────────────────────

function getDaysInMonth(month, year) {
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

function calculateAge(birthDateStr, referenceDateStr) {
  const ref = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const birth = new Date(birthDateStr);

  if (isNaN(birth.getTime())) return { error: 'Invalid birth date.' };
  if (isNaN(ref.getTime())) return { error: 'Invalid reference date.' };

  const b = { date: birth.getDate(), month: birth.getMonth() + 1, year: birth.getFullYear() };
  const cYear = ref.getFullYear(), cMonth = ref.getMonth() + 1, cDate = ref.getDate();

  // Future check
  if (
    b.year > cYear ||
    (b.year === cYear && (b.month > cMonth || (b.month === cMonth && b.date > cDate)))
  ) {
    return { error: 'Birth date is in the future.' };
  }

  let years = cYear - b.year;
  let months, days;

  if (cMonth < b.month) {
    years--;
    months = 12 - (b.month - cMonth);
  } else {
    months = cMonth - b.month;
  }

  if (cDate < b.date) {
    months--;
    if (months < 0) { months += 12; years--; }
    const lastMonth = cMonth === 1 ? 12 : cMonth - 1;
    const dim = getDaysInMonth(lastMonth, cYear);
    days = dim - (b.date - cDate);
  } else {
    days = cDate - b.date;
  }

  return {
    birthDate: birthDateStr,
    referenceDate: referenceDateStr || ref.toISOString().slice(0, 10),
    years,
    months,
    days,
  };
}

// ─── BMI ─────────────────────────────────────────────────

function calculateBmi(height, weight, unit = 'metric') {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return { error: 'Height and weight must be positive numbers.' };
  }

  let bmi;
  if (unit === 'metric') {
    const m = height / 100; // cm → m
    bmi = weight / (m * m);
  } else if (unit === 'imperial') {
    bmi = 703 * (weight / (height * height)); // height in inches, weight in lbs
  } else {
    return { error: 'Unit must be "metric" or "imperial".' };
  }

  if (!isFinite(bmi)) return { error: 'Could not compute BMI with given values.' };

  bmi = Math.round(bmi * 10) / 10;

  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return {
    bmi,
    category,
    unit,
    height,
    weight,
  };
}

// ─── Days Between Dates ──────────────────────────────────

function calculateDays(fromStr, toStr) {
  const d1 = new Date(fromStr);
  const d2 = new Date(toStr);

  if (isNaN(d1.getTime())) return { error: 'Invalid "from" date.' };
  if (isNaN(d2.getTime())) return { error: 'Invalid "to" date.' };

  const diffMs = d2.getTime() - d1.getTime();
  const days = Math.abs(Math.round(diffMs / (1000 * 3600 * 24)));

  return {
    from: fromStr,
    to: toStr,
    days,
  };
}

// ─── Simple Interest ─────────────────────────────────────

function calculateInterest(principal, rate, time, duration = 'year') {
  if (principal == null || rate == null || time == null) {
    return { error: 'principal, rate, and time are required.' };
  }
  if (principal < 0) return { error: 'Principal must be non-negative.' };

  const interest = duration === 'month'
    ? (principal * rate * time) / 1200
    : (principal * rate * time) / 100;

  const amount = principal + interest;

  return {
    principal: Math.round(principal * 100) / 100,
    rate,
    time,
    duration,
    interest: Math.round(interest * 100) / 100,
    amount: Math.round(amount * 100) / 100,
  };
}

module.exports = { calculateAge, calculateBmi, calculateDays, calculateInterest };
