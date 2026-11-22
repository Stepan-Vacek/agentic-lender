from pathlib import Path
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# Initialise the search tool
search_tool = SerperDevTool()

# Create the Agent
researcher_agent = Agent(
    role="Mortgage Market Researcher",

    goal=(
        "Research current European Central Bank rates, Irish mortgage "
        "benchmarks and prevailing mortgage market trends using "
        "reliable and up-to-date external sources."
    ),

    backstory=(
        "You are a financial market researcher specialising in "
        "the Irish mortgage market. You use external web searches "
        "to investigate central bank announcements, mortgage rates, "
        "lender trends and regulatory developments. You prioritise "
        "official sources and provide accurate, evidence-based findings."
    ),

    tools=[search_tool],
# Gimmie da key
    llm="groq/llama-3.3-70b-versatile",

    verbose=True,
)

# Define the task
research_task = Task(
    description="""
    Research the latest available information about the Irish
    mortgage market.

    Investigate the following:

    1. Current European Central Bank policy interest rates.
    2. Recent Central Bank of Ireland mortgage market updates.
    3. Prevailing Irish fixed and variable mortgage interest rates.
    4. Recent mortgage interest rate trends.
    5. Any important developments affecting mortgage affordability.

    Requirements:

    - Use web searches to find current information.
    - Prioritise official ECB and Central Bank of Ireland sources.
    - Use Irish mortgage lender sources for mortgage rate comparisons.
    - Include publication dates where available.
    - Include source URLs for all important findings.
    - Distinguish current information from historical trends.
    - Never invent rates, figures or sources.
    - Clearly identify information that cannot be verified.
    """,

    expected_output=(
        "A structured Irish mortgage market research report containing "
        "current ECB policy rates, mortgage benchmarks, market trends, "
        "important developments and source URLs."
    ),

    agent=researcher_agent,
)

# Assemble the Crew
research_crew = Crew(
    agents=[researcher_agent],
    tasks=[research_task],
    process=Process.sequential,
    verbose=True,
)


def run_research():
    result = research_crew.kickoff()

    print("\n--- MORTGAGE MARKET RESEARCH REPORT ---\n")
    print(result)


if __name__ == "__main__":
    run_research()
