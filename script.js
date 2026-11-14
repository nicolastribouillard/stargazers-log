const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-item";

    const link = document.createElement("a");
    link.className = "repository-link";
    link.href = repository.url;
    link.textContent = repository.repo;

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const date = document.createElement("time");
    date.className = "repository-date";
    date.dateTime = repository.starredAt;
    date.textContent = `Starred on ${formatDate(repository.starredAt)}`;

    item.append(link, description, date);
    repositoryList.append(item);
  }

  listStatus.textContent = repositories.length
    ? `Showing ${repositories.length} starred repositories.`
    : "No starred repositories to show.";
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("The repository data must be a JSON array.");
    }

    renderRepositories(repositories);
  } catch (error) {
    listStatus.textContent = "Could not load starred repositories.";
    console.error(error);
  }
}

loadRepositories();
