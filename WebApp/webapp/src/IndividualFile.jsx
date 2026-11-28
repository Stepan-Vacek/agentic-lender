
import { MyFooter, MyHeader } from "./Reusables";
import { getDTI, getRisk } from "./functions"

export default function IndividualFile(window, setWindow, shock, setShock, staticWindow) {

    const debt_length = window.debts.length
    const income_length = window.incomes.length
    const bigger = (debt_length > income_length) ? debt_length : income_length

    const debts = window.debts.map(item => {
        if (item.debt_value % 1 != 0) {
            return (<td key={item.debt_name}> {item.debt_name}: &euro;{item.debt_value.toFixed(2).toLocaleString()}</td>)
        }
        else {
            return (<td key={item.debt_name}> {item.debt_name}: &euro;{item.debt_value.toLocaleString()}</td>)
        }
    })

    const incomes = window.incomes.map(item => {
        if (item.income_value % 1 != 0) {
            return (<td key={item.income_name}> {item.income_name}: &euro;{item.income_value.toFixed(2).toLocaleString()}</td>)
        }
        else {
            return (<td key={item.income_name}> {item.income_name}: &euro;{item.income_value.toLocaleString()}</td>)
        }
    })

    const dti = getDTI(window);

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

    // Stress Testing related

    function openNav() {
        document.getElementById("stress_sidebar").style.width = "250px";
        document.getElementById("content").style.marginLeft = "250px";

    }

    function closeNav() {
        document.getElementById("stress_sidebar").style.width = "0";
        document.getElementById("content").style.marginLeft = "0";
    }

    const CURRENT_AVG_INTEREST_RATE = 3.5;

    function onResetShock(e) {
        e.preventDefault();
        setShock(0);
        document.getElementById("shock").value = null;
        setWindow(staticWindow);
    }

    function onApplyShock(e) {
        e.preventDefault();
        var windowCopy = structuredClone(staticWindow);
        windowCopy.debts.map(debt => (
            debt.debt_value = (debt.debt_value / CURRENT_AVG_INTEREST_RATE) * (CURRENT_AVG_INTEREST_RATE + (shock * 0.001))
        ))
        setWindow(windowCopy);
    }

    function handleShockChange(e) {
        if (e.target.value < 0) {
            setShock(0)
        }
        else {
            setShock(e.target.value)
        }
    }


    return (
        <div id="content">
            <MyHeader />
            <div id="stress_sidebar" style={{ width: '0%' }} >
                <button type="button" class="closebtn" onClick={closeNav}>&times;</button>
                <br></br>
                <h3 style={{ fontWeight: 'bold' }}>Stress Testing Console</h3>
                <div>
                    <label for="shock">Interest rate shock (ppi)</label> <br></br>
                    <input type="number" placeholder="100" id="shock" name="shock" min="0" max="500" step="10" onChange={handleShockChange}></input>
                    <br></br>
                    <button onClick={(e) => onResetShock(e)}>Reset</button>
                    <button onClick={(e) => onApplyShock(e)}>Apply</button>
                </div>
            </div>
            <section id="center">
                <button onClick={() => setWindow(null)}>Back</button>
                <h2 style={{ fontWeight: 'bold' }}>Loan Application Details</h2>
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
                    <small>Risk Level: {getRisk(dti)}</small>
                </div>
                <button class="button" class="openbtn" style={{ width: '250px' }} onClick={openNav}>Open Stress Testing Console</button>
            </section>
            <MyFooter />
        </div>
    )
}