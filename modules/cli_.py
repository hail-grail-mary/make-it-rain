import os
import platform
import paramiko
import socket
import time

BROADCAST_PORT = 50000
DISCOVERY_TIMEOUT = 10  # Time to wait for server discovery

def detect_system():
    """Detect if the system is Linux, Android, macOS, or Windows."""
    system = platform.system()
    if "ANDROID_ROOT" in os.environ:
        return "Android"
    elif system == "Linux":
        return "Linux"
    elif system == "Windows":
        return "Windows"
    elif system == "Darwin":
        return "macOS"
    else:
        return None

def discover_server():
    """Discover the server via UDP broadcast."""
    print("Discovering server...")
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(DISCOVERY_TIMEOUT)
        s.bind(("", BROADCAST_PORT))
        try:
            data, addr = s.recvfrom(1024)
            if data.decode().startswith("SSH_SERVER:"):
                server_ip = data.decode().split(":")[1]
                print(f"Discovered server at {server_ip}")
                return server_ip
        except socket.timeout:
            print("Server discovery timed out.")
            return None

def connect_to_server(host, port, username, password=None, key_path=None, reverse_tunnel_port=None):
    """
    Connect to the SSH server and optionally create a reverse tunnel.
    """
    try:
        print(f"Connecting to SSH server {host}:{port}...")
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        if key_path:
            key = paramiko.RSAKey.from_private_key_file(key_path)
            client.connect(host, port, username=username, pkey=key)
        elif password:
            client.connect(host, port, username=username, password=password)
        else:
            raise ValueError("Either password or key_path must be provided for authentication.")

        if reverse_tunnel_port:
            transport = client.get_transport()
            transport.request_port_forward("", reverse_tunnel_port, "127.0.0.1", reverse_tunnel_port)
            print(f"Reverse tunnel established: {host}:{reverse_tunnel_port} -> client:127.0.0.1:{reverse_tunnel_port}")

        print("SSH connection established. Keeping connection alive...")
        while True:
            time.sleep(1)
    except Exception as e:
        print(f"Failed to connect to SSH server: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    system_type = detect_system()
    if not system_type:
        print("This script only works on Linux, Android, macOS, or Windows.")
        exit(1)

    print(f"Detected system: {system_type}")

    # Discover the server
    server_ip = discover_server()
    if not server_ip:
        print("Could not discover server. Exiting.")
        exit(1)

    # SSH connection details
    ssh_host = server_ip
    ssh_port = 22
    ssh_username = "test_user"
    ssh_password = "test_pass"  # Optional: Use None for key-based auth
    ssh_key_path = None  # Replace with key path if using key-based auth
    reverse_tunnel_port = 8080  # Optional reverse tunnel

    connect_to_server(
        host=ssh_host,
        port=ssh_port,
        username=ssh_username,
        password=ssh_password,
        key_path=ssh_key_path,
        reverse_tunnel_port=reverse_tunnel_port
    )
