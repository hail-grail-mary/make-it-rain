import os

def run(**args):
    print("[*] In environment module.")
    for key, value in os.environ.items():
        print(f"{key}: {value}")

run()
