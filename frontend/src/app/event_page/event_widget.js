"use client";
import { useRouter } from "next/navigation";
import  TagWidget from "./tag_widget";
import CommentWidget from "./comment";
import CommentInput from "./comment_input";

export default function EventWidget(args) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-6">
      
      <header className="text-left">
        <h1 className="text-3xl font-bold">{args.data.name}</h1>
      </header>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl pl-3 pt-1 pb-1 pr-3 border-1 border-grey-100 w-fit"> Rohit Sayeeganesh</div>
        <div>
            <h3 className="text-bold text-xl">Tags</h3>
            <ol className="flex flex-row gap-2 ml-2 mt-2"> 
                <TagWidget text="fun" color="blue"/> 
                <TagWidget text="study" color="green"/> 
            </ol>

            <h3 className="text-bold text-xl mt-4 font-semibold">Description</h3>
            <hr/>
            <div className="ml-2">
                <p>{args.data.description},</p>
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-semibold"> Comments </h2>
            <hr/>
            <div className="mt-3">
                <CommentInput/>
                <CommentWidget
                  username="SpiderHit"
                  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
                />
            </div>
        </div>
      </div>

    </div>
  );
}
