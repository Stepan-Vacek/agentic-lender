from pathlib import Path
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# Create the Agent
affordability_agent = Agent(
    role="Mortgage Affordability Analyst",

    goal=(
        "Evaluate mortgage affordability by assessing disposable "
        "income, stress-tested repayments and regulatory borrowing limits."
    ),

    backstory=(
        "You are a careful mortgage affordability analyst specialising "
        "in residential mortgage assessments in Ireland. You examine "
        "financial information, identify affordability risks and explain "
        "your findings clearly. You distinguish regulatory limits from "
        "a lender's individual affordability assessment."
    ),
# Gimme da key
    llm="gemini/gemini-3.8-flash",
    verbose=True,
)

# Define the tasks
affordability_task = Task(
    description="""
    Assess the following proposed mortgage application.

    Gross annual household income: €{gross_income}
    Net monthly household income: €{net_monthly_income}
    Monthly living expenses: €{living_expenses}
    Existing monthly debt repayments: €{existing_debts}
    Proposed mortgage amount: €{mortgage_amount}
    Property value: €{property_value}
    Mortgage term in years: {mortgage_term}
    Current annual interest rate (%): {interest_rate}
    Stress-test interest rate (%): {stress_rate}
    Buyer type: {buyer_type}

    Your assessment must cover:

    1. Net disposable monthly surplus after expenses, existing debts
       and the proposed mortgage repayment.

    2. Mortgage repayments at the current interest rate and the
       stress-test interest rate.

    3. The loan-to-income ratio and applicable indicative Irish
       regulatory borrowing limit.

    4. The loan-to-value ratio and indicative deposit requirement.

    5. Key risks, missing information and an overall affordability
       assessment.

    Show the assumptions used. Do not invent missing figures.
    Clearly distinguish estimates from verified regulatory requirements.
    Do not claim that a lender has approved or rejected the application.
    """,

    expected_output=(
        "A structured mortgage affordability report containing "
        "disposable surplus, repayment estimates, stress-test results, "
        "borrowing-limit checks, risks and a conclusion."
    ),

    agent=affordability_agent,
)

# Assemble the Crew
affordability_crew = Crew(agents=[affordability_agent],
    tasks=[affordability_task],
    process=Process.sequential,
    verbose=True,
)
