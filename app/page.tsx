import Image from 'next/image'
import UrlForm from '@/components/UrlForm'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="relative z-10 flex items-center justify-between px-8 pt-4 pb-5">
        <Image
          src="https://magecloud.agency/wp-content/themes/magecloudtheme/images/logo_5.png"
          alt="MageCloud logo"
          width={150}
          height={40}
          priority
        />
        <a
          href="https://calendly.com/paul-ryazanov"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
        >
          Book a Call
        </a>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[800px] rounded-full bg-blue-600/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="inline-flex items-center gap-3 text-5xl font-bold tracking-tight text-white">
              MageCloud
              <img src="/magento-2-logo.svg" alt="Magento" width={40} height={40} className="inline-block" />
              <span className="text-blue-400">SiteAudit</span>
            </h1>
            <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-2 text-lg text-slate-400">
              Validate your Magento
              <img
                src="/magento-2-logo.svg"
                alt="Magento"
                width={20}
                height={20}
                className="inline-block"
              />
              store against SEO and accessibility best practices.
            </p>
          </div>

          <UrlForm />
        </div>
      </main>
    </div>
  )
}
