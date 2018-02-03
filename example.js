

var Cardinal = require('cardinal-spline-js')

function smooth (points) {
  var p = Cardinal.getCurvePoints(points.reduce(function (a, b) {
      return a.concat(b)
    }), 0.5, 3)

  var o = []
  for(var i = 0; i < p.length; i+=2)
    o.push([p[i],p[i+1]])

  return o
}

var curve = smooth([
  [0, 0],
  [5, 10],
  [10, 5],
  [20, 2],
  [25, 7]
])

//var curve = [
//  [0,0],
//  [2, 3],
//  [2.5, 4],
//  [3.5, 5],
//  [5, 6],
//
//  [7,4],
//  [9, 2],
//  [11, 2]
//]



var canvas = document.createElement('canvas')

document.body.appendChild(canvas)

canvas.height = 300
canvas.width = 600

var ctx = canvas.getContext('2d')
CTX = ctx
var Z = 20

ctx.strokeStyle = 'gray'

function drawCurve (curve, iter) {
  ctx.beginPath()
  curve = curve.map(toAry)
  ctx.moveTo(curve[0][0]*Z, canvas.height-curve[0][1]*Z)
  for(var i = 0; i < curve.length; i++)
    iter(curve[i][0]*Z, canvas.height-curve[i][1]*Z, i)
  ctx.stroke()
}

drawCurve(curve, function (x, y, i) {
  if(i) ctx.lineTo(x,y)
  else ctx.moveTo(x,y)
//  ctx.fillStyle = 'red'
//  ctx.fillRect(x-2, y-2, 4, 4)
})

var resample = require('./')

function toAry(point) {
  return Array.isArray(point) ? point : [point.x, point.y,point.z]
}

//console.log(resample(curve, {x:1, y:0, z:0}).map(toAry).map(function (e) { return e.join(',') }))

ctx.save()

ctx.strokeStyle = 'blue'
var sampled = resample(curve, {x:2, y:0, z:0}).map(toAry)

drawCurve(sampled, function iter (x,y) {
  ctx.strokeStyle = 'blue'
  ctx.moveTo(~~x, canvas.height)
  ctx.lineTo(~~x, y)
})

//ctx.stroke()

