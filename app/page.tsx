import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import UrlForm from '@/components/UrlForm'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg-main)' }}>
      <header className="sticky top-4 z-50 px-6">
        <div className="header-pill flex items-center justify-between rounded-2xl bg-black px-[30px] py-3 shadow-xl">
          <Image
            src="https://magecloud.agency/wp-content/themes/magecloudtheme/images/logo_5.png"
            alt="MageCloud logo"
            width={150}
            height={40}
            priority
            className="logo-img"
          />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="https://calendly.com/paul-ryazanov"
              target="_blank"
              rel="noopener noreferrer"
              className="book-call-btn rounded-full border px-5 py-2 text-sm font-semibold"
            >
              Book a Call
            </a>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-4 pt-[calc(50vh-220px)] pb-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[800px] rounded-full blur-3xl" style={{ background: 'var(--glow-bg)' }} />
        </div>

        <div className="relative w-full max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="inline-flex items-center gap-3 text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              MageCloud
              <img src="/magento-2-logo.svg" alt="Magento" width={40} height={40} className="inline-block" />
              <span style={{ color: 'var(--accent-fg)' }}>SiteAudit</span>
            </h1>
            <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-2 text-lg" style={{ color: 'var(--text-muted)' }}>
              Validate your Magento
              <img src="/magento-2-logo.svg" alt="Magento" width={20} height={20} className="inline-block" />
              store against SEO and accessibility best practices.
            </p>
          </div>

          <UrlForm />
        </div>
      </main>
    </div>
  )
}
