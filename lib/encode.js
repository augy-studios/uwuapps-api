/**
 * Encoding/decoding algorithms — pure logic, zero DOM/HTTP awareness.
 */

function textToBytes(str) {
    return new TextEncoder().encode(str);
}

function bytesToText(bytes) {
    return new TextDecoder().decode(bytes);
}

var B32_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32(text, mode) {
    if (mode === 'encode') {
        var bytes = textToBytes(text),
            bits = '';
        for (var i = 0; i < bytes.length; i++) bits += bytes[i].toString(2).padStart(8, '0');
        bits += '0'.repeat((5 - (bits.length % 5 || 5)) % 5);
        var out = '';
        for (var j = 0; j < bits.length; j += 5) out += B32_ALPHA[parseInt(bits.slice(j, j + 5), 2)];
        while (out.length % 8) out += '=';
        return out;
    }
    var s = text.replace(/=+$/, '').toUpperCase(),
        b = '';
    for (var i = 0; i < s.length; i++) {
        var idx = B32_ALPHA.indexOf(s[i]);
        if (idx >= 0) b += idx.toString(2).padStart(5, '0');
    }
    var out = [];
    for (var j = 0; j < b.length; j += 8) {
        var byte = b.slice(j, j + 8);
        if (byte.length === 8) out.push(parseInt(byte, 2));
    }
    return bytesToText(new Uint8Array(out));
}

function base64(text, mode) {
    if (mode === 'encode') return Buffer.from(text, 'utf-8').toString('base64');
    return Buffer.from(text, 'base64').toString('utf-8');
}

function ascii85(text, mode) {
    if (mode === 'encode') {
        var bytes = textToBytes(text),
            out = '';
        for (var i = 0; i < bytes.length; i += 4) {
            var a = bytes[i] || 0,
                b = bytes[i + 1] || 0,
                c = bytes[i + 2] || 0,
                d = bytes[i + 3] || 0;
            var n = ((a << 24) >>> 0) + (b << 16) + (c << 8) + d;
            if (n === 0 && i + 4 <= bytes.length) {
                out += 'z';
                continue;
            }
            var tmp = '',
                val = n >>> 0;
            for (var j = 0; j < 5; j++) {
                tmp = String.fromCharCode(33 + (val % 85)) + tmp;
                val = Math.floor(val / 85);
            }
            out += tmp;
        }
        return out;
    }
    var s = text.replace(/\s+/g, '').replace(/z/g, '!!!!!'),
        out = [];
    for (var i = 0; i < s.length; i += 5) {
        var block = s.slice(i, i + 5);
        if (block.length < 5) break;
        var n = 0;
        for (var j = 0; j < block.length; j++) n = n * 85 + (block.charCodeAt(j) - 33);
        out.push((n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255);
    }
    return bytesToText(new Uint8Array(out));
}

function urlenc(text, mode) {
    return mode === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text);
}

function codepoints(text, mode) {
    if (mode === 'encode') return Array.from(text).map(function (ch) {
        return 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    }).join(' ');
    return text.trim().split(/\s+/).map(function (u) {
        return String.fromCodePoint(parseInt(u.replace(/^U\+/i, ''), 16));
    }).join('');
}

var BAUDOT_LTRS = {
    A: 3,
    B: 25,
    C: 14,
    D: 9,
    E: 1,
    F: 13,
    G: 26,
    H: 20,
    I: 6,
    J: 11,
    K: 15,
    L: 18,
    M: 28,
    N: 12,
    O: 24,
    P: 22,
    Q: 23,
    R: 10,
    S: 5,
    T: 16,
    U: 7,
    V: 30,
    W: 19,
    X: 29,
    Y: 21,
    Z: 17,
    ' ': 4
};
var BAUDOT_FIGS = {
    '3': 3,
    '?': 25,
    ':': 14,
    '9': 9,
    '2': 1,
    '/': 13,
    '7': 26,
    '-': 20,
    '8': 6,
    '(': 15,
    ')': 18,
    '.': 28,
    ',': 12,
    '0': 24,
    '1': 22,
    '4': 23,
    '5': 16,
    ';': 30,
    '=': 29,
    '6': 21,
    ' ': 4
};
var BAUDOT_SH_L = 31,
    BAUDOT_SH_F = 27;
