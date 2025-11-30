"use client";
import { useState } from "react";
import { API_URL } from "../api";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"

export default function ProfilePage() {
    return (
        <div>
            <h1 className = {styles.title}>User Profile</h1>
            <div>
                <p1>Name: </p1>
            </div>
            <div>
                <p1>Username: </p1>
            </div>
            <div>
                <p1>Email: </p1>
            </div>
            

            <div className = {styles.buttonContainer}>
                <button className = {styles.back}>Back</button>
                <div>
                    <button className = {styles.edit}>Edit Profile</button>
                    <button className = {styles.password}>Change Password</button>
                </div>
            </div>
            

        </div>
    );
}