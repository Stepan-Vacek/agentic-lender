import { useEffect, useState, useRef } from "react";
import './App.css'
import bcrypt from "bcryptjs";

function App() {
    const [user, setUser] = useState([])
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [logged, setLogged] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [nameErr, setNameErr] = useState("");
    const [passErr, setPassErr] = useState("");

    const firstUpdate = useRef(true);
    useEffect(() => {
        if (!firstUpdate) {
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

    console.log("logged: " + logged)

    if (!logged) {
        return LogIn(setName, setPass, name, pass, setSubmit, nameErr, setNameErr, passErr, setPassErr)
    }
    else {
        return Landing(user, setLogged)
    }
}

function Landing(user, setlogged) {

    console.log("user: " + user.id)
    function handleLogOff(setlogged) {
        setlogged(false)
    }

    return (
        <div>
            <section id="center">
                <h1>Good Afternoon, {user.title} {user.lname}!</h1>
                <ul>
                    <li key="title">user title: {user.title}</li>
                    <li key="fname">user first name: {user.fname}</li>
                    <li key="lname">user last name: {user.lname}</li>
                    <li key="company">user company: {user.company}</li>
                    <li key="email">user e-mail: {user.email}</li>
                    <li key="type">user type: {user.type}</li>
                    <li key="id">user login: {user.id}</li>
                </ul>
                <div>
                    <button onClick={() => handleLogOff(setlogged)}>
                        [Log Off]
                    </button>
                </div>
                
            </section>
            <MyFooter />
        </div>
    )
}
function LogIn(setName, setPass, name, pass, setSubmit, nameErr, setNameErr, passErr, setPassErr) {
    function handleSubmit() {
        if (nameErr == "" && passErr == "") {
            setSubmit(true);
        }
        else {
            alert("Please input a name and a password!")
        }
    }

    function handleNameChange(e) {
        setName(e.target.value)
    }

    function handlePassChange(e) {
        setPass(e.target.value)
    }

    function handleNameBlur(e) {
        if (e.target.value == null || e.target.value == "") {
            setNameErr("Please enter a name!")
        }
        else {
            setNameErr("")
        }
    }
    function handlePassBlur(e) {
        if (e.target.value == null || e.target.value == "") {
            setPassErr("Please enter a password!")
        }
        else {
            setPassErr("")
        }
    }


    return (
        <div id="content">
            <section id="center">
                <div>
                    <h2 id="logheader"><b>Please Log In</b></h2>
                    <form action={handleSubmit}>
                        <label htmlFor="username">Username: </label>
                        <input tabindex="1" name="username" value={name} onChange={handleNameChange} onBlur={handleNameBlur} type="username"  /> <br></br>
                        <div className="login_err">{nameErr}</div>
                        <label htmlFor="password">Password: </label>
                        <input tabindex="2" name="password" value={pass} onChange={handlePassChange} onBlur={handlePassBlur} type="password"  /> <br></br>
                        <div className="login_err">{passErr}</div>
                        <button tabindex="3" type="submit">Log In</button>
                    </form>
                </div>
            </section>
            <MyFooter />
        </div>
    )
}

function MyFooter() {

    return (
        <footer>
            <small>Munster Technological University.</small>
            <br></br>
            <small>Please note this application is not in any way,
                shape or form a real system for actual financial data.
                Do not enter any genuine private information.</small>
        </footer>
    )
}

export default App
