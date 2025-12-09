import React, { useRef, useState } from "react";
import { API_URL } from "../api";

export default function CommentInput(args) {
    const textareaRef = useRef(null);
    const buttonRef = useRef(null);
    const [comment, setComment] = useState("");

    const isInputEmpty = () => {
        return comment.trim() === '';
    }

    const updateOnInput = () => {
        const textEl = textareaRef.current;
        if (!textEl) // ensure area exists
            return;

        setComment(textEl.value); // update comment state

        // grow or shrink component (trick I saw on GitHub)
        textEl.style.height = "auto";
        textEl.style.height = textEl.scrollHeight + 'px';
    }

    const buttonClick = async () => {
        const buttonEl = buttonRef.current;
        if (!buttonEl || isInputEmpty())
            return;


        // get current user ID
        const userResponse = await fetch(`${API_URL}/get_user_info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // handle case where user is not logged in
        if (userResponse.status == 401) {
            alert("You must be logged in to post comments!");
            return;
        }

        const commentData = {
            user_id: jsonRes.id,
            event_id: args.eventId,
            contents: comment            
        };
        
        // call the callback function to instantly update UI
        args.callback(commentData);

        // make the backend do its thing
        const post = await fetch(`${API_URL}/post_comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData)
        });

        if (!post.ok) {
            console.log("HTTP error!");
        }
        console.log("comment made!")

    }

    return (
        <div className="border-grey border rounded-xl mb-1.5 pl-2 pr-2">
            <textarea 
                placeholder="Share your thoughts!" 
                className="w-full rounded-xl outline-0 resize-none"
                ref={textareaRef}
                onInput={updateOnInput}
                >
            </textarea>
            <div className="w-full flex justify-end">
                <button onClick={buttonClick}
                    className={`rounded-md pt-2 pb-2 pl-4 pr-4 m-1 transition-all 
                        ${isInputEmpty() ? "bg-gray-300 text-gray-500 " : "bg-blue-500 text-white hover:scale-105"}`}
                    ref={buttonRef}
                    >
                    Comment
                </button>
            </div>
        </div>
    );

};