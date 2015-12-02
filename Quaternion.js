/**
 * Copyright (c) 2015 Ádám Kecskés
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

 /*
 TODO: Define polars
 rotate x,y,z
 scale x,y,z
 translate x,y,z
 */
 
(function(base) {
    
    'use strict';
    
    var ARRAY_TYPE = ('Float64Array' in base) ? Float64Array : Array; 
    var EPSILON = (('Number' in base) && ('EPSILON' in base.Number))? base.Number.EPSILON*8 : 0.0000001;
    
    var PI_2 = Math.PI * 2;
    
    /**
    * Quaternion constructor
    *
    * @class Quaternion
    * @constructor
    * @static
    * @param a {Number} real part
    * @param b {Number} imaginary i part
    * @param c {Number} imaginary j part
    * @param d {Number} imaginary k part
    */
    var Quaternion = function(a, b, c, d) {
        var data  = new ARRAY_TYPE(4);
        
        // a + b*i + c*j + d*k
        
        data[0] = a || 0.0; // r
        data[1] = b || 0.0; // i
        data[2] = c || 0.0; // j
        data[3] = d || 0.0; // k
        
        this.data = data;
    };
    
    /**
    * Random Quaternion (values between -1 and +1)
    *
    * @return {Quaternion}
    */
    Quaternion.random = function() {
        return new Quaternion(
            Math.random()*2.0-1.0,
            Math.random()*2.0-1.0,
            Math.random()*2.0-1.0,
            Math.random()*2.0-1.0
        );
    };
    
    // access to a, b, c, d values without the ".data[i]"
    Object.defineProperty(Quaternion.prototype, 'a', {
        get: function() { return this.data[0]; },
        set: function(v) { this.data[0] = +v; }
    });
    
    Object.defineProperty(Quaternion.prototype, 'b', {
        get: function() { return this.data[1]; },
        set: function(v) { this.data[1] = +v; }
    });
    
    Object.defineProperty(Quaternion.prototype, 'c', {
        get: function() { return this.data[2]; },
        set: function(v) { this.data[2] = +v; }
    });
    
    Object.defineProperty(Quaternion.prototype, 'd', {
        get: function() { return this.data[3]; },
        set: function(v) { this.data[3] = +v; }
    });
    
    Object.defineProperty(Quaternion.prototype, 'v', {
        get: function() { return this.imag(); },
        set: function(v) {
            this.data[1] = v.data[1];
            this.data[2] = v.data[2];
            this.data[3] = v.data[3];
        }
    });
    
    // theta value of the the polar decomposition
    Object.defineProperty(Quaternion.prototype, 'theta', {
        get: function() {
            return Math.acos(this.data[0]/this.norm());
        },
        set: function(v) {
            this.data[0] = this.norm()*Math.cos(v);
        }
    });
    
    // ň value of the the polar decomposition
    Object.defineProperty(Quaternion.prototype, 'n', {
        get: function() {
            return this.v.unit();
        },
        set: function(n) {
            var v = this.v;
            
            this.v = n.scale(v.norm())
        }
    });

    /**
    * Equals
    *
    * @param that {Quaternion}
    * @return {Boolean}
    */
    Quaternion.prototype.equals = function(that) {
        return (
            (Math.abs(this.data[0] - that.data[0]) <= EPSILON) &&
            (Math.abs(this.data[1] - that.data[1]) <= EPSILON) &&
            (Math.abs(this.data[2] - that.data[2]) <= EPSILON) &&
            (Math.abs(this.data[3] - that.data[3]) <= EPSILON)
        );
    };
    
    /**
    * Clone
    *
    * @return {Quaternion} clone
    */
    Quaternion.prototype.clone = function() {
        return new Quaternion(
            this.data[0],
            this.data[1],
            this.data[2],
            this.data[3]
        );
    };
    
    /**
    * Real
    *
    * @return {Quaternion} new quaternion with the real part only
    */
    Quaternion.prototype.real = function() {
        return new Quaternion(
            this.data[0],
            0.0,
            0.0,
            0.0
        );
    };

    /**
    * Imaginary
    *
    * @return {Quaternion} new quaternion with the imaginary part only
    */
    Quaternion.prototype.imag = function() {
        return new Quaternion(
            0.0,
            this.data[1],
            this.data[2],
            this.data[3]
        );
    };

    /**
    * Complex
    *
    * @return {Quaternion} new quaternion with the complex (a+i*b) part only
    */
    Quaternion.prototype.comp = function() {
        return new Quaternion(
            this.data[0],
            this.data[1],
            0.0,
            0.0
        );
    };

    /**
    * Conjugation
    *
    * @return {Quaternion} the conjugated quaternion
    */
    Quaternion.prototype.conj = function() {
        return new Quaternion(
              this.data[0],
            - this.data[1],
            - this.data[2],
            - this.data[3]
        );
    };

    /**
    * Normal function
    *
    * @return {Number} the norm of the Quaternion
    */
    Quaternion.prototype.norm = function() {
        return Math.sqrt(
            this.data[0]*this.data[0] +
            this.data[1]*this.data[1] +
            this.data[2]*this.data[2] +
            this.data[3]*this.data[3]
        );
    };

    /**
    * Negative function
    *
    * @return {Quaternion} negated quaternion
    */
    Quaternion.prototype.neg = function() {
        return new Quaternion(
            - this.data[0],
            - this.data[1],
            - this.data[2],
            - this.data[3]
        );
    };

    /**
    * Scale function (multiplication by a real number)
    *
    * @param num {Number} real number
    * @return {Quaternion} scaled quaternion
    */
    Quaternion.prototype.scale = function(num) {
        return new Quaternion(
            this.data[0]*num,
            this.data[1]*num,
            this.data[2]*num,
            this.data[3]*num
        );
    };

    /**
    * Distance between Quaternions
    *
    * @param that {Quaternion}
    * @return {Number} distance
    */
    Quaternion.prototype.dist = function(that) {
        return this.sub(that).norm();
    };

    /**
    * Inverse function (reciprocal)
    *
    * @return {Quaternion} inverse
    */
    Quaternion.prototype.inv = function() {
        var norm = this.norm();
        return this.conj().scale(1/(norm*norm));
    };

    /**
    * Unit (1 length quaternion)
    *
    * @return {Quaternion} unit quaternion
    */
    Quaternion.prototype.unit = function() {
        return this.scale(1/this.norm());
    };

    /**
    * Addition
    *
    * @param that {Quaternion}
    * @return {Quaternion} result
    */
    Quaternion.prototype.add = function(that) {
        return new Quaternion(
            this.data[0]+that.data[0],
            this.data[1]+that.data[1],
            this.data[2]+that.data[2],
            this.data[3]+that.data[3]
        );
    };

    /**
    * Substraction
    *
    * @param that {Quaternion}
    * @return {Quaternion} result
    */
    Quaternion.prototype.sub = function(that) {
        return new Quaternion(
            this.data[0]-that.data[0],
            this.data[1]-that.data[1],
            this.data[2]-that.data[2],
            this.data[3]-that.data[3]
        );
    };

    /**
    * Multiplication (Hamilton product)
    *
    * @param that {Quaternion}
    * @return {Quaternion} result
    */
    Quaternion.prototype.mult = function(that) {
        return new Quaternion(
            // a1*a2 - b1*b2 - c1*c2 - d1*d2
            this.data[0]*that.data[0]-this.data[1]*that.data[1]-this.data[2]*that.data[2]-this.data[3]*that.data[3],
            // (a1*b2 + b1*a2 + c1*d2 - d1*c2)i
            this.data[0]*that.data[1]+this.data[1]*that.data[0]+this.data[2]*that.data[3]-this.data[3]*that.data[2],
            // (a1*c2 - b1*d2 + c1*a2 + d1*b2)j
            this.data[0]*that.data[2]-this.data[1]*that.data[3]+this.data[2]*that.data[0]+this.data[3]*that.data[1],
            // (a1*d2 + b1*c2 - c1*b2 + d1*a2)k
            this.data[0]*that.data[3]+this.data[1]*that.data[2]-this.data[2]*that.data[1]+this.data[3]*that.data[0]
        );
    };

    /**
    * Division
    *
    * @param that {Quaternion}
    * @return {Quaternion} result
    */
    Quaternion.prototype.div = function(that) {
        return this.mult(that.inv());
    };
    
    /**
    * Exponential
    *
    * @return {Quaternion} result
    */
    Quaternion.prototype.exp = function() {
        var v = this.imag();
        var vlen = v.norm();
        
        return v.scale( Math.sin(vlen) / vlen).add(new Quaternion(Math.cos(vlen))).scale( Math.pow(Math.E, this.data[0]) );
        
    };
    
    /**
    * Logarithm
    *
    * @return {Quaternion} result
    */
    Quaternion.prototype.log = function() {
        
        var v = this.imag();
        var vlen = v.norm();
        
        return (new Quaternion(Math.log(this.norm()))).add( v.scale(1/vlen).scale( Math.acos(this.data[0] / this.norm()) ) );
        
    };
    
    /**
    * Rotation
    *
    * @param rad {Number} angle in radians
    * @return {Quaternion} result
    */
    Quaternion.prototype.rot = function(rad) {
        
        var res = this.clone();
        
        res.theta = (res.theta + rad) % PI_2;
        
        return res;
        
    };
    
    /**
    * Power
    *
    * @param a {Number} exponent
    * @return {Quaternion} result
    */
    Quaternion.prototype.pow = function(a) {
        
        return this.n.scale(a*this.theta).exp().scale(Math.pow(this.norm(),a));
        
    };
    
    /**
    * Square
    *
    * @return {Quaternion} result
    */
    Quaternion.prototype.square = function() {
        return this.mult(this);
    }
    
    /**
    * Cube
    *
    * @return {Quaternion} result
    */
    Quaternion.prototype.cube = function() {
        return this.mult(this).mult(this);
    }
    
    /**
    * Square root
    *
    * @return {Quaternion} result
    */
    Quaternion.prototype.sqrt = function() {
        
        return this.pow(0.5);
        
    };
    
    /**
    * Cube root
    *
    * @return {Quaternion} result
    */
    Quaternion.prototype.cbrt = function() {
        
        return this.pow(1/3);
        
    };
    
    /**
    * Minimal value
    *
    * @return {Number} result
    */
    Quaternion.prototype.min = function() {
        
        return Math.min.apply(null, this.data);
        
    };
    
    /**
    * Maximum value
    *
    * @return {Number} result
    */
    Quaternion.prototype.max = function() {
        
        return Math.max.apply(null, this.data);
        
    };
    
    if('module' in base) {
        base.module.exports.Quaternion = Quaternion;
    } else {
        base.Quaternion = Quaternion;
    }
    
})(this);