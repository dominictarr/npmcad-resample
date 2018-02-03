var Cardinal = require('cardinal-spline-js')

function smooth (points) {
  var p = Cardinal.getCurvePoints(points.reduce(function (a, b) {
      return a.concat(b)
    }), 0.5, 20)

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
})

var resample = require('./')

function toAry(point) {
  return Array.isArray(point) ? point : [point.x, point.y,point.z]
}

ctx.save()

ctx.strokeStyle = 'blue'
var sampled = resample.steps(curve, {x:2, y:0, z:0}).map(toAry)

drawCurve(sampled, function iter (x,y) {
  ctx.strokeStyle = 'blue'
  ctx.moveTo(~~x, canvas.height)
  ctx.lineTo(~~x, y)
})

var l = resample.totalLength(curve)

var sampled2 = resample.along(curve, l/20)

console.log(sampled2[sampled2.length-1], curve[curve.length-1], l/20)

ctx.strokeStyle = 'green'
drawCurve(sampled2.map(toAry), function iter (x,y, i) {
  if(i) ctx.lineTo(x, y)
  else ctx.moveTo(x, y)
})


var dataURL = canvas.toDataURL('image/png')
require('fs').writeFileSync(
  'example.png',
  new Buffer(dataURL.substring(dataURL.indexOf(',')), 'base64')
)
