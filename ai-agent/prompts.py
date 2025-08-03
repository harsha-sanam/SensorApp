input_parser_prompt = """
Extract the user intent and parameters from this question.

Question: {question}

Respond with JSON:
{{
  "intent": "create_sensor" | "analyze_sensor_data",
  "sensor_name": "...",
  "from_date": "YYYY-MM-DD",
  "to_date": "YYYY-MM-DD",
  "threshold": float or null,
  "comparison": "below" | "above" | null
}}
"""
