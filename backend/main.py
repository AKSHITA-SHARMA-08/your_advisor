from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable not set")

client = Groq(api_key=api_key)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

system_prompt = {
    "role": "system",
    "content": "You are YourAdvisor, a highly professional, knowledgeable, and helpful financial advisor. You provide sound, conservative, and educational financial advice. You always remind users that you are an AI and they should consult with a certified financial planner for personal advice."
}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        messages = [system_prompt] + [{"role": m.role, "content": m.content} for m in request.messages]
        
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
        )
        
        return {"reply": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": "YourAdvisor Backend is running!"}
