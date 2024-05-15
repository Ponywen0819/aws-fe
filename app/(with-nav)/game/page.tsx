"use client";

import {
  IconDefinition,
  faFire,
  faLeaf,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Card, CardBody } from "@nextui-org/card";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

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
    <div className="flex justify-between my-4">
      <IntroCard>
        <IntroIcon icon={faFire} />
        <IntroTitle>這是火元素</IntroTitle>
      </IntroCard>
      <IntroCard>
        <IntroIcon icon={faWater} />
        <IntroTitle>這是水元素</IntroTitle>
      </IntroCard>
      <IntroCard>
        <IntroIcon icon={faLeaf} />
        <IntroTitle>這是草元素</IntroTitle>
      </IntroCard>
      <IntroCard>
        <IntroIcon icon={faWind} />
        <IntroTitle>這是草元素</IntroTitle>
      </IntroCard>
    </div>
  );
};

const IntroCard = (props: PropsWithChildren<object>) => {
  const className = "w-64 flex flex-col items-center justify-center gap-2";
  return <div className={className} {...props} />;
};

const IntroIcon = (props: Pick<FontAwesomeIconProps, "icon">) => {
  const { icon } = props;
  const className = "size-24";
  return <FontAwesomeIcon icon={icon} className={className} />;
};

function IntroTitle(props: PropsWithChildren<object>) {
  const className = "font-bold";
  return <p className={className} {...props} />;
}

const Game = () => {
  return (
    <Card className="h-96">
      <CardBody className="flex-row justify-center items-center gap-4">
        <Slot />
        <Slot />
        <Slot />
        <Slot />
      </CardBody>
    </Card>
  );
};

const ElementSet = [faFire, faLeaf, faWater, faWind] as const;
const ElementSetLength = ElementSet.length;

type SlotProps = {};

const Slot = (props: SlotProps) => {
  const [isRolling, setRolling] = useState(false);
  const [elements, setElements] = useState<IconDefinition[]>([]);

  useEffect(() => {
    const initialElements = getElementList(3);
    setElements(initialElements);
  }, []);

  const triggerRolling = () => {
    const newElements = getElementList(37);
    setElements((old) => [...old, ...newElements]);
    setRolling(true);
  };

  const StopRolling = () => {
    const displayedElement = elements.slice(37);
    setElements(displayedElement);
    setRolling(false);
  };

  useEffect(() => {
    if (!isRolling) return;
    const timeoutReturn = setTimeout(StopRolling, 1200);
    return () => clearTimeout(timeoutReturn);
  }, [isRolling]);

  const className = `relative overflow-y-hidden h-[216px] w-[72px]`;
  return (
    <div className={className} onClick={triggerRolling}>
      <SlotContainer elements={elements} isRolling={isRolling} />
    </div>
  );
};

type SoltContainerProps = {
  elements: IconDefinition[];
  isRolling: boolean;
};

const SlotContainer = (props: SoltContainerProps) => {
  const { elements, isRolling } = props;
  const defaultClassName = "absolute flex flex-col ease-in-out ";

  const className =
    defaultClassName +
    (isRolling ? `duration-1000 transition-[top] top-[-2664px]` : "top-0");
  return (
    <div className={className}>
      {elements.map((e, i) => (
        <div key={i} className="p-[6px] size-[72px]">
          <FontAwesomeIcon icon={e} className="w-full h-full" />
        </div>
      ))}
    </div>
  );
};

const getElementList = (len: number) => {
  let elementList: IconDefinition[] = [];
  for (let i = 0; i < len; i++) {
    const newElement = getRandomElement();
    elementList.push(newElement);
  }
  return elementList;
};

const getRandomElement = () => {
  const selectedIndex = Math.floor(Math.random() * ElementSetLength);
  const newElement = ElementSet[selectedIndex];
  return newElement;
};

export default GamePage;
