/**
 * Singapore UEN (Unique Entity Number) utilities
 * https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx
 *
 * Format (A): 8 digits + 1 check letter — businesses registered with ACRA
 * Format (B): 4-digit year + 5 digits + 1 check letter — local companies registered with ACRA
 * Format (C): 1 prefix (T/S/R) + 2-digit year + 2-letter entity type + 4 digits + 1 check letter — all other entities
 */

const ENTITY_TYPE_INDICATORS = [
    'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS', 'GA',
    'GB', 'DP', 'CP', 'NR', 'CM', 'CD', 'MD', 'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX',
    'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM'
];

const VALID_PREFIXES = ['T', 'S', 'R'];

// ─── Helpers ─────────────────────────────────────────────

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomLetter() {
    return String.fromCharCode(randomInt(65, 90));
}

function randomDigits(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomInt(0, 9).toString();
    }
    return result;
}

function isDigit(ch) {
    return !isNaN(ch);
}

function isLetter(ch) {
    return /^[A-Z]$/i.test(ch);
}

// ─── Generators ──────────────────────────────────────────

function generateTypeA() {
    return randomDigits(8) + randomLetter();
}

function generateTypeB(year) {
    const currentYear = new Date().getFullYear();
    const y = year !== undefined ? year : randomInt(1800, currentYear);
    return y.toString().padStart(4, '0') + randomDigits(5) + randomLetter();
}

function generateTypeC(options = {}) {
    const prefix = options.prefix || VALID_PREFIXES[randomInt(0, VALID_PREFIXES.length - 1)];
    const year = options.year !== undefined ?
        options.year.toString().padStart(2, '0').slice(-2) :
        randomDigits(2);
    const entityType = options.entityType || ENTITY_TYPE_INDICATORS[randomInt(0, ENTITY_TYPE_INDICATORS.length - 1)];

    return prefix + year + entityType + randomDigits(4) + randomLetter();
}

function generate(type, options = {}) {
    const types = ['A', 'B', 'C'];
    const selectedType = (type || types[randomInt(0, types.length - 1)]).toUpperCase();

    switch (selectedType) {
        case 'A':
            return {
                uen: generateTypeA(), type: 'A'
            };
        case 'B':
            return {
                uen: generateTypeB(options.year), type: 'B'
            };
        case 'C':
            return {
                uen: generateTypeC(options), type: 'C'
            };
        default:
            throw new Error(`Invalid UEN type: "${selectedType}". Must be "A", "B", or "C".`);
    }
}

// ─── Validator ───────────────────────────────────────────

function validate(uen) {
    if (!uen || String(uen).trim() === '') {
        return {
            valid: false,
            type: null,
            error: 'UEN is empty.'
        };
    }

    uen = uen.toUpperCase().trim();

    if (uen.length < 9 || uen.length > 10) {
        return {
            valid: false,
            type: null,
            error: 'UEN must be 9 or 10 characters.'
        };
    }

    const chars = uen.split('');
    const last = chars[chars.length - 1];

    // last character must always be a letter
    if (!isLetter(last)) {
        return {
            valid: false,
            type: null,
            error: 'Last character must be a letter.'
        };
    }

    // ── Type A: 9 characters ────────────────────────────────
    if (chars.length === 9) {
        for (let i = 0; i < 8; i++) {
            if (!isDigit(chars[i])) {
                return {
                    valid: false,
                    type: 'A',
                    error: 'Characters 1–8 must be digits for Type A.'
                };
            }
        }
        return {
            valid: true,
            type: 'A',
            description: 'Business registered with ACRA'
        };
    }

    // ── 10 characters: Type B or C ──────────────────────────
    const firstFourDigits = chars.slice(0, 4).every(isDigit);

    if (firstFourDigits) {
        // Type B: all of positions 5–9 must also be digits
        const midDigits = chars.slice(4, 9).every(isDigit);
        if (midDigits) {
            return {
                valid: true,
                type: 'B',
                description: 'Local company registered with ACRA'
            };
        }
        return {
            valid: false,
            type: 'B',
            error: 'Characters 5–9 must be digits for Type B.'
        };
    }

    // Type C
    if (!VALID_PREFIXES.includes(chars[0])) {
        return {
            valid: false,
            type: 'C',
            error: 'First character must be T, S, or R for Type C.'
        };
    }

    if (!isDigit(chars[1]) || !isDigit(chars[2])) {
        return {
            valid: false,
            type: 'C',
            error: 'Characters 2–3 must be digits for Type C.'
        };
    }

    if (!isLetter(chars[3])) {
        return {
            valid: false,
            type: 'C',
            error: 'Character 4 must be a letter for Type C.'
        };
    }

    const entityType = chars[3] + chars[4];
    if (!ENTITY_TYPE_INDICATORS.includes(entityType)) {
        return {
            valid: false,
            type: 'C',
            error: `Invalid entity type indicator: "${entityType}".`
        };
    }

    for (let i = 5; i <= 8; i++) {
        if (!isDigit(chars[i])) {
            return {
                valid: false,
                type: 'C',
                error: 'Characters 6–9 must be digits for Type C.'
            };
        }
    }

    return {
        valid: true,
        type: 'C',
        description: 'Other entity with new UEN',
        entityType
    };
}

module.exports = {
    generate,
    validate,
    ENTITY_TYPE_INDICATORS,
    VALID_PREFIXES
};