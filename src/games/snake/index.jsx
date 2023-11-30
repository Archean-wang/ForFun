import { useState, useEffect } from "react";
import './snake.css';
import { useMemo } from "react";
import { divide } from "../../utils/math";

export default function Snake({row=40, col=40, cellSize=12}) {
    const [pause, setPause] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [food, setFood] = useState(undefined);
    const [direction, setDirection] = useState(0);
    const [path, setPath] = useState([row/2*col+col/2+1, row/2*col+col/2]);
    const [end, setEnd] = useState(false);

    const area = useMemo(() => Array(row*col).fill(1).map((_, index) => index), [row ,col]);

    function handlePause() {
        if(end) {
            handleReset();
            setPause(!pause);
            feed();
        } else {
            setPause(!pause);
            if(food === undefined)
                feed();
        }
    }

    function handleSpeed(event) {
        setSpeed(event.target.value);
    }

    function move() {
        const head = path[0];
        const [_row, _col] = divide(head, col);
        const nextPath = path.slice();
        switch(direction) {
            case 0:
                if(_col === col-1) {
                    setEnd(true);
                    setPause(true);
                }
                nextPath.unshift(head+1);
                break;
            case 1:
                if(_col === 0) {
                    setEnd(true);
                    setPause(true);
                }
                nextPath.unshift(head-1);
                break;
            case 2:
                if(_row === 0) {
                    setEnd(true);
                    setPause(true);
                }
                nextPath.unshift(head-col);
                break;
            case 3:
                if(_row === row-1) {
                    setEnd(true);
                    setPause(true);
                }
                nextPath.unshift(head+col);
                break;
            default:
                throw Error('Invalid direction!');
        }
        if(nextPath[0] === food) {
            feed();
        } else {
            nextPath.pop();
            if (nextPath.slice(1, 500).indexOf(nextPath[0]) !== -1) {
                setEnd(true);
            }
        }
        setPath(nextPath);
    }

    function feed() {
        const total = new Set(area);
        path.forEach(v => total.delete(v));
        const index = Math.floor(Math.random() * total.size);
        setFood([...total][index]);
    }

    useEffect(() => {
        let timer;
        if(pause) {
            if(timer)
                clearInterval(timer);
        } else {
            timer = setInterval(move, speed*125);
        }
        return () => {
            if(timer) {
                clearInterval(timer);
            } 
        }
    }, [pause, speed, move]);

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
            move();
        }
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
        }
    }, [pause, move])

    useEffect(() => {
        const food = document.querySelector('.food')
        if(food)
            food.style.animationPlayState = pause ? 'paused' : 'running';
    }, [pause])

    const getClass = function(index) {
        if(index === food) {
            return 'food'
        }
        if(path[0] === index) {
            return 'snakeHead';
        }
        if(path.indexOf(index) === -1) {
            return ''
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
            <h1>GreedySnake</h1>
            <div className="control">
                <button onClick={handlePause}>{pause ? 'Start' : 'Pause'}</button>
                <span className="speed">
                    <label>Speed</label>
                    <select onChange={handleSpeed}>
                        <option value={3}>x1</option>
                        <option value={2}>x2</option>
                        <option value={1}>x3</option>
                    </select>
                </span>
            </div>
            <div className="snakeBackgound" style={{gridTemplateRows: `repeat(${row}, ${cellSize}px)`, gridTemplateColumns: `repeat(${col},  ${cellSize}px)`}}>
            {
                area.map((_, index) => {
                    return <div key={index} className={`${getClass(index)} snakeBlock`}></div>
                })
            }
            {end && <div className="end"/>}
            </div>
        </div>
    )
}