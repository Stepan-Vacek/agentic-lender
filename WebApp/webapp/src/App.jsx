import { useEffect, useState, useRef } from "react";
import './App.css'
import bcrypt from "bcryptjs";
import LogIn from "./Login";
import Landing from "./Landing";

export default function App() {
    const [user, setUser] = useState([]);
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [logged, setLogged] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [nameErr, setNameErr] = useState("");
    const [passErr, setPassErr] = useState("");
    const [files, setFiles] = useState([]);
    const [window, setWindow] = useState(null);
    const [lock, setLock] = useState(false);

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

    const firstUpdate = useRef(true);
    useEffect(() => {
        if (!firstUpdate) {
            setSubmit(false);
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
        return Landing(user, setLogged, files, setFiles, window, setWindow, lock, setLock);
    }
}