# Quaternion.js

Quaternion class for javascript.

## Installing

NPM:
```
npm install quaternion.js --save
```

Bower:
```
bower install quaternion --save
```

Or just simply download the `Quaternion.js` file, and include it in your html.

## Usage

If you are using node.js, put this code to the beginning of your script:

```javascript
var Quaternion = require('quaternion.js').Quaternion;
```

### Create a new Quaternion instance:

```javascript
// a = b = c = d = 0
var q1 = new Quaternion();
// given a,b,c,d values   
var q2 = new Quaternion(1,2,3,4); 
// random values between -1 and 1
var q3 = Quaternion.random();
```

### Properties

You can get/set the values of the quaternion with the following properties:

- **a**: the *a* value of the quaternion
- **b**: the *b* value of the quaternion
- **c**: the *c* value of the quaternion
- **d**: the *d* value of the quaternion
- **v**: the imaginary part. Returns a quaternion with the same values, but with zero real part
- **theta**: theta value of the the polar decomposition
- **n**: ň value of the the polar decomposition

### Functions

The Quaternion instances can be only modified using it's public properties.
Every function call will return a new Quaternion instance with the result.
It makes possible to create function calls like this:

```javascript
var q3 = q1.square().add(q2);
```

List of the available functions:

- **equals**: Compares two quaternions. If they have the same values, returns true.
- **clone**: Returns a new Quaternion instance with the same values as the parameter's.
- **real**: Returns a new quaternion instance with the same values as the parameter's, but with zero imaginary part.
- **imag**: Returns a new quaternion instance with the same values as the parameter's, but with zero real part.
- **comp**: Returns a new quaternion instance with the same values as the parameter's, but with zero *c* and *d* values.
- **conj**: Conjugate
- **norm**: Normal
- **neg**: Negation
- **scale**: Multiply *a,b,c,d* with a given real number.
- **dist**: Distance between two quaternions.
- **inv**: Inverse
- **unit**: Generate a 1 length quaternion, from the parameter
- **add**: Addition
- **sub**: Subtraction
- **mult**: Multiplication
- **div**: Division
- **exp**: Exponental function
- **log**: Logarithm
- **rot**: Rotate theta
- **pow**: Power
- **square**: Square
- **cube**: Cube
- **sqrt**: Square root
- **cbrt**: Cube root
- **min**: Minimal value from *a,b,c,d*
- **max**: Maximum value from *a,b,c,d*
