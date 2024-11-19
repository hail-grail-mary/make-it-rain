import platform
import subprocess

def get_android_subscriber_info():
    # Placeholder function for Android subscriber info
    print("Fetching Android subscriber info...")
    # Add actual implementation here

def get_system_info():
    # Function to get system information for Windows or macOS
    print("Fetching system information...")
    system_info = {
        "system": platform.system(),
        "node": platform.node(),
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor()
    }
    for key, value in system_info.items():
        print(f"{key}: {value}")

def detect_device():
    os_name = platform.system()
    if os_name == "Linux":
        try:
            # Check if it's an Android device
            result = subprocess.run(["getprop", "ro.build.version.release"], capture_output=True, text=True)
            if result.returncode == 0:
                print("Running on an Android device")
                get_android_subscriber_info()
            else:
                print("Running on a Linux device")
                get_system_info()
        except FileNotFoundError:
            print("Running on a Linux device")
    elif os_name == "Windows":
        print("Running on a Windows device")
        get_system_info()
    elif os_name == "Darwin":
        print("Running on a macOS device")
        get_system_info()
    else:
        print(f"Running on an unknown device: {os_name}")

if __name__ == "__main__":
    detect_device()
