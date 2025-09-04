
interface CardBodyProps {
    title: string;
    text?: string;
    onClick?: () => void;
}

function CardBody(props: CardBodyProps) {
    const { title, text, onClick } = props;
    return (
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{text}</p>
            <a href="#" className="btn btn-primary" onClick={onClick}>Go somewhere</a>
        </div>

    );
}

export default CardBody;
