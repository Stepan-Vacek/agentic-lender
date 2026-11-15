from pathlib import Path
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# Create the Agent
strategist_agent = Agent(
    role="Senior Mortgage Credit Strategist",

    goal=(
        "Evaluate mortgage applications by reviewing affordability, "
        "property valuation and market research findings, then produce "
        "a justified lending recommendation and audit-ready credit "
        "memorandum."
    ),

    backstory=(
        "You are an experienced mortgage credit strategist specialising "
        "in Irish residential lending. You review financial assessments, "
        "property valuations and external market research. You identify "
        "conflicting information, assess risks and make evidence-based "
        "recommendations. You prioritise responsible lending, regulatory "
        "compliance, transparency and accurate documentation."
    ),
# gimmie da key
    llm="groq/llama-3.3-70b-versatile",

    verbose=True,
)

# Define the task
strategist_task = Task(
    description="""
    Review the following outputs from the mortgage assessment system.

    AFFORDABILITY AGENT REPORT:
    {affordability_report}

    VALUATION AGENT REPORT:
    {valuation_report}

    RESEARCHER AGENT REPORT:
    {researcher_report}

    Your responsibilities:

    1. Review all three reports and identify their key findings.

    2. Evaluate the applicant's financial affordability and
       stress-tested repayment risks.

    3. Evaluate the property valuation, Loan-To-Value ratio
       and potential collateral risks.

    4. Consider current mortgage market conditions and
       relevant regulatory information.

    5. Identify conflicting information, missing data
       and unresolved risks.

    6. Select ONE final recommendation:
       - APPROVE
       - CONDITIONALLY APPROVE
       - DECLINE

    7. Explain and justify your recommendation using
       evidence from the upstream reports.

    8. Produce an audit-ready credit memorandum.

    CREDIT MEMORANDUM FORMAT:

    - Application Summary
    - Affordability Assessment
    - Property Valuation Assessment
    - Market and Regulatory Considerations
    - Identified Risks
    - Outstanding Conditions
    - Final Lending Recommendation
    - Justification and Supporting Evidence

    IMPORTANT:
    Do not invent missing information or calculations.
    Clearly identify assumptions and conflicting findings.
    Do not treat model valuations as independently verified appraisals.
    Do not claim regulatory compliance without sufficient evidence.
    A recommendation is not a final binding lending decision.
    """,

    expected_output=(
        "An audit-ready mortgage credit memorandum containing "
        "the assessment findings, identified risks, outstanding "
        "conditions and one justified lending recommendation: "
        "APPROVE, CONDITIONALLY APPROVE or DECLINE."
    ),

    agent=strategist_agent,
)

# Assemble the Crew
strategist_crew = Crew(
    agents=[strategist_agent],
    tasks=[strategist_task],
    process=Process.sequential,
    verbose=True,
)


def run_strategist(
    affordability_report,
    valuation_report,
    researcher_report
):

    result = strategist_crew.kickoff(
        inputs={
            "affordability_report": affordability_report,
            "valuation_report": valuation_report,
            "researcher_report": researcher_report,
        }
    )

    print("\n--- CREDIT MEMORANDUM ---\n")
    print(result)


if __name__ == "__main__":

    run_strategist(
        affordability_report="Applicant has sufficient disposable surplus and passes the mortgage stress test.",
        valuation_report="Property valuation is €300,000, proposed loan is €240,000 and LTV is 80%.",
        researcher_report="Current market research indicates stable mortgage rates and no identified regulatory concerns."
    )
