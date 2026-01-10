import os


def generate_codebase_md(root_path, output_file="temp.codebase.md"):
    """
    Traverses a directory tree, reads all .ts and .tsx files, and combines them into
    a single Markdown file.
    Args:
        root_path (str): The path to the parent directory to scan.
        output_file (str): The name of the output Markdown file.
    """

    # Check if the path exists
    if not os.path.exists(root_path):
        print(f"Error: The path '{root_path}' does not exist.")
        return
    try:
        # Open the output file in write mode with UTF-8 encoding
        with open(output_file, "w", encoding="utf-8") as outfile:
            file_count = 0
            # Walk through the directory tree

            for dirpath, dirnames, filenames in os.walk(root_path):
                print("Scanning directory:", dirpath)
                # OPTIONAL: Skip node_modules to avoid scanning dependencies
                if "node_modules" in dirnames:
                    dirnames.remove("node_modules")
                for filename in filenames:
                    # Check for TypeScript extensions
                    if filename.endswith(".ts") or filename.endswith(".tsx"):
                        print(f"Processing file: {filename}")
                        file_path = os.path.join(dirpath, filename)

                        # Calculate relative path for cleaner headers
                        relative_path = os.path.relpath(file_path, root_path)

                        # Determine language for syntax highlighting
                        lang = "tsx" if filename.endswith(".tsx") else "typescript"

                        try:
                            # Open strictly in read mode
                            with open(file_path, "r", encoding="utf-8") as infile:
                                content = infile.read()

                                # Write the formatted output
                                outfile.write(f"# {relative_path}\n")
                                outfile.write(f"```{lang}\n")  # Dynamic language tag
                                outfile.write(content)
                                outfile.write(
                                    "\n```\n\n"
                                )  # Ensure spacing between files
                                print(f"Processed: {relative_path}")
                                file_count += 1
                        except Exception as e:
                            print(
                                f"Skipping {relative_path}: Could not read file. Error: {e}"
                            )
            print("-" * 30)
            print(
                f"Done! Successfully compiled {file_count} files into '{output_file}'."
            )
    except Exception as e:
        print(f"Error creating output file: {e}")


# --- Configuration ---

if __name__ == "__main__":
    # Example: target_directory = r"C:\Users\Name\Projects\MyNextJSProject"

    target_directory = input("Enter the parent directory path: ").strip()

    # Remove quotes if user copied path as "C:\Path"
    target_directory = target_directory.replace('"', "")

    generate_codebase_md(target_directory)
