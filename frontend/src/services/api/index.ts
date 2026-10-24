async function getHealth(): Promise<void> {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error("The health check failed.");
  }
}

export { getHealth };