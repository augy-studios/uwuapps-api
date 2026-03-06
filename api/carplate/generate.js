// Vercel Serverless Function: GET /api/carplate/generate
// Generates a random valid Singapore car plate number.
// Query params:
//   count (optional) - number of plates to generate (default: 1, max: 50)

const PREFIX_LIST = ["SLR", "SKR", "SLG", "SKD", "EKS"];

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

function generateOne() {
  const prefix = PREFIX_LIST[Math.floor(Math.random() * PREFIX_LIST.length)];
  const num = Math.floor(1000 + Math.random() * 9000).toString();
  const combined = prefix + num;

  const prefixChars = combined.slice(1, 3);
  const prefixArray = Array.from(prefixChars).map(
    (c) => c.toLowerCase().charCodeAt(0) - 97 + 1
  );
  const numArray = Array.from(combined.slice(3)).map(Number);
  const plateArray = [...prefixArray, ...numArray];

  const suffix = SUFFIX_MAP[addPrefixAndCenterPlateNum(plateArray) % 19];
  return combined + suffix;
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const count = Math.min(Math.max(parseInt(req.query.count, 10) || 1, 1), 50);

  const plates = [];
  for (let i = 0; i < count; i++) {
    plates.push(generateOne());
  }

  return res.status(200).json({
    count: plates.length,
    plates: plates.length === 1 ? plates[0] : plates,
  });
}
