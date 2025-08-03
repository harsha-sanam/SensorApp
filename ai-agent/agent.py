from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser

from tools import create_sensor, get_sensor_data
from prompts import input_parser_prompt
import json
from typing import TypedDict, Optional, Any

class AgentState(TypedDict):
    question: str
    intent: str
    sensor_name: str
    from_date: Optional[str]
    to_date: Optional[str]
    threshold: Optional[float]
    comparison: Optional[str]
    api_response: Optional[Any]
    answer: str

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# Node 1: Parse intent
def input_parser(state: AgentState):
    prompt = PromptTemplate.from_template(input_parser_prompt)
    chain = prompt | llm | StrOutputParser()
    parsed = chain.invoke({"question": state["question"]})
    parsed_json = json.loads(parsed)
    return {**state, **parsed_json}

# Node 2: Create sensor
def create_sensor_node(state: AgentState):
    msg = create_sensor(state["sensor_name"])
    return {**state, "answer": msg}

# Node 3: Fetch data
def fetch_data_node(state: AgentState):
    data = get_sensor_data(state["sensor_name"], state["from_date"], state["to_date"])
    return {**state, "api_response": data}

# Node 4: Analyze
def analyze_data_node(state: AgentState):
    values = state["api_response"]
    if not values:
        return {"question": state["question"], **state, "answer": "No data available."}


    if state.get("threshold") is not None and state.get("comparison"):
        comp = state["comparison"]
        threshold = state["threshold"]
        count = sum(1 for v in values if (
            (comp == "below" and v["value"] < threshold) or
            (comp == "above" and v["value"] > threshold)
        ))
        return {**state, "answer": f"{count} values were {comp} {threshold} during the given period."}
    else:
        # Summarize data range
        vals = [v["value"] for v in values]
        summary = f"{state['sensor_name']} values from {state['from_date']} to {state['to_date']} ranged from {min(vals)} to {max(vals)}."
        return {**state, "answer": summary}

# Node 5: Final output
def format_output(state: AgentState):
    return state  # full state as dict, including 'answer'


# Branching logic
def router(state: AgentState):
    if state["intent"] == "create_sensor":
        return "create_sensor"
    elif state["intent"] == "analyze_sensor_data":
        return "fetch_data"
    else:
        return END

# Build graph
graph = StateGraph(AgentState)
graph.add_node("input_parser", input_parser)
graph.add_node("create_sensor", create_sensor_node)
graph.add_node("fetch_data", fetch_data_node)
graph.add_node("analyze_data", analyze_data_node)
graph.add_node("format_output", format_output)

graph.set_entry_point("input_parser")

graph.add_conditional_edges("input_parser", router)
graph.add_edge("create_sensor", "format_output")
graph.add_edge("fetch_data", "analyze_data")
graph.add_edge("analyze_data", "format_output")
graph.set_finish_point("format_output")

app = graph.compile()
