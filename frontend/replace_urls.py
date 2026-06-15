import os
import sys

root_dir = "c:/Users/yurir/vasco-analytics/frontend/src"

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".ts") or filename.endswith(".tsx"):
            filepath = os.path.join(dirpath, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content.replace(
                "'http://localhost:3001/graphql'", 
                "(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql')"
            ).replace(
                '"http://localhost:3001/graphql"', 
                "(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql')"
            )
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
