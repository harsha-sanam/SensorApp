
from agent import app


# Analyze data with condition
response = app.invoke({"question": "How many times did TempSensor9 go below 35 in July?"})
print(response)
# Range summary
response = app.invoke({"question": "Show values for TempSensor9 from June 1 to July 1, 2025"})
print(response)
response = app.invoke({"question": "How many times did TempSensor9 go below 35 in July 2025?"})
print(response)
