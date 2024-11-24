import platform
import subprocess

def get_android_subscriber_info():
    # Placeholder function for Android subscriber info
    output = "Fetching Android subscriber info..."
    return output  # Return the output instead of printing

def get_system_info():
    # Function to get system information for Windows or macOS
    output = "Fetching system information...\n"
    system_info = {
        "system": platform.system(),
        "node": platform.node(),
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor()
    }
    for key, value in system_info.items():
        output += f"{key}: {value}\n"
    return output  # Return the output instead of printing

def detect_device():
    os_name = platform.system()
    output = ""
    if os_name == "Linux":
        try:
            # Check if it's an Android device
            result = subprocess.run(["getprop", "ro.build.version.release"], capture_output=True, text=True)
            if result.returncode == 0:
                output += "Running on an Android device\n"
                output += get_android_subscriber_info()
            else:
                output += "Running on a Linux device\n"
                output += get_system_info()
        except FileNotFoundError:
            output += "Running on a Linux device\n"
    elif os_name == "Windows":
        output += "Running on a Windows device\n"
        output += get_system_info()
    elif os_name == "Darwin":
        output += "Running on a macOS device\n"
        output += get_system_info()
    elif os_name == "Emscripten":
        output += "Running in Emscripten environment\n"
        output += "This environment is a web-based compilation and does not represent a traditional OS.\n"
    else:
        output += f"Running on an unknown device: {os_name}\n"
        output += get_system_info()

    return output  # Return the output for display
result = detect_device()
print(result)  # Print the final result for capture
