import style from "./index.module.css";

export default function Color() {
  const colorSet = ["#eee", "#666", "#333", "#ddd", "#aaa", "#757575"];
  return (
    <div className={style.container}>
      <h1>常用颜色</h1>
      <div className={style.colorContainer}>
        {colorSet.map(color => <ColorBox key={color} color={color} />)}
      </div>
    </div>
  );
}

function ColorBox({ color }) {
  return (
    <div className={style.colorWrapper}>
      <span className={style.colorName} style={{ color: color }}>
        {color}
      </span>
      <div className={style.colorBlock} style={{ background: color }}>
      </div>
    </div>
  )
}