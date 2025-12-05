import React, { useRef, useState } from "react";

export default function CommentInput() {
    const textareaRef = useRef(null);
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
                <button 
                    className={`rounded-md pt-2 pb-2 pl-4 pr-4 m-1 transition-all 
                        ${isInputEmpty() ? "bg-gray-300 text-gray-500 " : "bg-blue-500 text-white hover:scale-105"}`}
                    >
                    Comment
                </button>
            </div>
        </div>
    );

};