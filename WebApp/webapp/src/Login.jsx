import { MyFooter } from "./Reusables"

export default function LogIn(setName, setPass, name, pass, setSubmit, nameErr, setNameErr, passErr, setPassErr) {
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
                        <input tabindex="1" name="username" value={name} onChange={handleNameChange} onBlur={handleNameBlur} type="username" /> <br></br>
                        <div className="login_err">{nameErr}</div>
                        <label htmlFor="password">Password: </label>
                        <input tabindex="2" name="password" value={pass} onChange={handlePassChange} onBlur={handlePassBlur} type="password" /> <br></br>
                        <div className="login_err">{passErr}</div>
                        <button tabindex="3" type="submit">Log In</button>
                    </form>
                </div>
            </section>
            <MyFooter />
        </div>
    )
}
