/**
 * Header.tsx
 * ----------
 * The top banner of the app. Shows the app name and a short tagline.
 */

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <h1 className="text-2xl font-bold text-gray-900">TrendLink</h1>
        <p className="text-sm text-gray-600 mt-1">
          Automated LinkedIn posts powered by trending news
        </p>
      </div>
    </header>
  );
}
