import os

def run(**args):
    print("[*] In environment module.")
    env_vars = "\n".join([f"{key}: {value}" for key, value in os.environ.items()])
    print(env_vars)
run()
