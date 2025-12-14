import React from "react";
import { useRouter } from "next/navigation";

const UserTag = ({ displayname, user_id, css="" }) => {
  const router = useRouter();

  const handleClickUser = () => {
    router.push(`/profile/${user_id}`);
  };
  return (
    <div onClick={handleClickUser} className={`${css} cursor-pointer`}>
      {displayname}
    </div>
  );
};

export default UserTag;
