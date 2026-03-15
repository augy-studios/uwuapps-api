function mod(n, m) {
    return ((n % m) + m) % m;
}

function sanitizeAlpha(s) {
    return s.toUpperCase().replace(/[^A-Z]/g, '');
}

function invMod(a, m) {
    a = mod(a, m);
    for (var x = 1; x < m; x++)
        if (mod(a * x, m) === 1) return x;
    return null;
}

function substShift(t, sh) {
    return t.replace(/[A-Za-z]/g, function (c) {
        var b = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(b + mod(c.charCodeAt(0) - b + sh, 26));
    });
}

function caesar(t, m, o) {
    var s = parseInt((o || {}).shift) || 3;
    return substShift(t, s * (m === 'encode' ? 1 : -1));
}

function rot13(t) {
    return substShift(t, 13);
}

function a1z26(t, m) {
    if (m === 'encode') return sanitizeAlpha(t).split('').map(function (c) {
        return c.charCodeAt(0) - 64;
    }).join('-');
    return t.trim().split(/[^0-9]+/).filter(Boolean).map(function (n) {
        return String.fromCharCode(64 + (+n));
    }).join('');
}

function vigenere(t, m, o) {
    var key = sanitizeAlpha((o || {}).key || 'KEY');
    if (!key) return t;
    var ki = 0;
    return t.replace(/[A-Za-z]/g, function (c) {
        var b = c <= 'Z' ? 65 : 97,
            p = c.charCodeAt(0) - b,
            k = key.charCodeAt(ki++ % key.length) - 65;
        return String.fromCharCode(b + (m === 'encode' ? mod(p + k, 26) : mod(p - k, 26)));
    });
}

function affine(t, m, o) {
    o = o || {};
    var a = parseInt(o.a) || 5,
        b = parseInt(o.b) || 8,
        inv = invMod(a, 26);
    if (inv == null) throw new Error('a must be coprime to 26');
    return t.replace(/[A-Za-z]/g, function (c) {
        var bs = c <= 'Z' ? 65 : 97,
            x = c.charCodeAt(0) - bs,
            y = m === 'encode' ? mod(a * x + b, 26) : mod(inv * (x - b), 26);
        return String.fromCharCode(bs + y);
    });
}
var BM = 'AAAAA,AAAAB,AAABA,AAABB,AABAA,AABAB,AABBA,AABBB,ABAAA,ABAAB,ABABA,ABABB,ABBAA,ABBAB,ABBBA,ABBBB,BAAAA,BAAAB,BAABA,BAABB,BABAA,BABAB,BABBA,BABBB,BBAAA'.split(',');
var BE = {},
    BD = {};
BM.forEach(function (v, i) {
    var c = String.fromCharCode(65 + i);
    BE[c] = v;
    BD[v] = c;
});

function bacon(t, m) {
    if (m === 'encode') return sanitizeAlpha(t).split('').map(function (c) {
        return BE[c];
    }).join(' ');
    var r = t.toUpperCase().replace(/[^AB]/g, '').match(/.{5}/g);
    return r ? r.map(function (c) {
        return BD[c] || '?';
    }).join('') : ''
}

function railfence(t, m, o) {
    var rails = Math.max(2, Math.min(20, parseInt((o || {}).rails) || 3)),
        s = t.replace(/\s+/g, '');
    return m === 'encode' ? railEnc(s, rails) : railDec(s, rails);
}

function railEnc(s, rails) {
    var rows = [];
    for (var i = 0; i < rails; i++) rows.push([]);
    var r = 0,
        d = 1;
    for (var j = 0; j < s.length; j++) {
        rows[r].push(s[j]);
        r += d;
        if (r === rails - 1 || r === 0) d *= -1;
    }
    return rows.reduce(function (a, b) {
        return a.concat(b);
    }, []).join('');
}

