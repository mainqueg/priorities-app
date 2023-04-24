import { useTheme } from 'next-themes'

export default function Header() {
  const { resolvedTheme } = useTheme()

  return (
    <header className="pt-20 mb-12">
      <div className="flex justify-center">
        <img
          src={`${process.env.LOGO_URL}`}
          alt="Priorities"
          width={140}
        />
      </div>

      <div className="mt-6 text-center text-dimmed">
        <p>Help us by voting our priorities.</p>
        <p>Vote up the items you want to see in the next steps.</p>
      </div>
    </header>
  )
}
