import { type ReactNode } from "react";


interface CardProps {
  children: ReactNode;
}

function Card(props: CardProps) {
  const { children: Children } = props;
  return (
    <div className="card" style={{ width: '18rem', margin: '1rem', padding: '1rem' }}>
      <div className="card-body">
        {Children}
      </div>
    </div>
  );
}

export default Card;