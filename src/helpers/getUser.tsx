import { useEffect, useState } from "react";
import { User } from "../Types";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

function useGetUser() {

    const [user, setuser] = useState({} as User);
    const db=getFirestore();


    useEffect(()=>{
        var uid=localStorage.getItem('uid');
        onSnapshot(doc(db, "users", uid), (doc) => {
            if (doc.exists()) {
                setuser({ id:doc.id,...doc.data() } as User);
            }
        });
    },[])

    return {user};

}

export default useGetUser;