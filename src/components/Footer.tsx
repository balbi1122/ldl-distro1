import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-rose-200/40 bg-rose-50/50 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-primary mb-3">
              🎤 Stories for a Showgirl
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A fan portal where Swifties share original poems, stories, and
              videos inspired by Taylor Swift and her incredible work.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Not affiliated with Taylor Swift, Republic Records, or any related
              entities. Fan-created content only.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-foreground/70">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/browse" className="hover:text-primary transition-colors">
                  Browse All Content
                </Link>
              </li>
              <li>
                <Link to="/category/eras-tour" className="hover:text-primary transition-colors">
                  Eras Tour
                </Link>
              </li>
              <li>
                <Link to="/category/late-show-story" className="hover:text-primary transition-colors">
                  The Colbert Story
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  Membership Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-foreground/70">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/submit" className="hover:text-primary transition-colors">
                  Submit Content
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  Join Free
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
            <div className="mt-4 text-xs text-muted-foreground space-y-1">
              <p>📜 Original fan content only</p>
              <p>🚫 No copyright infringement</p>
              <p>💜 Made with love by Swifties</p>
            </div>
          </div>
        </div>

        <div className="border-t border-rose-200/40 mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Stories for a Showgirl. All original content belongs to its creators.</p>
          <p className="mt-1">
            Taylor Swift's music, lyrics, images, and all related intellectual property remain the property of Taylor Swift and her respective rights holders.
          </p>
        </div>
      </div>
    </footer>
  );
}
