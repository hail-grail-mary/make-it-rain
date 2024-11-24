import os

def run(**args):
    print("[*] In environment module.")
    return os.environ

if __name__ == "__main__":
    result = run()
    print(result)
