"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import Markdown from "react-markdown";

type HelpPageField = {
  prompt: string;
};

const rest_api_endpoint = process.env.NEXT_PUBLIC_GAME_HELP_API_ENDPOINT || "";

type Message = {
  content: string;
  isUser: boolean;
};

const HelpPage = () => {
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const useFormReturn = useForm<HelpPageField>();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(7);
    setSessionId(sessionId);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    if (useFormReturn.formState.isSubmitSuccessful) {
      useFormReturn.reset();
    }
  }, [useFormReturn.formState.isSubmitSuccessful, useFormReturn.reset]);

  const handleSubmit = useFormReturn.handleSubmit(async (data) => {
    setMessage((old) => [...old, { content: data.prompt, isUser: true }]);
    const payload = {
      session_id: sessionId,
      input_text: data.prompt,
    };
    setIsLoading(true);
    const response = await fetch("/api/help", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    setIsLoading(false);
    const json = await response.json();
    setMessage((old) => [...old, { content: json.body, isUser: false }]);
  });

  return (
    <>
      <h1 className="text-4xl">支援</h1>
      <Divider className="mb-4 mt-2" />
      <Card>
        <CardBody className="h-fit">
          <ScrollShadow
            ref={ref}
            size={100}
            hideScrollBar
            className=" w-full h-[300px] scroll-smooth"
          >
            {message.map((m, index) => (
              <ChatMessage key={index} content={m.content} isUser={m.isUser} />
            ))}
          </ScrollShadow>
        </CardBody>
        <CardFooter>
          <FormProvider {...useFormReturn}>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <PromptInput />
              <PromptBtn />
            </form>
          </FormProvider>
        </CardFooter>
      </Card>
    </>
  );
};

const PromptInput = () => {
  const { register } = useFormContext<HelpPageField>();
  return (
    <Input size="sm" className="w-full" label="問題" {...register("prompt")} />
  );
};

const PromptBtn = () => {
  const { formState } = useFormContext<HelpPageField>();
  const { isDirty, isSubmitting } = formState;
  return (
    <Button type="submit" size="lg" disabled={isSubmitting}>
      送出
    </Button>
  );
};

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  const initials = isUser ? "You" : "AI";
  // Use green for user, blue for AI
  const bgColor = isUser ? "bg-green-700" : "bg-blue-500";

  return (
    <div className="my-4">
      {isUser ? (
        <div className="flex items-start space-x-2">
          <div className="w-10 h-10"></div>
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm flex-grow">
            <div className="text-gray-600">
              <Markdown>{content}</Markdown>
            </div>
          </div>
          <div
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${bgColor} rounded-full text-white`}
          >
            {initials}
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-2">
          <div
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${bgColor} rounded-full text-white`}
          >
            {initials}
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm flex-grow">
            <div className="text-gray-600">
              <Markdown>{content}</Markdown>
            </div>
          </div>
          <div className="w-10 h-10"></div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