function railDec(s, rails) {
    var len = s.length,
        pat = [],
        r = 0,
        d = 1;
    for (var i = 0; i < len; i++) {
        pat.push(r);
        r += d;
        if (r === rails - 1 || r === 0) d *= -1;
    }
    var cnt = new Array(rails).fill(0);
    pat.forEach(function (r) {
        cnt[r]++;
    });
    var ra = [],
        idx = 0;
    for (var ri = 0; ri < rails; ri++) {
        ra.push(s.slice(idx, idx + cnt[ri]).split(''));
        idx += cnt[ri];
    }
    var res = [],
        pos = new Array(rails).fill(0);
    for (var pi = 0; pi < pat.length; pi++) res.push(ra[pat[pi]][pos[pat[pi]]++]);
    return res.join('');
}

function submono(t, m, o) {
    var mp = ((o || {}).map || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (mp.length !== 26) throw new Error('Provide 26-letter mapping');
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        enc = {},
        dec = {};
    alpha.split('').forEach(function (c, i) {
        enc[c] = mp[i];
        dec[mp[i]] = c;
    });
    return t.replace(/[A-Za-z]/g, function (c) {
        var u = c.toUpperCase(),
            r = (m === 'encode' ? enc[u] : dec[u]) || u;
        return c <= 'Z' ? r : r.toLowerCase();
    });
}

function buildPolybius(kw) {
    var alpha = 'ABCDEFGHIKLMNOPQRSTUVWXYZ',
        used = {},
        tab = [];
    var k = sanitizeAlpha(kw || '').replace(/J/g, 'I');
    (k + alpha).split('').forEach(function (c) {
        if (!used[c]) {
            used[c] = true;
            tab.push(c);
        }
    });
    return tab;
}

function polybius(t, m, o) {
    o = o || {};
    var tab = buildPolybius(o.keyword || ''),
        co = (o.coords || 'numbers').toLowerCase();

    function pos(c) {
        var i = tab.indexOf(c === 'J' ? 'I' : c);
        return [Math.floor(i / 5) + 1, i % 5 + 1];
    }
    if (m === 'encode') return sanitizeAlpha(t).split('').map(function (c) {
        var p = pos(c);
        return co === 'numbers' ? p.join('') : 'ABCDE' [p[0] - 1] + 'ABCDE' [p[1] - 1];
    }).join(' ');
    var tk = co === 'numbers' ? (t.replace(/\D+/g, '').match(/\d{2}/g) || []) : (t.toUpperCase().replace(/[^ABCDE]/g, '').match(/.{2}/g) || []);
    return tk.map(function (tk) {
        var r, c;
        if (co === 'numbers') {
            r = +tk[0] - 1;
            c = +tk[1] - 1;
        } else {
            r = 'ABCDE'.indexOf(tk[0]);
            c = 'ABCDE'.indexOf(tk[1]);
        }
        return tab[r * 5 + c] || '?';
    }).join('');
}

function tap(t, m) {
    var alpha = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    if (m === 'encode') return sanitizeAlpha(t).replace(/J/g, 'I').split('').map(function (c) {
        var i = alpha.indexOf(c),
            d = function (n) {
                var s = '';
                for (var j = 0; j < n; j++) s += '.';
                return s;
            };
        return d(Math.floor(i / 5) + 1) + ' ' + d(i % 5 + 1);
    }).join(' / ');
    return t.trim().split(/\s*\/\s*/).map(function (p) {
        var s = p.trim().split(/\s+/);
        if (s.length < 2) return '?';
        return alpha[(s[0].length - 1) * 5 + (s[1].length - 1)] || '?';
    }).join('');
}
var NATO = {
    A: 'Alfa',
    B: 'Bravo',
    C: 'Charlie',
    D: 'Delta',
    E: 'Echo',
    F: 'Foxtrot',
    G: 'Golf',
    H: 'Hotel',
    I: 'India',
    J: 'Juliett',
    K: 'Kilo',
    L: 'Lima',
    M: 'Mike',
    N: 'November',
    O: 'Oscar',
    P: 'Papa',
    Q: 'Quebec',
    R: 'Romeo',
    S: 'Sierra',
    T: 'Tango',
    U: 'Uniform',
    V: 'Victor',
    W: 'Whiskey',
    X: 'X-ray',
    Y: 'Yankee',
    Z: 'Zulu',
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine'
};
var NREV = {};
Object.keys(NATO).forEach(function (k) {
    NREV[NATO[k].toUpperCase()] = k;
});

function natoSpelling(t, m) {
    if (m === 'encode') return t.toUpperCase().split('').map(function (c) {
        return NATO[c] || c;
    }).join(' ');
    return t.split(/\s+/).map(function (w) {
        return NREV[w.toUpperCase()] || '?';
    }).join('');
}

function colTrans(text, key, mode) {
    var k = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!k) throw new Error('Transposition key required');
    var items = k.split('').map(function (c, i) {
        return {
            c: c,
            i: i
        };
    });
    items.sort(function (a, b) {
        return a.c.charCodeAt(0) - b.c.charCodeAt(0) || a.i - b.i;
    });
    var order = items.map(function (x) {
        return x.i;
    });
    if (mode === 'encode') {
        var cols = order.map(function () {
            return [];
        });
        for (var i = 0; i < text.length; i++) cols[i % k.length].push(text[i]);
        return order.map(function (idx) {
            return cols[idx].join('');
        }).join('');
    }
    var n = text.length,
        bs = Math.floor(n / k.length),
        extra = n % k.length;
    var cl = new Array(k.length).fill(0).map(function (_, i) {
        return bs + (order.indexOf(i) < extra ? 1 : 0);
    });
    var bk = [],
        pos = 0;
    for (var oi = 0; oi < order.length; oi++) {
        var len = cl[order[oi]];
        bk[order[oi]] = text.slice(pos, pos + len).split('');
        pos += len;
    }
    var out = [];
    for (var ri = 0; ri <= bs; ri++)
        for (var ci = 0; ci < k.length; ci++)
            if (bk[ci] && bk[ci][ri] != null) out.push(bk[ci][ri]);
    return out.join('');
}

