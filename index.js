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
  if(!(_between(x.x,a.x,b.x) && _between(x.y,a.y,b.y) && _between(x.z,a.z,b.z))) {
    console.log([x, a, b].map(toAry).map(function (e) {
      return e.join(',')
    }))
  return false
  }
  return true
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
module.exports.along = along
module.exports.totalLength = totalLength

