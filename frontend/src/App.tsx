import { useState } from 'react'
import './App.css'

type AnimeStatus = 'Watching' | 'Watched'

type Anime = {
  id: number
  title: string
  totalEpisodes: number | null
  watchedEpisodes: number
  status: AnimeStatus
}

const initialAnime: Anime[] = [
  {
    id: 1,
    title: 'Demon Slayer',
    totalEpisodes: 26,
    watchedEpisodes: 8,
    status: 'Watching',
  },
  {
    id: 2,
    title: 'Solo Leveling',
    totalEpisodes: 12,
    watchedEpisodes: 12,
    status: 'Watched',
  },
  {
    id: 3,
    title: 'One Piece',
    totalEpisodes: null,
    watchedEpisodes: 24,
    status: 'Watching',
  },
]

function App() {
  const [animeList, setAnimeList] = useState<Anime[]>(initialAnime)
  const [filter, setFilter] = useState<'All' | AnimeStatus>('All')
  const [showForm, setShowForm] = useState(false)

  const watchingCount = animeList.filter(
      (anime) => anime.status === 'Watching',
  ).length

  const watchedCount = animeList.filter(
      (anime) => anime.status === 'Watched',
  ).length

  const totalEpisodesWatched = animeList.reduce(
      (total, anime) => total + anime.watchedEpisodes,
      0,
  )

  const visibleAnime = animeList.filter(
      (anime) => filter === 'All' || anime.status === filter,
  )

  function updateProgress(id: number, change: number) {
    setAnimeList((currentList) =>
        currentList.map((anime) => {
          if (anime.id !== id) return anime

          const nextProgress = Math.max(
              0,
              anime.watchedEpisodes + change,
          )

          const watchedEpisodes =
              anime.totalEpisodes === null
                  ? nextProgress
                  : Math.min(nextProgress, anime.totalEpisodes)

          const status: AnimeStatus =
              anime.totalEpisodes !== null &&
              watchedEpisodes === anime.totalEpisodes
                  ? 'Watched'
                  : 'Watching'

          return { ...anime, watchedEpisodes, status }
        }),
    )
  }

  function addAnime(title: string, totalEpisodes: number | null) {
    const newAnime: Anime = {
      id: Date.now(),
      title,
      totalEpisodes,
      watchedEpisodes: 0,
      status: 'Watching',
    }

    setAnimeList((currentList) => [...currentList, newAnime])
    setShowForm(false)
    setFilter('All')
  }

  function toggleStatus(id: number) {
    setAnimeList((currentList) =>
        currentList.map((anime) =>
            anime.id === id
                ? {
                  ...anime,
                  status:
                      anime.status === 'Watching' ? 'Watched' : 'Watching',
                }
                : anime,
        ),
    )
  }

  return (
      <main className="app">
        <header className="topbar">
          <a className="brand" href="#">
            <span className="brand-icon">ア</span>
            <span>ANITRACK</span>
          </a>
          <span className="header-label">YOUR ANIME JOURNEY</span>
        </header>

        <section className="hero">
          <p className="eyebrow">YOUR PERSONAL ANIME LIBRARY</p>
          <h1>
            Every episode.
            <br />
            <span>Every adventure.</span>
          </h1>
          <p className="hero-description">
            Keep track of your anime journey, one episode at a time.
          </p>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-label">WATCHING</span>
            <strong>{watchingCount}</strong>
            <span className="stat-caption">Currently following</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">COMPLETED</span>
            <strong>{watchedCount}</strong>
            <span className="stat-caption">Finished anime</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">EPISODES WATCHED</span>
            <strong>{totalEpisodesWatched}</strong>
            <span className="stat-caption">Your total progress</span>
          </article>
        </section>

        <section className="library">
          <div className="library-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>My anime</h2>
            </div>

            <button
                className="primary-button"
                onClick={() => setShowForm((visible) => !visible)}
            >
              {showForm ? 'Cancel' : '+ Add anime'}
            </button>
          </div>

          {showForm && <AnimeForm onAdd={addAnime} />}

          <nav className="filters" aria-label="Filter anime">
            {(['All', 'Watching', 'Watched'] as const).map((option) => (
                <button
                    key={option}
                    className={`filter-button ${filter === option ? 'active' : ''}`}
                    onClick={() => setFilter(option)}
                >
                  {option}
                </button>
            ))}
          </nav>

          <div className="anime-grid">
            {visibleAnime.map((anime) => {
              const progress =
                  anime.totalEpisodes === null || anime.totalEpisodes === 0
                      ? null
                      : Math.min(
                          100,
                          Math.round(
                              (anime.watchedEpisodes / anime.totalEpisodes) * 100,
                          ),
                      )

              return (
                  <article className="anime-card" key={anime.id}>
                    <div className="anime-art">
                      <span className="art-symbol">✦</span>
                      <span className="art-title">{anime.title}</span>
                      <span className="art-subtitle">ANIME COLLECTION</span>
                      <span className="episode-badge">
                    {anime.totalEpisodes === null
                        ? 'Ongoing'
                        : `${anime.totalEpisodes} episodes`}
                  </span>
                    </div>

                    <div className="anime-details">
                      <div className="anime-title-row">
                        <h3>{anime.title}</h3>
                        <span
                            className={`status-badge ${anime.status.toLowerCase()}`}
                        >
                      {anime.status}
                    </span>
                      </div>

                      <div className="progress-label">
                        <span>Episodes watched</span>
                        <strong>
                          {anime.watchedEpisodes}
                          {anime.totalEpisodes !== null &&
                              ` / ${anime.totalEpisodes}`}
                        </strong>
                      </div>

                      {progress !== null && (
                          <div
                              className="progress-track"
                              role="progressbar"
                              aria-label={`${anime.title} progress`}
                              aria-valuenow={progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                          >
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                          </div>
                      )}

                      <div className="card-actions">
                        <button
                            className="secondary-button"
                            disabled={anime.watchedEpisodes === 0}
                            onClick={() => updateProgress(anime.id, -1)}
                            aria-label={`Remove watched episode from ${anime.title}`}
                        >
                          −
                        </button>

                        <button
                            className="primary-button progress-button"
                            disabled={
                                anime.totalEpisodes !== null &&
                                anime.watchedEpisodes >= anime.totalEpisodes
                            }
                            onClick={() => updateProgress(anime.id, 1)}
                        >
                          + Watched episode
                        </button>

                        <button
                            className="secondary-button status-button"
                            onClick={() => toggleStatus(anime.id)}
                            title="Change anime status"
                            aria-label={`Toggle ${anime.title} status`}
                        >
                          ↻
                        </button>
                      </div>
                    </div>
                  </article>
              )
            })}
          </div>

          {visibleAnime.length === 0 && (
              <p className="empty-state">
                No anime here yet. Add an anime to get started!
              </p>
          )}
        </section>

        <footer className="footer">
          Built for your anime journey <span>✦</span>
        </footer>
      </main>
  )
}

type AnimeFormProps = {
  onAdd: (title: string, totalEpisodes: number | null) => void
}

function AnimeForm({ onAdd }: AnimeFormProps) {
  const [title, setTitle] = useState('')
  const [totalEpisodes, setTotalEpisodes] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const total = totalEpisodes.trim() === ''
        ? null
        : Number(totalEpisodes)

    if (
        total !== null &&
        (!Number.isInteger(total) || total < 1)
    ) {
      return
    }

    onAdd(trimmedTitle, total)
  }

  return (
      <form className="anime-form" onSubmit={handleSubmit}>
        <label>
          Anime title
          <input
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Attack on Titan"
          />
        </label>

        <label>
          Total episodes
          <input
              type="number"
              min="1"
              step="1"
              value={totalEpisodes}
              onChange={(event) => setTotalEpisodes(event.target.value)}
              placeholder="Leave blank if ongoing"
          />
        </label>

        <button className="primary-button" type="submit">
          Add to my anime
        </button>
      </form>
  )
}

export default App