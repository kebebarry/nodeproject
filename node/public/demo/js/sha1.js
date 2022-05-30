
    'use strict';

    /*
     * @link
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
     * in FIPS 180-1
     * Version 2.2 Copyright Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for details.
     */

    /**
     * 决定hex是大写散列还是小写散列
     * 为true为大写
     */
    var hexcase = 0;
    var chrsz = 8;

    function coreSha1(x, len) {
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;
        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for (var j = 0; j < 80; j++) {
                if (j < 16) {w[j] = x[i + j];}
                else {w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);}
                var t = safeAdd(safeAdd(rol(a, 5), sha1Ft(j, b, c, d)), safeAdd(safeAdd(e, w[j]), sha1Kt(j)));

                e = d;
                d = c;
                c = rol(b, 30);
                b = a;
                a = t;
            }
            a = safeAdd(a, olda);
            b = safeAdd(b, oldb);
            c = safeAdd(c, oldc);
            d = safeAdd(d, oldd);
            e = safeAdd(e, olde);
        }

        return Array(a, b, c, d, e);
    }

    function sha1Ft(t, b, c, d) {
        if (t < 20) {return (b & c) | ((~b) & d);}
        if (t < 40) {return b ^ c ^ d;}
        if (t < 60) {return (b & c) | (b & d) | (c & d);}

        return b ^ c ^ d;
    }

    function sha1Kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }

    function safeAdd(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

        return (msw << 16) | (lsw & 0xFFFF);
    }

    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;

        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
        }

        return bin;
    }
    
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
  
        for (var n = 0; n < string.length; n++) {
  
            var c = string.charCodeAt(n);
  
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
  
        }
  
        return utftext;
    }

    
    function binb2hex(binarray) {
        var hexTab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
        var str = '';

        for (var i = 0; i < binarray.length * 4; i++) {
            str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }

        return str;
    }

    var sha1 = {

        /**
         * sha1_hex散列，16进制字符串形式
         * @param {String} s 内容
         * @return {String} 返回密文,hex字符串
         */
        hex: function(s) {
            s = Utf8Encode(s);
            
            return binb2hex(coreSha1(str2binb(s), s.length * chrsz));
        }
    };

    window.sha1 = sha1;
