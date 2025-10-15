
async function getJokes() {
  try {
    // Use Next/Node fetch on the server. Adjust the URL if deploying or using a proxy.
    const res = await fetch("http://localhost:3001/jokes", {
      // revalidate: 10 enables ISR-like behavior in Next where cached data is revalidated every 10s
      // This option only applies when using Next's App Router with fetch caching.
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching jokes on server:", err);
    // Re-throw so page can decide how to render fallback UI
    throw err;
  }
}

export default async function Page() {
  let jokes = [];
  try {
    jokes = await getJokes();
  } catch (err) {
    // Render a server-side error message. You can customize this: show fallback UI or a more friendly message.
    return (
      <div style={{ color: "red" }}>
        Failed to load jokes from the backend. Make sure the backend is running
        on <code>http://localhost:3001</code>.
      </div>
    );
  }

  if (!Array.isArray(jokes) || jokes.length === 0) {
    return <div>No jokes found.</div>;
  }

  return (
    <div>
      {jokes.map((joke) => (
        <div key={joke.id}>
          <p>{joke.joke}</p>
        </div>
      ))}
    </div>
  );
}
