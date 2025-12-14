"use client";
import { API_URL } from "../api";
import TagWidget from "./tag_widget";
import CommentWidget from "./comment";
import CommentInput from "./comment_input";
import { useEffect, useState } from "react";
import UserTag from "../components/userTag/UserTag";
import Image from "next/image";

export default function EventWidget({ data }) {
  const [organizerData, setOrganizerData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  console.log(data);
  const onCommentCreate = (comment) => {
    setCommentData((cur) => [
      ...cur,
      { username: comment.username, contents: comment.contents },
    ]);
  };

  const onAttend = async () => {
    if (isAttending) return;
    const post = await fetch(`${API_URL}/attend_event/${data.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (post.status === 401) alert("Sign in before attending events!");
    else setIsAttending(true);
  };

  useEffect(() => {
    (async () => {
      const userRes = await fetch(
        `${API_URL}/get_user_info/${data.organizer_id}`
      );
      setOrganizerData(await userRes.json());

      const commentRes = await fetch(`${API_URL}/get_comments/${data.id}`);
      const comments = await commentRes.json();

      for (let c of comments) {
        const u = await fetch(`${API_URL}/get_user_info/${c.user_id}`);
        c.username = (await u.json()).username;
      }
      setCommentData(comments);
    })();
  }, []);

  const tags =
    data.tags
      ?.slice(1, data.tags.length - 1)
      .replaceAll('"', "")
      .split(",") ?? [];

  return (
    <article className="w-full">
      {/* HERO */}
      <section className="relative h-[420px]">
        <Image
          src={`${API_URL}/event/picture/${data.id}`}
          alt={data.name}
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-0 w-full px-12 pb-10 text-white">
          <h1 className="text-5xl font-bold mb-2">{data.name}</h1>
          <p className="text-lg opacity-90">
            Organized by{" "}
            <UserTag
              displayname={
                organizerData ? organizerData.username : "Loading..."
              }
              user_id={organizerData?.id ?? -1}
              css="text-white font-semibold underline underline-offset-4"
            />
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
        {/* MAIN COLUMN */}
        <div>
          <h2 className="text-3xl font-semibold mb-6">About</h2>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-16">
            {data.description}
          </p>

          {/* COMMENTS */}
          <div className="border-t pt-10">
            <h2 className="text-3xl font-semibold mb-6">Discussion</h2>

            <div className="mb-8">
              <CommentInput callback={onCommentCreate} eventId={data.id} />
            </div>

            <div className="space-y-8">
              {commentData.length ? (
                commentData.map((c, i) => (
                  <CommentWidget
                    key={i}
                    username={c.username}
                    text={c.contents}
                    id={c.user_id}
                  />
                ))
              ) : (
                <p className="italic text-gray-500">
                  No comments yet — start the conversation.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="sticky top-24 h-fit space-y-10">
          <div className=" flex gap-2 text-2xl">
            <aside className="font-bold">
              {new Date(data.e_date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </aside>
          </div>
          {/* ATTEND */}
          <button
            onClick={onAttend}
            disabled={isAttending}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
              isAttending
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {isAttending ? "✓ Attending" : "Attend Event"}
          </button>

          {/* TAGS */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <TagWidget key={i} text={t.trim()} />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </article>
  );
}
