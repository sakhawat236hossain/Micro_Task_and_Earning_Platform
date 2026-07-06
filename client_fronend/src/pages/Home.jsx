import React from 'react';

const stats = [
  { label: 'Active Tasks', value: '120+' },
  { label: 'Happy Workers', value: '4.8k' },
  { label: 'Daily Payouts', value: '$2.4k' },
];

const featuredWorkers = [
  { name: 'Nadia', coins: 1250, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { name: 'Rahim', coins: 1120, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mina', coins: 980, avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sajid', coins: 940, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Lima', coins: 910, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  { name: 'Ayon', coins: 890, avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80' },
];

const testimonials = [
  {
    name: 'Arif',
    quote: 'I completed my first task in minutes and received my coins instantly.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Ripa',
    quote: 'The dashboard is simple and the payout flow feels very transparent.',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Jamal',
    quote: 'As a buyer, I can manage everything from one clean workspace.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

export default function Home() {
  return (
    <div className="page-shell">
      <section className="hero-section">
        <div>
          <p className="eyebrow">Earn with simple micro-tasks</p>
          <h1>Turn small tasks into real rewards.</h1>
          <p className="hero-copy">
            Buyers post quick jobs, workers complete them, and admins keep the platform secure.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">Join now</a>
            <a className="btn btn-secondary" href="/login">Sign in</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Why TaskEarn Hub?</h3>
          <ul>
            <li>Fast onboarding for workers and buyers</li>
            <li>Secure role-based dashboard access</li>
            <li>Fair coin and payout system</li>
          </ul>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Top workers this week</h2>
          <p>These contributors are earning the most from completed tasks.</p>
        </div>
        <div className="worker-grid">
          {featuredWorkers.map((worker) => (
            <div key={worker.name} className="worker-card">
              <img src={worker.avatar} alt={worker.name} />
              <h3>{worker.name}</h3>
              <p>{worker.coins} coins</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>What users say</h2>
          <p>Trusted by workers, buyers, and admins around the globe.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div key={item.name} className="testimonial-card">
              <img src={item.avatar} alt={item.name} />
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block extra-sections">
        <div className="info-card">
          <h3>Smart task tracking</h3>
          <p>Buyers and workers both get clear task status updates with minimal friction.</p>
        </div>
        <div className="info-card">
          <h3>Instant coin flow</h3>
          <p>Coins are issued and deducted automatically based on task outcomes.</p>
        </div>
        <div className="info-card">
          <h3>Secure governance</h3>
          <p>Admins can manage users, tasks, and withdrawals from one panel.</p>
        </div>
      </section>
    </div>
  );
}
