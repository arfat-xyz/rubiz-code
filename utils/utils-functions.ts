export function formatFileSize(bytes: number): string {
  const kb = 1024; // 1 KB = 1024 bytes
  const mb = kb * 1024; // 1 MB = 1024 KB = 1048576 bytes

  if (bytes < mb) {
    // If the size is less than 1MB, return the size in KB
    return (bytes / kb).toFixed(2) + " KB";
  } else {
    // Otherwise, return the size in MB
    return (bytes / mb).toFixed(2) + " MB";
  }
}
