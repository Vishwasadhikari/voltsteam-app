import re
from app.agent.coordinator import coordinator


def run_agent(message, history=None):

    history = history or []

    conversation = ""

    for msg in history[-8:]:

        role = msg.get("role", "user")
        content = msg.get("content", "")

        conversation += f"{role}: {content}\n"

    prompt = f"""
Previous Conversation:

{conversation}

Current User Message:
{message}
"""

    response = coordinator(prompt)

    clean_response = re.sub(
        r"<thinking>.*?</thinking>",
        "",
        str(response),
        flags=re.DOTALL
    )

    clean_response = re.sub(
        r"Tool #\d+:.*?\n",
        "",
        clean_response,
        flags=re.DOTALL
    )

    return {
        "response": clean_response.strip()
    }