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
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";

type GameContextType = {};
const context = createContext<GameContextType | null>(null);

type GenRpgRequest = {
  user_input: string;
  session_id: string;
  clean_history: boolean;
};

enum IconEnum {
  fire,
  leaf,
  water,
  wind,
}

const rest_api_endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "";

const GamePage = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [session_id, setSessionId] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("en");
  const [elements, setElements] = useState<IconEnum[][]>([]);
  const [story, setStory] = useState<string[]>([]);
  const [remain, setRemain] = useState(-1);

  const triggerRolling = async () => {
    setRemain((old) => {
      if (old < 60) return 0;
      return old - 60;
    });

    setRolling(true);
    for (let i = 0; i < elements.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setElements((old) => {
        const elementList = getElementList(37);
        const newElements = [
          ...old.slice(0, i),
          [...old[i], ...elementList],
          ...old.slice(i + 1),
        ];

        return newElements;
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    StopRolling();
  };

  const StopRolling = async () => {
    for (let i = 0; i < elements.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setElements((old) => {
        const newElements = [
          ...old.slice(0, i),
          [...old[i].slice(37)],
          ...old.slice(i + 1),
        ];
        return newElements;
      });
    }
    setIsLoading(true);
    setRolling(false);
  };

  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(7);
    setSessionId(sessionId);
    let initialElements: IconEnum[][] = [];
    for (let i = 0; i < 5; i++) {
      const elementList = getElementList(3);
      initialElements.push(elementList);
    }
    setElements(initialElements);
  }, []);

  const handleActionTaken = async (element_list: IconEnum[][]) => {
    const scores = getScoreObject(element_list);
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    setRemain((old) => old + totalScore);

    const payload = getGenRpgRequest(
      scores,
      session_id,
      remain + totalScore,
      countryCode,
      story.length > 0
    );
    const res = await fetch(rest_api_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    setIsLoading(false);
    if (!res.ok) {
      setIsError(true);
      return;
    }
    const data = await res.json();
    console.log(data);
    setStory((old) => [...old, ...data.response.slice(8, -8).split("\\n")]);
  };

  useEffect(() => {
    if (elements.length === 0) return;
    if (elements.some((e) => e.length !== 3)) return;
    if (remain < 0) return;
    handleActionTaken(elements);
  }, [elements]);

  return (
    <context.Provider value={{}}>
      <div className="flex flex-col gap-2">
        <AIRPG story={story} isLoading={isLoading} />
        <Intro />
        <RemainIndicator remain={remain} />
        <Game
          remain={remain}
          isLoading={isLoading}
          rolling={rolling}
          element_list={elements}
          onRoll={triggerRolling}
        />
        <InitialModal
          isOpen={remain === -1}
          onRemainInput={(remain) => setRemain(remain)}
        />
        <EndingModal
          remain={remain}
          story={story}
          isLoading={isLoading}
          isRolling={rolling}
        />
      </div>
    </context.Provider>
  );
};

const getScoreObject = (elements: IconEnum[][]) => {
  const windScore = calcElementScore(elements, IconEnum.wind);
  const fireScore = calcElementScore(elements, IconEnum.fire);
  const waterScore = calcElementScore(elements, IconEnum.water);
  const leafScore = calcElementScore(elements, IconEnum.leaf);

  return {
    windScore,
    fireScore,
    waterScore,
    leafScore,
  };
};

const getGenRpgRequest = (
  elements: {
    windScore: number;
    fireScore: number;
    waterScore: number;
    leafScore: number;
  },
  session_id: string,
  remain: number,
  language: string,
  clean_history = false
) => {
  const { windScore, fireScore, waterScore, leafScore } = elements;

  const user_input = `Wind:${windScore}\nFire:${fireScore}\nWater:${waterScore}\nLeaf:${leafScore}\nRemain:${remain}\nLanguage:${language}`;
  return {
    user_input,
    session_id,
    clean_history,
  };
};

const calcElementScore = (elements: IconEnum[][], icon: IconEnum) => {
  const showInFirstRow = elements[0].some((e) => e === icon);
  if (!showInFirstRow) return 0;
  const index = elements.findIndex((e) => e.every((e) => e !== icon));
  const countInRow = index !== -1 ? elements.slice(0, index) : elements;
  const countLength = countInRow.length;
  if (countLength < 3) return 0;
  const basicScore = getBasicScore(countLength);
  const ratioList = countInRow.map((e) => getRatio(e, icon)) as number[];
  const ratio = ratioList.reduce((a, b) => a * b, 1);

  return basicScore * ratio;
};

const getBasicScore = (count: number) => {
  const increase = count - 2;
  return 10 + increase * 5;
};

const getRatio = (elements: IconEnum[], icon: IconEnum) => {
  let maxCount = 0;
  let currentCount = 0;

  for (let i = 0; i < elements.length; i++) {
    if (elements[i] === icon) {
      currentCount++;
      if (currentCount > maxCount) {
        maxCount = currentCount;
      }
    } else {
      currentCount = 0;
    }
  }

  if (maxCount < 2) return 1;
  if (maxCount === 2) return 3;
  if (maxCount === 3) return 5;
  return 8;
};

const InitialModal = (props: {
  isOpen: boolean;
  onRemainInput: (remain: number) => void;
}) => {
  const { isOpen, onRemainInput } = props;
  const [number, setNumber] = useState(0);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRemainInput(number);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={() => {}}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              請輸入初始點數
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <Input
                  type="number"
                  value={`${number}`}
                  label="點數"
                  className="mb-2"
                  onChange={(e) => setNumber(parseInt(e.target.value))}
                />
                <div>
                  <Button type="submit">提交</Button>
                </div>
              </form>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const EndingModal = (props: {
  remain: number;
  story: string[];
  isLoading: boolean;
  isRolling: boolean;
}) => {
  const { remain, story, isLoading, isRolling } = props;
  const isOpen = remain < 60 && remain !== -1 && !isLoading && !isRolling;
  return (
    <Modal isOpen={isOpen} onOpenChange={() => {}}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">遊戲結束</ModalHeader>
            <ModalBody>
              <p>{story[story.length - 1]}</p>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const AIRPG = (props: { story: string[]; isLoading: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { story, isLoading } = props;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [story, isLoading]);

  return (
    <Card>
      <CardBody className="h-96 h-fit">
        <ScrollShadow
          ref={ref}
          size={100}
          hideScrollBar
          className=" w-full h-[300px] scroll-smooth"
        >
          {story.map((s, i) => (
            <>
              <p key={s} className="whitespace-pre-wrap mb-2">
                {s}
              </p>
              <Divider />
            </>
          ))}
          {isLoading && (
            <>
              <Skeleton className="h-3 mb-2 rounded-sm" />
              <Skeleton className="h-3 mb-2 rounded-sm" />
              <Skeleton className="h-3 mb-2 rounded-sm" />
            </>
          )}
        </ScrollShadow>
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
        <IntroTitle>這是風元素</IntroTitle>
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

const RemainIndicator = (props: { remain: number }) => {
  const { remain } = props;
  return (
    <div className="flex justify-center items-center">
      <p>剩餘點數: {remain}</p>
    </div>
  );
};

const Game = (props: {
  element_list: IconEnum[][];
  remain: number;
  rolling: boolean;
  isLoading: boolean;
  onRoll: () => void;
}) => {
  const { onRoll, element_list, rolling, isLoading } = props;
  return (
    <Card className="h-96">
      <CardBody className="flex-row justify-center items-center gap-4">
        {element_list.map((e, i) => (
          <Slot key={`slot ${i}`} elements={e} />
        ))}
      </CardBody>
      <CardFooter>
        <button
          disabled={rolling || isLoading || props.remain < 60}
          onClick={onRoll}
          className="w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          Roll
        </button>
      </CardFooter>
    </Card>
  );
};

const ElementSet = [faFire, faLeaf, faWater, faWind] as const;
const ElementSetLength = ElementSet.length;

type SlotProps = {
  elements: IconEnum[];
};

const Slot = (props: SlotProps) => {
  const { elements } = props;

  const className = `relative overflow-y-hidden h-[216px] w-[72px]`;
  return (
    <div className={className}>
      <SlotContainer elements={elements} />
    </div>
  );
};

type SlotContainerProps = {
  elements: IconEnum[];
};

const SlotContainer = (props: SlotContainerProps) => {
  const { elements } = props;
  const defaultClassName = "absolute flex flex-col ease-in-out ";

  const className =
    defaultClassName +
    (elements.length > 3
      ? `duration-1000 transition-[top] top-[-2664px]`
      : "top-0");

  return (
    <div className={className}>
      {elements.map((e, i) => {
        const icon =
          e === IconEnum.fire
            ? faFire
            : e === IconEnum.leaf
            ? faLeaf
            : e === IconEnum.water
            ? faWater
            : faWind;
        return (
          <div key={i} className="p-[6px] size-[72px]">
            <FontAwesomeIcon icon={icon} className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
};

const getElementList = (len: number) => {
  let elementList: IconEnum[] = [];
  for (let i = 0; i < len; i++) {
    const newElement = getRandomElement();
    elementList.push(newElement);
  }
  return elementList;
};

const getRandomElement = () => {
  const selectedIndex = Math.floor(Math.random() * ElementSetLength);

  return selectedIndex as IconEnum;
};

export default GamePage;