function adfgx(t, m, o) {
    o = o || {};
    var tab = buildPolybius(o.keyword || ''),
        tr = o.trans || '',
        L = 'ADFGX';
    if (m === 'encode') {
        var f = sanitizeAlpha(t).split('').map(function (c) {
            var i = tab.indexOf(c === 'J' ? 'I' : c);
            return L[Math.floor(i / 5)] + L[i % 5];
        }).join('');
        return colTrans(f, tr, 'encode');
    }
    var df = colTrans(t.toUpperCase().replace(/[^ADFGX]/g, ''), tr, 'decode');
    return (df.match(/.{2}/g) || []).map(function (p) {
        return tab['ADFGX'.indexOf(p[0]) * 5 + 'ADFGX'.indexOf(p[1])] || '?';
    }).join('');
}

function adfgvx(t, m, o) {
    o = o || {};
    var tr = o.trans || '',
        L = 'ADFGVX',
        alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        used = {},
        ks = (sanitizeAlpha(o.keyword || '') + alpha).replace(/J/g, 'I'),
        tab = [];
    ks.split('').forEach(function (c) {
        if (!used[c]) {
            used[c] = true;
            tab.push(c);
        }
    });
    if (m === 'encode') {
        var s = t.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/J/g, 'I'),
            f = s.split('').map(function (c) {
                var i = tab.indexOf(c);
                return L[Math.floor(i / 6)] + L[i % 6];
            }).join('');
        return colTrans(f, tr, 'encode');
    }
    var df = colTrans(t.toUpperCase().replace(/[^ADFGVX]/g, ''), tr, 'decode');
    return (df.match(/.{2}/g) || []).map(function (p) {
        return tab['ADFGVX'.indexOf(p[0]) * 6 + 'ADFGVX'.indexOf(p[1])] || '?';
    }).join('');
}

