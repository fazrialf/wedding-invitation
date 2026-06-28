import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-stone-900 to-stone-700 text-white text-center px-6">
        <h1 className="font-greatVibes text-6xl md:text-8xl mb-4 text-gold-300">
          Our Wedding
        </h1>
        <p className="font-cinzel text-xl md:text-2xl tracking-widest mb-2 text-gold-200">
          DIGITAL INVITATION
        </p>
        <p className="font-lato text-stone-300 mt-4 mb-10 max-w-lg">
          Create elegant, modern digital wedding invitations — share your special day with everyone.
        </p>
        <Link
          href="/dashboard"
          className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-10 py-4 rounded-none tracking-widest text-sm transition-colors duration-300"
        >
          CREATE YOUR INVITATION
        </Link>
      </section>

      {/* Themes preview */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="font-playfair text-4xl text-center mb-2">Available Designs</h2>
        <p className="text-center text-stone-500 mb-12 font-lato">Choose from our curated collection</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Gold', 'Silver', 'Dark', 'Floral'].map((theme) => (
            <Link key={theme} href={`/preview/${theme.toLowerCase()}`}>
              <div className="group cursor-pointer overflow-hidden rounded shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[9/16] bg-gradient-to-b from-stone-200 to-stone-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span className="font-cinzel text-stone-600 text-lg">{theme}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-center py-8 font-lato text-sm">
        © 2025 Wedding Digital Invitation — All Rights Reserved
      </footer>
    </main>
  )
}
