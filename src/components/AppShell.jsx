import Header from './Header';
import Footer from './Footer';

/**
 * Every screen is the same three bands: sticky header, page column, footer.
 * `width` narrows the column for forms; the default is the design system's
 * 1200px page.
 */
const WIDTHS = {
  full: '',
  wide: 'max-w-[1000px]',
  narrow: 'max-w-2xl',
};

const AppShell = ({ children, width = 'wide', header = {}, className = '' }) => (
  <div className="min-h-screen flex flex-col bg-ground">
    <Header {...header} />
    <main className={`page py-8 flex-1 w-full ${WIDTHS[width]} ${className}`}>{children}</main>
    <Footer />
  </div>
);

export default AppShell;
