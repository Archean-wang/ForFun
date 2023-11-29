import { useState, useEffect } from "react";
import './snake.css';

function divide(n, m) {
    const rem = n % m;
    return [(n-rem) / m, rem];
}

export default function Snake({row=20, col=20}) {
    const [pause, setPause] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [food, setFood] = useState(undefined);
    const [direction, setDirection] = useState(0);
    const [path, setPath] = useState([row/2+col/2+1, row/2+col/2]);
    const [end, setEnd] = useState(false);

    const handlePause = function () {
        setPause(!pause);
    }

    const handleSpeed = function(event) {
        setSpeed(event.target.value);
    }

    useEffect(() => {
        let timer;
        if(pause) {
            if(timer)
                clearInterval(timer);
        } else {
            setFood(food => food ? food : Math.floor(Math.random() * row * col));
            timer = setInterval(() => {
                setPath(path => {
                    let head = path[0];
                    const nextPath = path.slice();
                    const [_row, _col] = divide(head, col);
                    switch(direction) {
                        case 0:
                            if(_col === col-1) {
                                setEnd(true);
                            }
                            nextPath.unshift(head+1);
                            break;
                        case 1:
                            if(_col === 0) {
                                setEnd(true);
                            }
                            nextPath.unshift(head-1);
                            break;
                        case 2:
                            if(_row === 0) {
                                setEnd(true);
                            }
                            nextPath.unshift(head-col);
                            break;
                        case 3:
                            if(_row === row-1) {
                                setEnd(true);
                            }
                            nextPath.unshift(head+col);
                            break;
                        default:
                            throw Error('Invalid direction!');
                    }
                    if(nextPath[0] === food) {
                        setFood(Math.floor(Math.random() * row * col));
                    } else {
                        nextPath.pop();
                        if (nextPath.slice(1, 500).indexOf(nextPath[0]) !== -1) {
                            setEnd(true);
                        }
                    }
                    return nextPath;
                })
            }, speed*125);
        }
        return () => {
            if(timer) {
                clearInterval(timer);
            } 
        }
    }, [pause, speed, direction, food]);

    useEffect(() => {
        function handleKey(event) {
            if(pause) return;
            switch(event.key) {
                case 'ArrowUp':
                    setDirection(direction => direction === 3 ? 3 : 2);
                    break;
                case 'ArrowDown':
                    setDirection(direction => direction === 2 ? 2 : 3);
                    break;
                case 'ArrowLeft':
                    setDirection(direction => direction === 0 ? 0 : 1);
                    break;
                case 'ArrowRight':
                    setDirection(direction => direction === 1 ? 1 : 0);
                    break;
                default:
                    break;
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
        }
    }, [pause])

    useEffect(() => {
        if(end)
            setPause(true);
    }, [end]);

    const getClass = function(index) {
        if(index === food) {
            return 'food'
        }
        if(path.indexOf(index) === -1) {
            return ''
        }
        if(path[0] === index) {
            return 'snakeHead';
        }
        return 'snakeBody';
    }

    function handleReset() {
        setDirection(0);
        setPath([row/2+col/2+1, row/2+col/2]);
        setPause(true);
        setEnd(false);
        setSpeed(1);
        setFood(undefined);
    }

    return (
        <div className='container'>
            <div className="control">
                <button onClick={handlePause} disabled={end}>{pause ? 'Start' : 'Pause'}</button>
                <button onClick={handleReset}>Reset</button>
                <span className="speed">
                    <label>Speed</label>
                    <select onChange={handleSpeed}>
                        <option value={3}>x1</option>
                        <option value={2}>x2</option>
                        <option value={1}>x3</option>
                    </select>
                </span>
            </div>
            <div className="snakeBackgound" style={{gridTemplateRows: `repeat(${row}, 16px)`, gridTemplateColumns: `repeat(${col}, 16px)`}}>
            {
                Array(row*col).fill(1).map((_, index) => {
                    return <div key={index} className={`${getClass(index)} snakeBlock`}></div>
                })
            }
            {end && <div className="end"/>}
            </div>
        </div>
    )
}