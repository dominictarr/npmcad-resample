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

function segment (a, b, step, start, reduce, acc) {
  if(!reduce) reduce = append
  if(!acc) acc = []

  step = new csg.Vector3D(step)
  a = new csg.Vector3D(a)
  b = new csg.Vector3D(b)

  start = new csg.Vector3D(start || a)
  var p = start
  var _p = start

  var line = csg.Line3D.fromPoints(a, b)

  while(_p.plus(step).minus(b).dot(step) <= 0) {
    _p = line.intersectWithPlane(
      new csg.Plane.fromNormalAndPoint(step, p)
    )
    acc = reduce(acc, _p)
    p = p.plus(step)
  }
  segment.point = p
  return acc
}

//stepping along a vector
function steps (points, step) {
  var output = []
  var start = points[0]
  return pairs(points, function (output, a, b) {
    segment(a, b, step, start, null, output)
    start = segment.point
    return output
  }, [])
}

function totalLength (points) {
  return pairs(points, function (length, a, b) {
    return length + new csg.Vector3D(a).distanceTo(new csg.Vector3D(b))
  }, 0)
}

//stepping along the line, with fixed size
function along (points, size) {
  var output = [], leftover = 0

  return pairs(points, function (output, a, b) {
    //get direction and
    var vec = new csg.Vector3D(b).minus(new csg.Vector3D(a))
    var dir = vec.unit()
    segment(a, b, dir.times(size), new csg.Vector3D(a).plus(dir.times(leftover)), append, output)
    leftover = segment.point.distanceTo(new csg.Vector3D(b))
    return output
  }, [])
}

module.exports = steps
module.exports.segment = segment
module.exports.along = along
module.exports.totalLength = totalLength



