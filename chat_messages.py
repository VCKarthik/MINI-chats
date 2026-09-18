"""Shared helper: turn a message plus prior turns into LangChain messages."""

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

SYSTEM_PROMPT = "You are a helpful assistant."


def build_messages(message, history=None):
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    for turn in history or []:
        if turn["role"] == "user":
            messages.append(HumanMessage(content=turn["content"]))
        else:
            messages.append(AIMessage(content=turn["content"]))
    messages.append(HumanMessage(content=message))
    return messages
