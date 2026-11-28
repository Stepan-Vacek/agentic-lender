import { useEffect, useState, useRef } from "react";
import './App.css'
import bcrypt from "bcryptjs";
import LogIn from "./Login";
import Landing from "./Landing";

export default function App() {
    // user details (db)
    const [user, setUser] = useState([]);
    // username
    const [name, setName] = useState("");
    // user password (hashed)
    const [pass, setPass] = useState("");
    // logged status
    const [logged, setLogged] = useState(false);
    // login submission status
    const [submit, setSubmit] = useState(false);
    // login form name error variable
    const [nameErr, setNameErr] = useState("");
    // login form password error variable
    const [passErr, setPassErr] = useState("");
    // list of all files (db)
    const [files, setFiles] = useState([]);
    // current file
    const [window, setWindow] = useState(null);
    // current file (immutable)
    const [staticWindow, setStaticWindow] = useState(null);
    // lock for single load
    const [lock, setLock] = useState(false);
    // shock (stress test console)
    const [shock, setShock] = useState(null);

    useEffect(() => {
        try {
            fetch("/mortgage_records", { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    setFiles(data)
                });
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };


    const firstUpdate = useRef(true);
    useEffect(() => {
        if (!firstUpdate) {
            const userCookie = getCookie("user");
            setSubmit(false);
            if (userCookie) {
                alert("Hi!")
            }
            firstUpdate.current = false;
            return;
        }
        try {
            fetch("/web_users/" + name, { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    if (Object.keys(data).includes("hash")) {
                        if (bcrypt.compareSync(pass, data.hash)) {
                            setUser({
                                "fname": data.fname,
                                "lname": data.lname,
                                "email": data.email,
                                "company": data.company,
                                "id": data.id,
                                "title": data.title,
                                "type": data.type
                            })
                            const date = new Date();
                            date.setTime(date.getTime() + 8 * 60 * 60 * 1000);
                            let expires = "; expires=" + date.toUTCString();
                            document.cookie = "user=" + name + expires + "; path=/";
                            document.cookie = "pass=" + pass + expires + "; path=/";
                            setLogged(true)
                        }
                        else {
                            alert("Name and password do not match.")
                        }
                    }
                    else {
                        alert("Name and password do not match.")
                    }
                    setSubmit(false)
                });
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }, [submit]);

    if (!logged) {
        return LogIn(setName, setPass, name, pass, setSubmit, nameErr, setNameErr, passErr, setPassErr);
    }
    else {
        return Landing(user, setLogged, files, setFiles, window, setWindow, lock, setLock, shock, setShock, staticWindow, setStaticWindow);
    }
}