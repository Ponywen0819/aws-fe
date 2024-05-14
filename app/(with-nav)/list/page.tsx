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

type ListPageField = {
  prompt: string;
};

const useFormProps: UseFormProps<ListPageField> = {
  defaultValues: {
    prompt: "",
  },
};

const ListPage = () => {
  const useFormReturn = useForm<ListPageField>(useFormProps);

  const handleSubmit = useFormReturn.handleSubmit(async (data) => {});

  return (
    <>
      <h1 className="text-4xl">遊戲列表</h1>
      <Divider className="mb-4 mt-2" />
      <FormProvider {...useFormReturn}>
        <form onSubmit={handleSubmit}>
          <SearchBar />
        </form>
      </FormProvider>
      <SearchResult />
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
        <div className="flex flex-wrap gap-2 pt-1">
          <GameTags tags={tags} />
        </div>
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
