var Quaternion = require('./Quaternion.js').Quaternion;

var EPSILON = (!Number.EPSILON)? 0.0000001 : Number.EPSILON*8;

var test = function(name, value) {
    
    if(value !== true) {
        console.log('Test '+name+' failed');
        process.exit(1);
    } else {
        console.log('Test '+name+' passed');
    }
    
};

var testEquals = function(name, value, shouldBe) {
    
    if(Math.abs(value-shouldBe) > EPSILON) {
        console.log('Test '+name+' failed! Should be: '+shouldBe + ', was: '+value);
        process.exit(1);
    } else {
        console.log('Test '+name+' passed');
    }
    
};

var q0 = new Quaternion();
var q1 = Quaternion.random();
var q2 = Quaternion.random();
var l = Math.random()*2.0-1.0;
var lp = Math.random();

test('Addition', q1.add(q2).equals(q2.add(q1)));
test('Substraction', q0.sub(q1).equals(q1.neg()));
test('Conjugation', q1.conj().conj().equals(q1));
testEquals('Unit', q1.unit().norm(), 1.0);
testEquals('Norm and Multiplication', q1.mult(q2).norm(), q1.norm()*q2.norm());
test('Inverse', q1.inv().equals(q1.conj().scale(1/Math.pow(q1.norm(), 2))));
testEquals('Distance', q1.dist(q2), q1.sub(q2).norm());
testEquals('Inverse and Division', q1.div(q2), q1.mult(q2.inv()));
testEquals('Scale', q1.scale(l).norm(), Math.abs(q1.norm()*l));
test('Exp', (new Quaternion(l)).exp().equals( new Quaternion( Math.exp(l) ) ) );
test('Log', (new Quaternion(lp)).log().equals( new Quaternion( Math.log(lp) ) ) );
test('Exp / Log', q1.exp().log().equals(q1) );
//test('Exp / Addition', q1.add(q2).exp().equals( q1.exp().mult(q2.exp()) ) );

var q3 = q1.clone();q3.theta = q3.theta;
test('Theta', q3.equals(q1));

var q4 = q1.clone();q4.n = q4.n;
test('N hat', q4.equals(q1));

test('Pow', q1.pow(2.0).equals(q1.mult(q1)) );

test('Exp, Unit and Polar',  q1.unit().equals( q1.n.scale(q1.theta).exp() ) );

test('Square', q1.pow(2.0).equals(q1.square()) );
test('Cube', q1.pow(3.0).equals(q1.cube()) );
test('Square root', q1.pow(1.0/2.0).equals(q1.sqrt()) );
test('Cube root', q1.pow(1.0/3.0).equals(q1.cbrt()) );