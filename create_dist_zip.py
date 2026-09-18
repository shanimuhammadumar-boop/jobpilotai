import os
import zipfile
import shutil

def make_dist_zip():
    dist_dir = os.path.abspath("dist")
    if not os.path.exists(dist_dir):
        print(f"Error: {dist_dir} does not exist. Please run build first.")
        return

    # Files to include directly at the root of the ZIP for GitHub Pages
    zip_filename = "jobpilotai-dist.zip"
    
    # We will exclude server-only files like server.cjs from the zip to keep it clean,
    # or keep them if needed. But GitHub Pages only serves static web assets.
    exclude_files = {"server.cjs", "server.cjs.map", zip_filename}

    print(f"Creating {zip_filename} from {dist_dir}...")
    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                if file in exclude_files:
                    continue
                file_path = os.path.join(root, file)
                # Archive name relative to dist_dir
                arcname = os.path.relpath(file_path, dist_dir)
                zipf.write(file_path, arcname)
                print(f"  Added: {arcname}")

    file_size_kb = os.path.getsize(zip_filename) / 1024
    print(f"Successfully created {zip_filename} ({file_size_kb:.2f} KB)")

    # Also copy to public/ and dist/ so it can be downloaded directly from the running web server
    os.makedirs("public", exist_ok=True)
    shutil.copyfile(zip_filename, os.path.join("public", zip_filename))
    shutil.copyfile(zip_filename, os.path.join("dist", zip_filename))
    print(f"Copied {zip_filename} to public/ and dist/ for direct web download.")

if __name__ == "__main__":
    make_dist_zip()