function bifid(t, m, o) {
    var tab = buildPolybius((o || {}).keyword || '');
    if (m === 'encode') {
        var s = sanitizeAlpha(t).replace(/J/g, 'I'),
            rows = [],
            cols = [];
        s.split('').forEach(function (c) {
            var i = tab.indexOf(c);
            rows.push(Math.floor(i / 5) + 1);
            cols.push(i % 5 + 1);
        });
        var seq = rows.concat(cols),
            out = [];
        for (var i = 0; i < s.length; i++) out.push(tab[(seq[i] - 1) * 5 + (seq[i + s.length] - 1)]);
        return out.join('');
    }
    var s = sanitizeAlpha(t).replace(/J/g, 'I'),
        co = [];
    s.split('').forEach(function (c) {
        var i = tab.indexOf(c);
        co.push(Math.floor(i / 5) + 1, i % 5 + 1);
    });
    var h = co.length / 2,
        r = co.slice(0, h),
        c = co.slice(h),
        out = [];
    for (var i = 0; i < r.length; i++) out.push(tab[(r[i] - 1) * 5 + (c[i] - 1)]);
    return out.join('');
}

function trifid(t, m, o) {
    var alp = ((o || {}).alphabet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.').toUpperCase();
    if (alp.length !== 27) throw new Error('Alphabet must be 27 symbols');
    var map = {};
    alp.split('').forEach(function (c, i) {
        map[c] = [Math.floor(i / 9) + 1, Math.floor(i / 3) % 3 + 1, i % 3 + 1];
    });
    var s = t.toUpperCase().replace(/[^A-Z.]/g, ''),
        R = [],
        C = [],
        D = [];
    s.split('').forEach(function (c) {
        var v = map[c];
        if (v) {
            R.push(v[0]);
            C.push(v[1]);
            D.push(v[2]);
        }
    });
    var seq = R.concat(C).concat(D),
        out = [];
    for (var i = 0; i < R.length; i++) out.push(alp[(seq[i] - 1) * 9 + (seq[i + R.length] - 1) * 3 + (seq[i + 2 * R.length] - 1)]);
    return out.join('');
}

function nihilist(t, m, o) {
    o = o || {};
    var tab = buildPolybius(o.keyword || ''),
        nk = (o.numkey || '').replace(/\D/g, '').split('').map(Number);
    if (!nk.length) throw new Error('Numeric key required');

    function toN(s) {
        return sanitizeAlpha(s).replace(/J/g, 'I').split('').map(function (c) {
            var i = tab.indexOf(c);
            return (Math.floor(i / 5) + 1) * 10 + (i % 5 + 1);
        });
    }
    if (m === 'encode') return toN(t).map(function (n, i) {
        return n + (nk[i % nk.length] || 0);
    }).join(' ');
    return t.trim().split(/\s+/).map(Number).map(function (n, i) {
        var p = n - (nk[i % nk.length] || 0);
        return tab[(Math.floor(p / 10) - 1) * 5 + ((p % 10) - 1)] || '?';
    }).join('');
}
var enigma = (function () {
    var R = {
        I: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        II: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        III: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        IV: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
        V: 'VZBRGITYUPSDNHLXAWMJQOFECK'
    };
    var N = {
        I: 'Q',
        II: 'E',
        III: 'V',
        IV: 'J',
        V: 'Z'
    };
    var RB = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

    function li(c) {
        return c.charCodeAt(0) - 65;
    }

    function il(i) {
        return String.fromCharCode(65 + mod(i, 26));
    }

    function w(s) {
        return s.split('').map(li);
    }
    var mR = {};
    Object.keys(R).forEach(function (k) {
        mR[k] = w(R[k]);
    });
    var ref = w(RB);

    function step(st) {
        var wm = il(st.pos[1]) === N[st.rotors[1]] || il(st.pos[0]) === N[st.rotors[0]];
        st.pos[2] = mod(st.pos[2] + 1, 26);
        if (il(st.pos[2]) === N[st.rotors[2]]) st.pos[1] = mod(st.pos[1] + 1, 26);
        if (wm) st.pos[1] = mod(st.pos[1] + 1, 26);
    }

    function ps(ch, plug) {
        var i = plug.indexOf(ch);
        if (i > -1) {
            var p = Math.floor(i / 2) * 2;
            return ch === plug[p] ? plug[p + 1] : plug[p];
        }
        return ch;
    }
    return function (t, _m, o) {
        o = o || {};
        var rotors = (o.rotors || 'I-II-III').toUpperCase().split(/[-\s]+/).slice(0, 3);
        var rings = (o.rings || '01-01-01').split(/[-\s]+/).map(function (x) {
            return (+x || 1) - 1;
        }).slice(0, 3);
        var pos = (o.pos || 'A-A-A').toUpperCase().split(/[-\s]+/).map(function (x) {
            return x.charCodeAt(0) - 65;
        }).slice(0, 3);
        var pf = (o.plug || '').toUpperCase().replace(/[^A-Z]/g, '');
        var pairs = [];
        for (var i = 0; i + 1 < pf.length; i += 2) {
            pairs.push(pf[i]);
            pairs.push(pf[i + 1]);
        }
        var st = {
            rotors: rotors,
            rings: rings,
            pos: pos,
            plug: pairs
        };
        return sanitizeAlpha(t).split('').map(function (ch) {
            if (!/[A-Z]/.test(ch)) return ch;
            step(st);
            var x = li(ps(ch, st.plug));
            for (var i = 2; i >= 0; i--) {
                var r = mR[st.rotors[i]],
                    rn = st.rings[i],
                    p = st.pos[i];
                x = mod(r[mod(x + p - rn, 26)] - p + rn, 26);
            }
            x = ref[x];
            for (var i = 0; i < 3; i++) {
                var r = mR[st.rotors[i]],
                    rn = st.rings[i],
                    p = st.pos[i];
                x = mod(r.findIndex(function (v) {
                    return v === mod(x + p - rn, 26);
                }) - p + rn, 26);
            }
            return ps(il(x), st.plug);
        }).join('');
    };
})();
var CIPHER_ALGORITHMS = {
    caesar: {
        fn: caesar,
        params: ['shift']
    },
    rot13: {
        fn: function (t) {
            return rot13(t);
        },
        params: []
    },
    a1z26: {
        fn: a1z26,
        params: []
    },
    vigenere: {
        fn: vigenere,
        params: ['key']
    },
    affine: {
        fn: affine,
        params: ['a', 'b']
    },
    bacon: {
        fn: bacon,
        params: []
    },
    railfence: {
        fn: railfence,
        params: ['rails']
    },
    submono: {
        fn: submono,
        params: ['map']
    },
    polybius: {
        fn: polybius,
        params: ['keyword', 'coords']
    },
    tap: {
        fn: tap,
        params: []
    },
    nato: {
        fn: natoSpelling,
        params: []
    },
    adfgx: {
        fn: adfgx,
        params: ['keyword', 'trans']
    },
    adfgvx: {
        fn: adfgvx,
        params: ['keyword', 'trans']
    },
    bifid: {
        fn: bifid,
        params: ['keyword']
    },
    trifid: {
        fn: trifid,
        params: ['alphabet']
    },
    nihilist: {
        fn: nihilist,
        params: ['keyword', 'numkey']
    },
    enigma: {
        fn: enigma,
        params: ['rotors', 'rings', 'pos', 'plug']
    }
};

function runCipher(alg, text, mode, opts) {
    var e = CIPHER_ALGORITHMS[alg];
    if (!e) return {
        error: 'Unknown cipher "' + alg + '". Available: ' + Object.keys(CIPHER_ALGORITHMS).join(', ')
    };
    try {
        return {
            alg: alg,
            mode: mode,
            input: text,
            result: e.fn(text, mode, opts)
        };
    } catch (err) {
        return {
            error: err.message
        };
    }
}
module.exports = {
    runCipher: runCipher,
    CIPHER_ALGORITHMS: CIPHER_ALGORITHMS
};