import numpy as np
from sklearn.linear_model import LinearRegression

# dummy training
X = np.array([
    [8.5, 3, 2],
    [7.0, 1, 1],
    [9.0, 4, 3]
])
y = np.array([85, 60, 95])

model = LinearRegression()
model.fit(X, y)

def predict_score(cgpa, projects, internships):
    return int(model.predict([[cgpa, projects, internships]])[0])