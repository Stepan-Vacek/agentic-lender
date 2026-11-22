import { MyFooter, MyHeader } from "./Reusables";
import IndividualFile from "./IndividualFile";

export default function Landing(user, setlogged, files, setFiles, window, setWindow, lock, setLock) {

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
;