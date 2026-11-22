from pathlib import Path
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# Create the Agent
valuation_agent = Agent(
    role="Property Valuation Analyst",

    goal=(
        "Compare property asking prices against supervised model "
        "valuations, identify overvalued properties and calculate "
        "Loan-To-Value ratios."
    ),

    backstory=(
        "You are an experienced property valuation analyst specialising "
        "in the Irish residential property market. You use supervised "
        "machine learning valuation estimates to assess property prices, "
        "identify potential overvaluation and evaluate collateral risk. "
        "You carefully distinguish model estimates from verified "
        "independent property valuations."
    ),
# Gimme da key
    llm="gemini/gemini-3.8-flash",
    verbose=True,
)

# Define the task
valuation_task = Task(
    description="""
    Evaluate the following property:

    Asking price: €{asking_price}
    Supervised model valuation: €{model_valuation}
    Proposed loan amount: €{loan_amount}

    Your assessment must include:

    1. Compare the asking price against the supervised model valuation.
    2. Calculate the percentage difference between both values.
    3. Flag whether the property appears potentially overvalued.
    4. Calculate the Loan-To-Value ratio using the model valuation.
    5. Assess the potential collateral risk.
    6. Provide a clear valuation conclusion.

    Use these formulas:

    Percentage difference =
    ((Asking price - Model valuation) / Model valuation) * 100

    LTV = (Loan amount / Model valuation) * 100

    Do not invent valuations or financial information.
    Treat the supervised model output as an estimate, not an
    independently verified property appraisal.
    """,

    expected_output=(
        "A structured property valuation report showing the asking "
        "price comparison, percentage difference, LTV calculation, "
        "collateral risk and final assessment."
    ),

    agent=valuation_agent,
)

# Assemble the Crew
valuation_crew = Crew(
    agents=[valuation_agent],
    tasks=[valuation_task],
    process=Process.sequential,
    verbose=True,
)


def run_valuation(asking_price, model_valuation, loan_amount):

    result = valuation_crew.kickoff(
        inputs={
            "asking_price": asking_price,
            "model_valuation": model_valuation,
            "loan_amount": loan_amount,
        }
    )

    print("\n--- PROPERTY VALUATION REPORT ---\n")
    print(result)


if __name__ == "__main__":
    run_valuation(
        asking_price=350000,
        model_valuation=320000,
        loan_amount=280000,
    )
