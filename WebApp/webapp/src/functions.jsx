/**
 * Gets the debt-to-income ratio, formatted to two decimal places, given the individual file (complex object).
 * @param {any} window The object representing the loan file, as retrieved from the database
 * @returns DTI, debt-to-income ratio
 */
export function getDTI(window) {
    var debts_total = 0;
    var incomes_total = 0;

    window.debts.map(item => {
        debts_total += parseInt(item.debt_value);
    })

    window.incomes.map(item => {
        incomes_total += parseInt(item.income_value);
    })

    return ((debts_total / incomes_total) * 100).toFixed(2).toString();
}

/**
 * Gets the risk level of a loan file.
 * @param {any} dti The debt-to-income ratio
 * @returns The risk level (string)
 */
export function getRisk(dti) {
    if (dti < 25.0) {
        return "Very Low";
    }
    else if (dti < 35.0) {
        return "Low";
    }
    else if (dti < 40.0) {
        return "Medium-Low";
    }
    else if (dti < 45.0) {
        return "Medium";
    }
    else if (dti < 50.0) {
        return "High";
    }
    else if (dti < 55.0) {
        return "Very High";
    }
    else {
        return "Extreme";
    }
}