var BAUDOT_REV_L = {},
    BAUDOT_REV_F = {};
Object.keys(BAUDOT_LTRS).forEach(function (k) {
    BAUDOT_REV_L[BAUDOT_LTRS[k]] = k;
});
Object.keys(BAUDOT_FIGS).forEach(function (k) {
    BAUDOT_REV_F[BAUDOT_FIGS[k]] = k;
});

function baudot(text, mode) {
    if (mode === 'encode') {
        text = text.toUpperCase();
        var m = 'L',
            out = [];
        for (var i = 0; i < text.length; i++) {
            var ch = text[i],
                table = (BAUDOT_LTRS[ch] != null) ? 'L' : (BAUDOT_FIGS[ch] != null) ? 'F' : null;
            if (!table) continue;
            if (m !== table) {
                out.push(table === 'L' ? BAUDOT_SH_L : BAUDOT_SH_F);
                m = table;
            }
            out.push(table === 'L' ? BAUDOT_LTRS[ch] : BAUDOT_FIGS[ch]);
        }
        return out.map(function (n) {
            return n.toString(2).padStart(5, '0');
        }).join(' ');
    }
    var toks = text.trim().split(/\s+/),
        m = 'L',
        out = [];
    for (var i = 0; i < toks.length; i++) {
        var n = parseInt(toks[i], 2);
        if (n === BAUDOT_SH_L) {
            m = 'L';
            continue;
        }
        if (n === BAUDOT_SH_F) {
            m = 'F';
            continue;
        }
        out.push((m === 'L' ? BAUDOT_REV_L[n] : BAUDOT_REV_F[n]) || '?');
    }
    return out.join('');
}

function caseTransform(text, mode, opts) {
    var style = ((opts || {}).style || 'upper').toLowerCase();
    if (style === 'upper') return text.toUpperCase();
    if (style === 'lower') return text.toLowerCase();
    if (style === 'title') return text.replace(/\w\S*/g, function (w) {
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
    });
    if (style === 'sentence') return text.replace(/(^\s*[a-z])|([\.\!\?]\s*[a-z])/g, function (m) {
        return m.toUpperCase();
    });
    return text;
}

function reverse(text) {
    return text.split('').reverse().join('');
}

function findReplace(text, mode, opts) {
    opts = opts || {};
    var find = opts.find || '',
        repl = opts.repl || '';
    if (!find) return text;
    var rx = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    return text.replace(rx, repl);
}

var ENCODE_ALGORITHMS = {
    base32: {
        fn: base32,
        params: []
    },
    base64: {
        fn: base64,
        params: []
    },
    ascii85: {
        fn: ascii85,
        params: []
    },
    urlenc: {
        fn: urlenc,
        params: []
    },
    codepoints: {
        fn: codepoints,
        params: []
    },
    baudot: {
        fn: baudot,
        params: []
    },
    case: {
        fn: caseTransform,
        params: ['style']
    },
    reverse: {
        fn: function (t) {
            return reverse(t);
        },
        params: []
    },
    replace: {
        fn: findReplace,
        params: ['find', 'repl']
    },
};

function runEncode(alg, text, mode, opts) {
    var entry = ENCODE_ALGORITHMS[alg];
    if (!entry) return {
        error: 'Unknown encoding "' + alg + '". Available: ' + Object.keys(ENCODE_ALGORITHMS).join(', ')
    };
    try {
        var result = entry.fn(text, mode, opts);
        return {
            alg: alg,
            mode: mode,
            input: text,
            result: result
        };
    } catch (e) {
        return {
            error: e.message
        };
    }
}

module.exports = {
    runEncode: runEncode,
    ENCODE_ALGORITHMS: ENCODE_ALGORITHMS
};