import { useState, useEffect, useReducer, useCallback } from "react";
import './snake.css';
import { useMemo } from "react";
import snakeReducer from "./reducer";

export default function Snake({ row = 40, col = 40, cellSize = 16 }) {
    const area = useMemo(() => Array(row * col).fill(1).map((_, index) => index), [row, col]);
    const [pause, setPause] = useState(true);
    const [speed, setSpeed] = useState(250);
    const [direction, setDirection] = useState(0);
    const [score, setScore] = useState(0);
    const [snake, dispatch] = useReducer(snakeReducer, {
        path: [],
        dead: false,
        food: -1,
        col: col,
        row: row
    });

    useEffect(() => {
        function feed() {
            const total = new Set(area);
            snake.path.forEach(v => total.delete(v));
            const index = Math.floor(Math.random() * total.size);
            return [...total][index];
        }
        if (snake.dead) {
            setPause(true);
        }
        if (snake.path.indexOf(snake.food) !== -1) {
            dispatch({ type: 'feed', data: feed() });
            setScore(score => score + 1);
        }
    }, [snake, area]);


    const handlePause = useCallback(function () {
        if (pause) {
            if (snake.dead || snake.food == -1) {
                dispatch({ type: 'reset' });
                setScore(0);
                setDirection(0);
            }
            setPause(false);
        } else {
            setPause(true);
        }
    }, [pause, snake]);

    useEffect(() => {
        const food = document.querySelector('.food');
        if (food)
            food.style.animationPlayState = pause ? 'paused' : 'running';
    }, [pause, snake.food]);

    useEffect(() => {
        let timer;
        if (pause) {
            if (timer)
                clearInterval(timer);
        } else {
            dispatch({ type: 'move', data: direction });
            timer = setInterval(() => {
                dispatch({ type: 'move', data: direction });
            }, speed);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [pause, speed, direction]);

    useEffect(() => {
        function handleKey(event) {
            switch (event.key) {
                case 'ArrowUp':
                    if (!pause)
                        setDirection(direction => direction === 3 ? 3 : 2);
                    break;
                case 'ArrowDown':
                    if (!pause)
                        setDirection(direction => direction === 2 ? 2 : 3);
                    break;
                case 'ArrowLeft':
                    if (!pause)
                        setDirection(direction => direction === 0 ? 0 : 1);
                    break;
                case 'ArrowRight':
                    if (!pause)
                        setDirection(direction => direction === 1 ? 1 : 0);
                    break;
                case 'PageUp':
                    setSpeed(speed => speed > 125 ? speed - 125 : speed);
                    break;
                case 'PageDown':
                    setSpeed(speed => speed < 500 ? speed + 125 : speed);
                    break;
                case ' ':
                    handlePause();
                    break;

            }
        }
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('keydown', handleKey);
        };
    }, [pause, handlePause]);

    const getClass = function (index) {
        if (index === snake.food) {
            return 'food';
        }
        if (snake.path[0] === index) {
            return 'snakeHead';
        }
        if (snake.path.indexOf(index) !== -1) {
            return 'snakeBody';
        }
        return '';
    };

    return (
        <div className='container'>
            <h1>GreedySnake</h1>
            <div className="control">
                <span className="speed">
                    {`Speed: x${5 - speed / 125}`}
                </span>
                <span className="speed">
                    {`Score: ${score}`}
                </span>
            </div>
            <div className="snakeBackgound" style={{ gridTemplateRows: `repeat(${row}, ${cellSize}px)`, gridTemplateColumns: `repeat(${col},  ${cellSize}px)` }}>
                {
                    area.map((_, index) => {
                        return <div key={index} className={`${getClass(index)} snakeBlock`}></div>;
                    })
                }
                {snake.dead && <div className="end" />}
            </div>
        </div>
    );
}