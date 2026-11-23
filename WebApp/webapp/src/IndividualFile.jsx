
import { MyFooter, MyHeader } from "./Reusables";

export default function IndividualFile(window, setWindow) {

    const debt_length = window.debts.length
    const income_length = window.incomes.length
    const bigger = (debt_length > income_length) ? debt_length : income_length
    var debts_total = 0;
    var incomes_total = 0;

    const debts = window.debts.map(item => {
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
    }

    function closeNav() {
        if (document.getElementById("stress_sidebar") != null) {
            document.getElementById("stress_sidebar").style.width = "0";
        }
        if (document.getElementById("content") != null) {
            document.getElementById("content").style.marginLeft = "0";
        }
    }


    return (
        <div id="content">
            <MyHeader />
            <div id="stress_sidebar" style={{ width: '0%' }} >
                <button type="button" class="closebtn" onClick={closeNav}>&times;</button>
                <br></br>
                <h3>Stress Testing Console</h3>
                <form>
                    <label for="shock">Interest rate shock (ppi)</label> <br></br>
                    <input type="number" placeholder="100" name="shock" min="100" max="300"></input>
                    <button onClick={() => alert("Not yet implemented!")}>Apply</button>
                </form>
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