"""Google Gemini through the API. Needs GOOGLE_API_KEY in .env."""

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from chat_messages import build_messages

load_dotenv()

# few retries so quota errors reach the page instead of hanging
model = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0, max_retries=1, timeout=60)


def ask(message, history=None):
    """Send a message (plus optional prior turns) to the model and return the reply text."""
    return model.invoke(build_messages(message, history)).content


if __name__ == "__main__":
    print(ask("what do u know about langchain?"))
