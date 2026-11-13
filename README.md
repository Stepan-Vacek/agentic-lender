# Product Goal:
Develop a bespoke prototype system called AL (Agentic Lender). The platform
connects retail borrowers, accredited mortgage brokers, and bank underwriting officials within a
modern lending ecosystem.

 

# Stake Holders:
| Name              | Role                        |
|-------------------|-----------------------------|
| Christopher Nolan | Mobile Client Developer     |
| Stepan Vacek      | Web Application Developer   |
| Rafik Pedroni     | Core & Ledger Developer     |
| Conor Stack       | AI Engine Developer         |
| Seamus Lankford   | Product Owner / Coordinator |


# Project Scope:
The system will consist of a mobile app and web app, as well as a back-end database and smart contract minter. The system will have several AI agents linked, which will be trained on relevant data. A Machine Learning model will also be present.

- Functionality on the mobile app will allow users to register, login, enter loan applications thru a form, get a valuation estimate, get an estimate on LTV, DTI, approval likelihood and lifecycle state of their application, messaging ability with brokers or lending officers, payments in-app, in-app review/rating system.

- Functionality on the web app will allow brokers and underwriters to login, see an overview of cases, view individual cases with visualisations and AI summaries, underwriters can access a Macro-Stress testing simulator (which can simulate bank interest rate shocks, market downturns), underwriters can sign off on applications (prompting smart-contract loan minting) and download PDF audit packs.

- Database will contain all data relevant to the project, including user profiles, document metadata, broker assignments, real-time application states. Part of this scope is also loan tokenization contract, and cryptographic hash of various important files (final credit memo, valuation data, underwriter approval) onto blockchain, deployed using Hardhat/Anvil to a EVM test-net.

- AI scope will include a Machine Learning algorithm for property valuation, and agentic AIs for affordability, valuation, market/macro research & underwriter strategies. There will be at least two LLM APIs with a locally hosted LLM via Ollama.
