"use client";
import { API_URL } from "../api";
import TagWidget from "./tag_widget";
import CommentWidget from "./comment";
import CommentInput from "./comment_input";
import { useEffect, useState } from "react";

export default function EventWidget({ data }) {
  const [organizerData, setOrganizerData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [isAttending, setIsAttending] = useState(false);

  const onCommentCreate = (comment) => {
    setCommentData((curValue) => [
      ...curValue,
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

  const getUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/get_user_info/${data.organizer_id}`);
      const organizer = await response.json();
      setOrganizerData(organizer);
    } catch (error) {
      console.error("Error fetching organizer data:", error);
    }
  };

  const getCommentData = async () => {
    try {
      const response = await fetch(`${API_URL}/get_comments/${data.id}`);
      const comments = await response.json();

      for (let i = 0; i < comments.length; i++) {
        const userResponse = await fetch(`${API_URL}/get_user_info/${comments[i].user_id}`);
        const userJson = await userResponse.json();
        comments[i].username = userJson.username;
      }
      setCommentData(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  function tagStringToList(itemsStr) {
    if (!itemsStr) return [];
    return itemsStr.slice(1, itemsStr.length - 1).replaceAll('"', "").split(",");
  }

  function TagList(items) {
    const colors = ["blue", "green", "red", "orange", "purple", "yellow"];
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, index) => (
          <TagWidget
            key={index}
            text={item.trim()}
            color={colors[index % colors.length]}
          />
        ))}
      </div>
    );
  }

  function Comments() {
    if (!commentData.length) return <p className="text-gray-500">No comments yet.</p>;
    return commentData.map((item, index) => (
      <CommentWidget username={item.username} text={item.contents} key={index} />
    ));
  }

  useEffect(() => {
    getUserData();
    getCommentData();
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-200">
      <header>
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="mt-2 text-gray-600">
          Organized by:{" "}
          <span className="font-semibold">
            {organizerData ? organizerData.username : "Loading..."}
          </span>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mt-2">Tags</h2>
        {TagList(tagStringToList(data.tags))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Description</h2>
        <p className="mt-2 text-gray-700">{data.description}</p>
      </section>

      <button
        onClick={onAttend}
        className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold ${
          isAttending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
        }`}
      >
        {isAttending ? "Attending" : "Attend!"}
      </button>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <CommentInput callback={onCommentCreate} eventId={data.id} />
        <div className="mt-4 flex flex-col gap-3">{Comments()}</div>
      </section>
    </div>
  );
}
