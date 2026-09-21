"""Run the Adaptive Round Robin simulator on a local web server.

Usage:
    python server.py

Then open http://localhost:8000 in a browser. Pass a port as an optional
argument, for example: python server.py 3000
"""

from __future__ import annotations

import argparse
import http.server
import os
import socketserver
import webbrowser


DEFAULT_PORT = 8000


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Serve the Adaptive Round Robin CPU Scheduling Simulator locally."
    )
    parser.add_argument(
        "port",
        nargs="?",
        type=int,
        default=DEFAULT_PORT,
        help=f"Port to use (default: {DEFAULT_PORT}).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_arguments()
    if not 1 <= args.port <= 65535:
        raise SystemExit("Port must be between 1 and 65535.")

    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    url = f"http://localhost:{args.port}"

    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", args.port), handler) as server:
        print(f"Simulator is running at {url}")
        print("Press Ctrl+C to stop the server.")
        webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == "__main__":
    main()
