import Card from '../components/Cards/Card';
import CardBody from '../components/Cards/CardBody';

function CardDemo() {
  
  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <Card>
      <CardBody title="Card title" 
      text="Some quick example text to build on the card title and make up the bulk of the card’s content." 
      onClick={handleClick}
      />
    </Card>
  )
}

export default CardDemo
