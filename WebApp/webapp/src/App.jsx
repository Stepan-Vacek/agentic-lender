import { useEffect, useState, useRef } from "react";
import './App.css'
import bcrypt from "bcryptjs";

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

function Landing(user, setlogged, files, setFiles, window, setWindow, lock, setLock) {

    function handleLogOff(setlogged) {
        setlogged(false);
    }

    if (user.type === "broker" && lock === false) {
        setFiles(files.filter(file => file.assigned_broker === user.id))
        setLock(true)
    }
        
    const list = files.map(file =>
        <div class="pipeline_file" onClick={() => setWindow(file)}>
            <h2>{file.name} [{file.id}]</h2>
            <h3 style={{ color: 'red', fontWeight: 'bold' }} >{file.status}</h3>
            <p class="dti">DTI: {file.debt_to_income}%</p>
            <p class="risk" style={{ color: file.risk_level === "Very Low" ? 'green' : 'red' }}>Risk: {file.risk_level}</p>
            <small>{file.date_filed}</small>
        </div>
    )
    if (window === null) {
        return (
            <div>
                <MyHeader />
                <section id="center">
                    <h1>Good Afternoon, {user.title} {user.lname}!</h1>
                    <h2>You have {files.length} file{files.length != 1 ? "s" : ""}.</h2>
                    <div id="pipeline">
                        {list}
                    </div>
                    <div>
                        <button onClick={() => handleLogOff(setlogged)}>
                            [Log Off]
                        </button>
                    </div>

                </section>
                <MyFooter />
            </div>
        )
    } else {
        return IndividualFile(window, setWindow);
    }
    
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

function IndividualFile(window, setWindow) {

    const debt_length = window.debts.length
    const income_length = window.incomes.length
    const bigger = (debt_length > income_length) ? debt_length : income_length
    var debts_total = 0;
    var incomes_total = 0;

    const debts = window.debts.map(item =>
    {
        debts_total += parseInt(item.debt_value);
        return (<td key={item.debt_name}> {item.debt_name}: &euro;{item.debt_value.toLocaleString()}</td>)
    })

    const incomes = window.incomes.map(item => {
        incomes_total += parseInt(item.income_value);
        return (<td key={item.income_name}> {item.income_name}: &euro;{item.income_value.toLocaleString()}</td>)
    })

    const dti = ((debts_total / incomes_total) * 100).toFixed(2).toString();

    var dynamicCols = []
    for (var i = 0; i < bigger; i++) {
        if (debt_length > bigger) {
            dynamicCols.push(
                <tr>
                    <td key={i}></td>
                    {incomes[i]}
                </tr>
            )
        }
        else if (income_length > bigger) {
            dynamicCols.push(
                <tr>
                    {debts[i]}
                    <td key={i}></td>
                </tr>
            )
        }
        else {
            dynamicCols.push(
                <tr>
                    {debts[i]}
                    {incomes[i]}
                </tr>
            )
        }
    }

    function openNav() {
        if (document.getElementById("stress_sidebar") != null) {
            document.getElementById("stress_sidebar").style.width = "250px";
        }
        if (document.getElementById("content") != null) {
            document.getElementById("content").style.marginLeft = "250px";
        }
        console.log('open button press');
    }

    function closeNav() {
        if (document.getElementById("stress_sidebar") != null) {
            document.getElementById("stress_sidebar").style.width = "0";
        }
        if (document.getElementById("content") != null) {
            document.getElementById("content").style.marginLeft = "0";
        }
        console.log('close button press');
    } 


    return (
        <div id="content">
            <MyHeader />
            <div id="stress_sidebar" style={{ width: '0%'}} >
                <button type="button" class="closebtn" onClick={closeNav}>&times;</button>
                <br></br>
                <h3>Stress Testing Console</h3>
                <p>Dummy text, replace later</p>
            </div>
            <section id="center">
                <button onClick={() => setWindow(null)}>Back</button>
                <h1>Loan Application Details</h1>
                <div id="big_file">
                    <h2>CASE ID: {window.id}</h2>
                    <h2>Name on File: {window.name}</h2>
                    <h2>Asking Price: &euro;{window.asking_price.toLocaleString()}</h2>
                    <h2>AI Vaulated Price: &euro;{window.ai_valuated_price.toLocaleString()}</h2>
                    <br></br>
                    <table align="center" id="breakdown_table">
                        <tbody>
                        <tr>
                            <th>Debts</th>
                            <th>Incomes</th>
                        </tr>
                        {dynamicCols}
                        <tr>
                            <td colSpan="2" id="table_dti">DTI: {dti}%</td>
                        </tr>
                        </tbody>
                    </table>
                    <small>Risk Level: {window.risk_level}</small>
                </div>
                <button class="button" class="openbtn" style={{ width: '250px' }} onClick={openNav}>Open Stress Testing Console</button>
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

function MyHeader() {

    return (
        <header id="my_header">
            <h1>* AGENTIC LENDER</h1>
        </header>
    )
}

