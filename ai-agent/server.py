from flask import Flask, request, jsonify
from agent import app  # your LangGraph agent

app_server = Flask(__name__)

@app_server.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "Missing question"}), 400

    result = app.invoke({"question": question})
    return jsonify({"answer": result.get("answer", "No answer generated.")})

if __name__ == "__main__":
    app_server.run(host="0.0.0.0", port=8080)
