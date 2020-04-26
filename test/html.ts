export default {
  "nodes": [
    {
      "x": 1,
      "id": 0,
      "el": '<div>constant</div>',
      "position": [100, 100]
    },
    {
      "y": 2,
      "id": 1,
      "el": '<div>constant</div>',
      "position": [100, 200]
    },
    {
      "el": '<div>function</div>',
      "id": 2,
      "function": "function(x, y) { console.log(x + y) }",
      "position": [200, 150]
    }
  ],
  "edges": {
    "0":[2],
    "1":[2],
    "2":[]
  }
}