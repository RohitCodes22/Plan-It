"use client";
import { API_URL } from "../api";
import  TagWidget from "./tag_widget";
import CommentWidget from "./comment";
import CommentInput from "./comment_input";
import { useEffect, useState } from "react";

export default function EventWidget(args) {
    const [organizerData, setOrganizerData] = useState(null);
    const [commentData, setCommentData] = useState(null);
    
    const onCommentCreate = (commentData) => {
        setCommentData(curValue => {
            return [...curValue, {
                username: commentData.username,
                contents: commentData.contents
            }];
            
        });
    }

    const getUserData = async () => {
        try {
            // get data from event table
            const response = await fetch(`${API_URL}/get_user_info/${args.data.organizer_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const organizer = await response.json();
            console.log(organizer)
            setOrganizerData(organizer);

        } catch (error) {
            console.error("Error fetching organizer data:", error);
        }
    };

    const getCommentData = async () => {
        try {
            // get data from event table
            const response = await fetch(`${API_URL}/get_comments/${args.data.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const comments = await response.json();

            for (let i = 0; i < comments.length; i++) {
                const userResponse = await fetch(`${API_URL}/get_user_info/${comments[i].user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const userJson = await userResponse.json();
                
                comments[i].username = userJson.username;
            }

            setCommentData(comments);


        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    function tagStringToList(itemsStr) {
        return (itemsStr.slice(1, itemsStr.length - 1).replaceAll('"', '')).split(',');
    }

    function TagList(items) {
        const colorList = ["blue", "green", "red", "orange", "purple", "yellow"];
        return (
            <ol className="flex flex-row gap-2 ml-2 mt-2"> 
                {items.map((item, index) => {
                    return <TagWidget key={index} text={item} color={colorList[index % colorList.length]}/> 
                })}
            </ol>
        );
    }

    function Comments() {
        if (!commentData)
            return;

        return (<>
            {commentData.map((item, index) => {
                return <CommentWidget
                        username={item.username}
                        text={item.contents}
                        key={index}
                    />
            })}
        </>);
    }

    useEffect(() => {
        getUserData();
        getCommentData();
    }, []);


    return (
        <div className="w-full flex flex-col gap-6">
        
        <header className="text-left">
            <h1 className="text-3xl font-bold">{args.data.name}</h1>
        </header>

        <div className="flex flex-col gap-3">
            <div className="rounded-2xl pl-3 pt-1 pb-1 pr-3 border border-grey-100 w-fit">
                {
                    organizerData ? organizerData.username : "Loading User..."            
                }
            </div>
            <div>
                <h3 className="text-bold text-xl">Tags</h3>
                {TagList(tagStringToList(args.data.tags))}

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
                    <CommentInput callback={onCommentCreate} eventId={args.data.id}/>
                    {
                        commentData ? Comments() : "Loading Comments"
                    }
                </div>
            </div>
        </div>

        </div>
    );
}
