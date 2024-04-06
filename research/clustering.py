import json
from copy import copy
from openai import OpenAI
import numpy as np
from tqdm import tqdm
import pathlib
import hdbscan
from sklearn.manifold import TSNE
from sklearn.cluster import AffinityPropagation
import matplotlib
import matplotlib.pyplot as plt
client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
    return client.embeddings.create(input = [text], model=model).data[0].embedding


def cluster_journal_entries():

    with open('data.json') as f:
        data = json.load(f)

    entries = [e['text'] for e in data['entries']]

    for e in entries: 
        print(e)
    exit()

    # For each entry, split into thoughts using '\n\n' as delimiter
    thoughts = []
    for entry in entries:
        thoughts.extend(entry.split('\n\n'))

    # Process thoughts to remove effects of markdown:
    # Replace \., \!, \+, \(, \) with ., !, +, (, )

    replace_map = {
        '\.': '.',
        '\!': '!',
        '\+': '+',
        '\(': '(',
        '\)': ')'
    }

    for i, thought in enumerate(thoughts):
        new_thought = copy(thought)
        for k, v in replace_map.items():
            new_thought = new_thought.replace(k, v)
        new_thought = new_thought.replace("\n", " ")
        new_thought = new_thought.replace("# What's on your mind today?", "")
        thoughts[i] = new_thought

    # If local embeddings.npy file exists, load it...
    if pathlib.Path('embeddings.npy').exists():
        embeddings_array = np.load('embeddings.npy')

    # Otherwise compute and save.
    else:
        print("Computing embeddings.")
        embeddings = []
        for thought in tqdm(thoughts):
            embeddings.append(get_embedding(thought))
        embeddings_array = np.array(embeddings)
        np.save('embeddings.npy', embeddings_array)

    # Perform t-SNE
    clustering = AffinityPropagation(random_state=5).fit(embeddings_array)
    labels = clustering.labels_

    thought_clusters = {l: [] for l in set(labels)}
    for thought, label in zip(thoughts, labels):
        thought_clusters[label].append(thought)

    thought_documents = ["\n\n".join(thoughts) for thoughts in thought_clusters.values()]

    doc = thought_documents[4]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a pscyhologist analysing the user's diary entries. The user will give you a dump of text containing diary entries clustered around a theme. You should analyse the text, pull out the main three themes and write a short report with one paragraph for each theme. THe intent is to draw the users attention towards common patterns in their thinking."},
            {"role": "user", "content": doc},
            # You can customize this prompt to specify that you want a one paragraph analysis
        ]
    )

    print(response.choices[0].message.content)

if __name__ == '__main__':
    cluster_journal_entries()