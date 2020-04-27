export default {
  "nodes": [
    {
      "id": 0,
      "name": "a",
      "value": 1,
      "el": "div",
      "position": [100, 100],
    },
    {
      "id": 1,
      "name": "b",
      "value": 1,
      "el": "div",
      "position": [100, 200],
    },
    {
      "id": 2,
      "name": "add",
      "args": ["x", "y"],
      "body": "console.log(x + y)",
      "el": "div",
      "position": [200, 150],
    },
  ],
  "edges": {
    "0": [2],
    "1": [2],
    "2": [],
  },
};
