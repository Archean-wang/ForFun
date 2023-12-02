import { mod } from "../../utils/math";

// pure 
export default function snakeReducer(snake, action) {
  let path = snake.path.slice();
  let dead = snake.dead;
  switch (action.type) {
    case 'move': {
      switch (action.data) {
        case 0:
          if (path[0] % snake.col === snake.col - 1) {
            dead = true;
          }
          path = [path[0] + 1, ...path];
          break;
        case 1:
          if (path[0] % snake.col === 0) {
            dead = true;
          }
          path = [path[0] - 1, ...path];
          break;
        case 2:
          if (mod(path[0], snake.col) === 0) {
            dead = true;
          }
          path = [path[0] - snake.col, ...path];
          break;
        case 3:
          if (mod(path[0], snake.col) === snake.row - 1) {
            dead = true;
          }
          path = [path[0] + snake.col, ...path];
          break;
      }
      if (path[0] !== snake.food) {
        path.pop();
      }
      if (snake.path.indexOf(path[0]) !== -1) {
        dead = true;
      }
      return { ...snake, path, dead };
    }
    case 'feed': {
      return { ...snake, food: action.data };
    }
    case 'reset': {
      return {
        ...snake,
        path: [mod(snake.row, 2) * snake.col + Math.ceil(snake.col / 2), mod(snake.row, 2) * snake.col + Math.ceil(snake.col / 2) - 1],
        dead: false,
        food: mod(snake.row, 2) * snake.col + Math.ceil(snake.col / 2)
      };
    }
  }
}