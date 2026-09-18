"""Local model through Ollama - no API key, no cost. Needs Ollama running:

    ollama serve
    ollama pull qwen2.5:3b
"""

from langchain_ollama import ChatOllama

from chat_messages import build_messages

model = ChatOllama(model="qwen2.5:3b", temperature=0)


def ask(message, history=None):
    """Send a message (plus optional prior turns) to the model and return the reply text."""
    return model.invoke(build_messages(message, history)).content


if __name__ == "__main__":
    print(ask("what do u know about langchain?"))
