var test = require('tape')

var resample = require('../')

function toAry(point) {
  return Array.isArray(point) ? point : [point.x,point.y,point.z]
}

var points = [
  {x: 0, y: 0, z: 0},
  {x: 6, y: 12, z: 0},
  {x: 10, y: 6, z: 0}
]

test ('linear', function (t) {
  t.deepEqual(
    resample.steps([points[0], points[1]], {x:2, y:0, z: 0}).map(toAry),
    [
      [0, 0, 0],
      [2, 4, 0],
      [4, 8, 0],
      [6, 12, 0]
    ]
  )

  t.end()
})

test ('linear2', function (t) {
  t.deepEqual(
    resample.steps(points, {x:2, y:0, z: 0}).map(toAry),
    [
      [0, 0, 0],
      [2, 4, 0],
      [4, 8, 0],
      [6, 12, 0],
      [8, 9, 0],
      [10, 6, 0]
    ]
  )

  t.end()
})

test('length', function (t) {
  console.log(resample.totalLength(points))
  t.end()
})

test('along', function (t) {
  var tl = resample.totalLength(points)
  var step = tl/40
  var resampled = resample.along(points, step)
  console.log('resampled', resampled.map(toAry))
  var l = resample.totalLength(resampled)
  console.log(tl, resample.totalLength(resampled))
  t.ok(l < tl*1.01)
  t.ok(l > tl*0.99)

  t.end()
})

test('steps, with some way shorter links', function (t) {

var points = [
  {x: 0, y: 0, z: 0},
  {x: 6, y: 12, z: 0},
  {x: 6.2, y: 12, z: 0},
  {x: 6.4, y: 12, z: 0},
  {x: 6.6, y: 12, z: 0},
  {x: 6.8, y: 12, z: 0},
  {x: 7, y: 12, z: 0},
  {x: 10, y: 6, z: 0}
]

  t.deepEqual(
    resample.steps(points, {x:2, y:0, z: 0}).map(toAry),
    [
      [0, 0, 0],
      [2, 4, 0],
      [4, 8, 0],
      [6, 12, 0],
      [8, 10, 0],
      [10, 6, 0]
    ]
  )
  t.end()

})


test('steps, with some way shorter links', function (t) {

  var points = [
    {x: 0, y: 0, z: 0},
    {x: 1, y: 2, z: 0},
    {x: 4, y: 0, z: 0},
  ]

  t.deepEqual(
    resample.steps(points, {x:2, y:0, z: 0}).map(toAry),
    [ [ 0, 0, 0 ], [ 2, 1.3333333333333333, 0 ], [ 4, 0, 0 ] ]
  )
  t.end()

})









