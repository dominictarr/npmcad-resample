// run with electro example.js
// npm install electro -g

var csg = require('@jscad/csg').CSG

function toAry(point) {
  return Array.isArray(point) ? point : [point.x, point.y,point.z]
}

function append (acc, item) {
  acc.push(item); return acc
}

function pairs (points, iter, acc) {
  for(var i = 1; i < points.length; i++)
    acc = iter(acc, points[i-1], points[i])
  return acc
}

function _between(x, a, b) {
  return x <= Math.max(a, b) && x >= Math.min(a, b)
}

function between (x, a, b) {
  return _between(x.x,a.x,b.x) && _between(x.y,a.y,b.y) && _between(x.z,a.z,b.z)
}

//stepping along a vector
function steps (points, step) {
  var output = []
  step = new csg.Vector3D(step)
  points = points.map(function (e) {
    return new csg.Vector3D(e)
  })
  var start = points[0], x

  var i = 1
  do {
    var plane = new csg.Plane.fromNormalAndPoint(step, start)
    x = null
    while(!x && i < points.length) {
      var a = points[i-1], b=points[i]
      var line = csg.Line3D.fromPoints(a, b)
      var p = line.intersectWithPlane(plane)
      if(between(p, a, b)) output.push(x = p)
      else i++
    }
    start = start.plus(step)
  } while (x && i < points.length)

  return output
}

function totalLength (points) {
  return pairs(points, function (length, a, b) {
    return length + new csg.Vector3D(a).distanceTo(new csg.Vector3D(b))
  }, 0)
}

//stepping along the line, with fixed size
function along (points, size) {
  points = points.map(function (e) {
    return new csg.Vector3D(e)
  })
  var output = [points[0]]
  var start = points[0], i = 1, dir, left = size

  while(i < points.length) {
    var l = start.distanceTo(points[i])
    if(l < left) {
      start = points[i]
      i++
      left -= l
    } else if(l > left) {
      output.push(start = start.plus(points[i].minus(start).unit().times(l)))
      left = size
    }
  }
  return output
}

exports.steps = steps
exports.along = along
exports.totalLength = totalLength

