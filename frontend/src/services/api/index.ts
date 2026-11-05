async function getHealth(): Promise<void> {
  const response = await fetch("/api/v1/health");

  if (!response.ok) {
    throw new Error("The health check failed.");
  }
}

export { getHealth };