import subprocess
import time

if __name__ == "__main__":
    print("Parent script starting...", flush=True)

    scripts = [
        ["python", "-m", "userService.consumer"],
        # ["python", "-m", "eventService.consumer"]
    ]

    processes = []

    for script in scripts:
        p = subprocess.Popen(script)
        processes.append(p)
        print(f"Started subprocess: {script}", flush=True)

    # Wait for all subprocesses to finish
    for p in processes:
        p.wait()
        time.sleep(2)
        print("I waited", flush=True)
