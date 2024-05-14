import {
  faFire,
  faLeaf,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody } from "@nextui-org/card";

const GamePage = () => {
  return (
    <div className="flex flex-col gap-2">
      <AIRPG />
      <Intro />
      <Game />
    </div>
  );
};

const AIRPG = () => {
  return (
    <Card>
      <CardBody className="h-96">
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
    </Card>
  );
};

const Intro = () => {
  return (
    <div className="flex ">
      <FontAwesomeIcon icon={faFire} className="size-24" />
      <FontAwesomeIcon icon={faWater} className="size-24" />
      <FontAwesomeIcon icon={faLeaf} className="size-24" />
      <FontAwesomeIcon icon={faWind} className="size-24" />
    </div>
  );
};

const Game = () => {
  return (
    <Card className="h-96">
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
    </Card>
  );
};

export default GamePage;
