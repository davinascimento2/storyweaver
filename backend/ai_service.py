import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is required")
        self.client = anthropic.Anthropic(api_key=api_key)

    def continue_story(self, prompt, story_context=""):
        full_prompt = f"""Continue this story creatively and coherently:

        Story prompt: {prompt}

        Previous context: {story_context}

        Write the next chapter (2-3 paragraphs) that maintains the tone and advances the narrative."""

        try:
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[{"role": "user", "content": full_prompt}]
            )
            return response.content[0].text
        except Exception as e:
            # Fallback response if API fails
            return f"[AI temporarily unavailable: {str(e)}. Please try again later.]"