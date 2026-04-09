import faiss
import numpy as np


documents = [
    "DSA questions asked in Amazon",
    "System design in Google",
    "React interview questions"
]


embeddings = np.random.rand(len(documents), 5).astype('float32')

index = faiss.IndexFlatL2(5)
index.add(embeddings)

def search(query_vector):
    D, I = index.search(np.array([query_vector]).astype('float32'), 2)
    return [documents[i] for i in I[0]]