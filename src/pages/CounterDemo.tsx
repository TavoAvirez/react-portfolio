import { useState } from "react";

function CounterDemo() {
  
    const [count, setCount] = useState(0)

    return (
    <div style={{ padding: 16 }}>
      <h2>Counter Demo</h2>
      <p>Valor: {count}</p>
        <button className="btn btn-success" onClick={() => setCount( c => Math.max(0, c - 1))}>Decrementar</button>
        <button className="btn btn-primary" onClick={() => setCount( c => c + 1)}>Incrementar</button>
        <button className="btn btn-secondary" onClick={() => setCount(0)} style={{ marginLeft: 8 }} >Resetar</button>
    </div>
  )
}

export default CounterDemo;