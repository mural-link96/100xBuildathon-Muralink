class OpenAIConfig:
    def __init__(self, 
                 model="gpt-4o-mini", 
                 max_tokens=1000, 
                 temperature=0.7, 
                 timeout_ms=30000):
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.timeout_ms = timeout_ms