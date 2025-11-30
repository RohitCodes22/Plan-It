import { API_URL } from "../api";
import styles from "./profile.module.css"

export default async function ProfilePage() {
    const data = await fetch(`${API_URL}/get_user_info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // VERY IMPORTANT for Flask session cookies
    }       
    )
    const dataForProfile = data.json()
    return (
        <div>
            <h1 className = {styles.title}>User Profile</h1>
            <div>
                <p1>Name: {dataForProfile.fname} {dataForProfile.lname}</p1>
            </div>
            <div>
                <p1>Username: </p1>
            </div>
            <div>
                <p1>Email: {dataForProfile.email}</p1>
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