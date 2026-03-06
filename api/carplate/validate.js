// Vercel Serverless Function: GET /api/carplate/validate
// Validates a Singapore car plate number's checksum letter.
// Query params:
//   plate (required) - the car plate number to validate, e.g. "SKR1234A"

const SUFFIX_MAP = [
  "A", "Z", "Y", "X", "U", "T", "S", "R", "P",
  "M", "L", "K", "J", "H", "G", "E", "D", "C", "B",
];

const WEIGHTS = [9, 4, 5, 4, 3, 2];

function addPrefixAndCenterPlateNum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i] * WEIGHTS[i];
  }
  return total;
}

function validate(carplateNumber) {
  if (!/\d/.test(carplateNumber)) {
    return false;
  }

  const parts = carplateNumber.split(/(\d+)/);
  // parts: [prefix, digits, suffix, ...]

  if (!validatedFields(parts)) {
    return false;
  }

  const prefix = updatePrefix(parts[0]);
  const centerPlateNum = updateCenterPlateNumber(parts[1]);
  const suffix = parts[2];

  return checkSum(prefix, centerPlateNum, suffix);
}

function validatedFields(arr) {
  if (
    arr[0].length === 0 ||
    arr[1].length === 0 ||
    arr[2].length !== 1
  ) {
    return false;
  }

  if (
    !/[a-zA-Z]/.test(arr[0]) ||
    !/\d/.test(arr[1]) ||
    arr[2].toLowerCase() === arr[2].toUpperCase() // not a letter
  ) {
    return false;
  }

  return true;
}

function updateCenterPlateNumber(num) {
  while (num.length < 4) {
    num = "0" + num;
  }
  return num;
}

function updatePrefix(prefix) {
  if (prefix.length > 2) {
    return prefix.slice(1, 3);
  }
  if (prefix.length < 2) {
    prefix = "A" + prefix;
  }
  return prefix;
}

function checkSum(prefix, centerPlateNumber, suffix) {
  const prefixArray = Array.from(prefix).map(
    (c) => c.toLowerCase().charCodeAt(0) - 97 + 1
  );
  const centerArray = Array.from(centerPlateNumber).map(Number);
  const combined = [...prefixArray, ...centerArray];

  if (combined.length !== 6) {
    return false;
  }

  const total = addPrefixAndCenterPlateNum(combined);
  return suffix.toUpperCase() === SUFFIX_MAP[total % 19];
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const plate = (req.query.plate || "").trim();

  if (!plate) {
    return res.status(400).json({
      error: "Missing required query parameter: plate",
      usage: "/api/carplate/validate?plate=SKR1234A",
    });
  }

  const isValid = validate(plate);

  return res.status(200).json({
    plate,
    valid: isValid,
  });
}
