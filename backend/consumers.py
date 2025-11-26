# main_script.py
import subprocess

def main():
    print("Parent script starting...")

    # Example 1: Running a simple command
    print("\n--- Running a simple command ---")
    try:
        result = subprocess.run(
            ["python", "-m", "userService.consumer"],  # remove .py
            capture_output=True,
            text=True,
            check=True
        )
        print(f"Command output: {result.stdout.strip()}")
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")


main()