
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()
# reads GOOGLE_API_KEY from .env; few retries so quota errors reach the page instead of hanging
model = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0, max_retries=1, timeout=60)


def ask(message, history=None):
    """Send a message (plus optional prior turns) to the model and return the reply text."""
    messages = [SystemMessage(content="You are a helpful assistant.")]
    for turn in history or []:
        if turn["role"] == "user":
            messages.append(HumanMessage(content=turn["content"]))
        else:
            messages.append(AIMessage(content=turn["content"]))
    messages.append(HumanMessage(content=message))
    return model.invoke(messages).content


if __name__ == "__main__":
    print(ask("what do u know about langchain?"))
