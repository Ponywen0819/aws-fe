"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import {
  FormProvider,
  UseFormProps,
  useForm,
  useFormContext,
} from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";

type ListPageField = {
  prompt: string;
};

const useFormProps: UseFormProps<ListPageField> = {
  defaultValues: {
    prompt: "",
  },
};

const ListPage = () => {
  const [sessionId, setSessionId] = useState("");
  const [showState, setShowState] = useState([true, true]);
  const useFormReturn = useForm<ListPageField>(useFormProps);

  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(7);
    setSessionId(sessionId);
  }, []);

  const handleSubmit = useFormReturn.handleSubmit(async (data) => {
    const payload = {
      session_id: sessionId,
      input_text: data.prompt,
    };
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json())["body"] as string;

    const includeMoneyGod = result.toLowerCase().includes("money god");
    const includeDragon = result.toLowerCase().includes("power dragon");
    setShowState([includeMoneyGod, includeDragon]);
  });

  return (
    <>
      <h1 className="text-4xl">遊戲列表</h1>
      <Divider className="mb-4 mt-2" />
      <FormProvider {...useFormReturn}>
        <form onSubmit={handleSubmit}>
          <SearchBar />
        </form>
      </FormProvider>
      <div className="flex gap-2 py-4 flex-wrap">
        {showState[0] && (
          <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
        )}
        {showState[1] && (
          <GameCard name="龍門天下" tags={["吃角子老虎", "中國龍"]} />
        )}
      </div>
    </>
  );
};

const SearchBar = () => {
  const { register } = useFormContext<ListPageField>();
  const registerReturn = register("prompt", {});
  return (
    <Input
      placeholder="搜尋..."
      endContent={<SearchBarSubmitBtn />}
      {...registerReturn}
    />
  );
};

const SearchBarSubmitBtn = () => {
  return (
    <Button type={"submit"} isIconOnly aria-label="search" variant="light">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="size-4" />
    </Button>
  );
};

const SearchResult = () => {
  return (
    <div className="flex gap-2 py-4 flex-wrap">
      <GameCard name="龍門天下" tags={["吃角子老虎", "中國龍"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
      <GameCard name="財神報喜" tags={["吃角子老虎", "財神"]} />
    </div>
  );
};

type GameCardProps = {
  name: string;
  tags: string[];
};

const GameCard = (props: GameCardProps) => {
  const { name, tags } = props;
  return (
    <Card>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{name}</h4>
        {/* <div className="flex flex-wrap gap-2 pt-1">
          <GameTags tags={tags} />
        </div> */}
      </CardHeader>
      <CardBody>
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://nextui.org/images/hero-card-complete.jpeg"
          height={270}
          width={270}
        />
      </CardBody>
    </Card>
  );
};

const GameTags = (props: { tags: string[] }) => {
  const { tags } = props;
  return tags.map((e, i) => (
    <Chip size="sm" key={i}>
      {e}
    </Chip>
  ));
};

export default ListPage;
